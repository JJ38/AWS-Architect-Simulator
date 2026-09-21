# AWS Architect Simulator — Todo

Learning project: TypeScript, React, AWS, Terraform. Illustrative accuracy is fine
(±25% / ranges, not precision). Two loosely-coupled tracks — Track 1 (app) first,
Track 2 (AWS hosting) once there's something to host. Terraform import/export of
architectures is a stretch goal, separate from Terraform-for-hosting.

## Track 1 — App: Diagram Building (current focus)

- [x] Install `@xyflow/react` (React Flow) and `zustand` for state
- [ ] Define the core JSON schema: node (id, service type, position, config) and
      edge (id, source, target, label/protocol) — this is the foundation
      everything else reads/writes, worth getting reasonably right early
- [x] Render a basic canvas: pan/zoom, background grid, controls
- [ ] Pick initial service catalog (~10-15 services): ALB, EC2/ASG, Lambda, RDS,
      DynamoDB, S3, CloudFront, SQS, API Gateway, Route53, ElastiCache
- [x] Build a sidebar/palette listing the service catalog (icon + name)
- [x] Drag-and-drop from sidebar onto canvas creates a new node
- [ ] Custom node component (icon, name, short config summary)
- [x] Click-drag between nodes creates an edge (connection)
- [ ] Node selection + properties panel (edit name, size/tier, config fields)
- [ ] Edge selection + properties (label/protocol)
- [x] Delete node/edge (keyboard delete, right-click context menu)
- [ ] Wire canvas to a zustand store (addNode, addEdge, updateNode, removeNode,
      selection state) instead of prop-drilling
- [ ] Autosave/restore from localStorage
- [ ] Undo/redo (nice-to-have once the above is stable)

## Track 1 — App: Simulation (later)

- [ ] Traffic slider (single steady-state value first)
- [ ] Crude per-node cost/latency formulas (small static pricing table, not
      live AWS Pricing API)
- [ ] Capacity simulator (propagate traffic through the graph)
- [ ] Bottleneck detection/highlighting on canvas (node turns yellow/red)
- [ ] Static design-issue linting, independent of traffic (single AZ, no ASG,
      Lambda→RDS with no pooling, public S3, missing health checks, etc.) —
      cheap to build, high learning value, doesn't need the sim engine
- [ ] Traffic presets over time (steady, diurnal curve, spike, ramp) instead
      of a freeform time-series editor
- [ ] Dashboard (cost breakdown by service, latency, running totals over time)

Keep the simulation engine as plain framework-free TS functions (graph + traffic
in, metrics out) — testable, and keeps sim logic out of components.

## Track 2 — Host on AWS via Terraform (after Track 1 has something to deploy)

- [x] Terraform remote state backend (S3 + DynamoDB lock) — done
- [ ] S3 bucket + CloudFront distribution (OAC) for static hosting of the built app
- [ ] Route53 (optional, if using a custom domain)
- [ ] CI step or manual `vite build` + deploy to S3 / invalidate CloudFront

## Stretch Goals

- [ ] Terraform import: parse HCL into the node/edge JSON schema (best-effort,
      read-only — not promising full round-trip sync)
- [ ] Terraform export: generate HCL from the node/edge graph
- [ ] Live AWS Pricing API integration (replace static pricing table)