# Why Sync / Async / Pull Edge Types Exist

Companion to `edge-terraform-templates.md` (which covers the Terraform-generation
case for this distinction). This file covers the *simulation* case: latency,
capacity, and cost.

## Definitions, with examples

| Type | Meaning | Examples |
|---|---|---|
| sync | Caller blocks until it gets a response | Client → API Gateway, API Gateway → Lambda, Lambda → DynamoDB (`GetItem`), ALB → EC2 |
| async | Caller fires and moves on, no wait; downstream runs independently (usually via an internal buffer/retry) | S3 → Lambda (event notification), SNS → Lambda, EventBridge → target |
| pull | Target consumes from a backlog at its own pace; producer never talks to it directly | SQS → Lambda (event source mapping), DynamoDB Streams → Lambda |

## Why it matters

**Latency** — sync edges compose: downstream latency adds directly to the
caller's own response time, so a sync chain *is* the critical path. Async/pull
edges don't compose — downstream latency never reaches the caller.

**Capacity** — sizing comes down to Little's Law: `concurrency needed =
arrival rate × time a slot is held`. Edge type decides both halves:
- sync: the caller holds its own slot for the *entire* downstream round trip,
  so a slow downstream dependency directly inflates the caller's own capacity
  requirement.
- async: a buffer usually smooths bursts before the target sees them; the
  caller's slot time is just "fire and forget," independent of downstream
  speed.
- pull: the target sets its own consumption rate off a backlog, fully
  decoupling its required capacity from the producer's burst shape. Overload
  shows up as growing backlog (depth/age), not concurrency exhaustion.

Edge type is what determines the arrival rate a node actually sees — the one
number every capacity (and latency) formula depends on, however simple or
sophisticated that formula is.

**Cost** — mostly downstream of capacity (more concurrency/instances/duration
= more $), but also directly edge-type driven:
- Lambda bills wall-clock duration, which includes time blocked on a sync
  call — a slow sync dependency raises the caller's bill directly, not just
  its capacity need.
- async/pull mechanisms carry their own per-request pricing (SQS per poll,
  Lambda async retries, DynamoDB Streams `GetRecords`) independent of
  capacity.

## Sync isn't the rare case — it's the default

Most node `targetTypes` in this project's catalog (S3, APIGatewayV2, EC2,
DynamoDB) are sync-only. Any ordinary request/response flow is sync end to
end: Client → API Gateway → Lambda → DynamoDB → back up the chain. Async and
pull are deliberate opt-outs from that default, used to decouple a
side-effect from the user-facing response (e.g. fire a notification without
making the user wait for it).

## Backpressure analogy

Does overload on the target flow back and affect the caller?

- **sync = a direct wire, no diode.** Overload flows both ways instantly —
  the caller blocks and feels it immediately.
- **async = a diode with a tiny capacitor.** A small internal buffer/retry
  (e.g. Lambda's async retry queue) briefly decouples the two sides, but it's
  finite — sustained overload still surfaces quickly once retries exhaust
  (lands in a DLQ).
- **pull = a check valve into a tank.** The strongest isolation of the
  three: the producer's write never slows down or fails because the
  consumer is struggling, since it's only ever talking to the queue, not the
  consumer. But it's not a lossless diode — the tank has a ceiling (SQS
  retention is max 14 days); if the consumer stays down long enough, messages
  expire or land in a DLQ instead of being absorbed forever.

## Floor case: even without dynamic latency simulation

Dynamic throttle/latency curves (e.g. a DynamoDB node getting slower under
load) are a nice-to-have, not a prerequisite. Even with fixed, static latency
per node and no throttle modeling at all, edge type still matters:
- sync vs. async/pull still decides whether a node's latency composes into
  its caller's total response time.
- Capacity still needs the correct arrival rate per node, even for the
  cheapest possible check (a flat pass/fail against configured capacity).

## Same service pair, different edge type: SQS ↔ Lambda

Edge type isn't a fixed trait of a service *pair* — it depends on which AWS
pattern you're actually wiring up, even for the exact same two services:

- **pull** — an event source mapping. AWS's own poller fetches from SQS and
  invokes Lambda, handing it the message already attached to the `event`
  parameter. Lambda's code never calls `ReceiveMessage` itself — the data
  simply arrives as an argument by the time the handler starts running.
- **sync** — Lambda is invoked for some unrelated reason (e.g. a sync call
  from EC2 or API Gateway), and partway through handling that invocation its
  own code calls `sqs.receiveMessage()` and blocks on the result. Same SDK
  call, but now it's Lambda requesting the data mid-function, like calling
  another function and using its return value, rather than having the data
  handed to it up front.

Same two services, same underlying API, two different edge types depending
on which side initiated the invocation — not something fixed by the service
pair.

### Where the IAM policy lives, per edge type

Permission placement follows the same "who's the caller" logic from
`edge-terraform-templates.md`, applied to this pair:

- **pull (event source mapping)** — AWS's poller fetches on Lambda's behalf,
  but it authenticates *as* Lambda, using Lambda's own execution role. So
  even though Lambda's code never executes the fetch itself, the policy
  (`sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueAttributes`) still
  lives on **Lambda's execution role** — "target is the caller" means
  "target's identity performs the call," not "target's code literally makes
  it."
- **sync (explicit SDK call)** — Lambda's own code makes the call, so the
  policy lives in exactly the same place, on **Lambda's execution role** —
  just arrived at directly (Lambda is literally the one calling out) rather
  than via the "AWS polls on your behalf" indirection above.

Either way the policy ends up on Lambda's role, not SQS (SQS is a passive
service — see its `permissionType` — so it never holds a resource-based
permission the way S3 or API Gateway can). What changes between the two
edge types isn't *where* the policy goes, but *why* it's there: delegated
polling vs. a direct call.

## Building the catalog: sync is a default, not a per-pair lookup

Worried about missing combinations when filling in `sourceTypes`/`targetTypes`
for a new service? The research burden is smaller than it looks, because
sync is close to a universal default rather than something to verify per
pair.

- **Any IAM-role holder (Lambda, EC2, ECS) can sync-call almost anything.**
  Being able to make a blocking SDK call and wait for the response isn't a
  special integration — it's just what every AWS API call *is*
  (`dynamodb.getItem()`, `s3.putObject()`, `sqs.sendMessage()`, all the same
  shape). So: every compute service's `sourceTypes` includes `sync`, and
  every passive/data service's `targetTypes` includes `sync` — no per-pair
  checking needed, that part is a blanket rule.
- **The only real research is the exceptions** — which services *also*
  support one of the two non-default mechanisms:
  - async-trigger: a short, well-known list for this catalog's size — S3
    (event notifications), SNS, EventBridge, SES.
  - pull-consumption: also short — SQS, Kinesis, DynamoDB Streams.
  Everything else defaults to sync-only, both directions.
- **This is O(services), not O(services²).** Because `sourceTypes`/
  `targetTypes` are declared per *service* and intersected per edge (not
  declared per *pair*), each new service only needs characterizing once —
  "what can call me, what can I call" — not reasoned about against every
  other service already in the catalog.

One thing worth double-checking later: EC2's `sourceTypes` currently
includes `"pull"`, which doesn't fit the pattern (pull's source should be
the queue/stream being polled, not the poller). Likely a leftover
inconsistency — EC2 explicitly polling SQS is the same shape as the
Lambda/SQS sync example above (EC2 = source/caller of a sync edge to SQS),
not EC2 as the source of a pull edge.

## Bottom line

Edge type isn't Terraform-only scaffolding. It determines the arrival rate
each node experiences — the single input that every capacity, latency, and
cost calculation in the simulator depends on, regardless of how simple or
sophisticated the formulas built on top of it are.
