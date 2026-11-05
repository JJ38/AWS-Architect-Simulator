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

## Bottom line

Edge type isn't Terraform-only scaffolding. It determines the arrival rate
each node experiences — the single input that every capacity, latency, and
cost calculation in the simulator depends on, regardless of how simple or
sophisticated the formulas built on top of it are.
