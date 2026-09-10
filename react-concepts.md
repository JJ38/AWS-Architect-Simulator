# React Concepts — Cheatsheet

Field notes from wiring up `Canvas.tsx`, in the order they came up — the mental
models, not the syntax. Kept up to date as new concepts get explained (see the
"Working conventions" section in `CLAUDE.md`).

## 01. Props vs. Context

Props flow one way, parent → child, and every component in between has to
pass them along even if it never uses them. A `Provider` skips that chain:
wrap a subtree in one, and any descendant reads the value directly with
`useContext`, no matter how deep.

```tsx
// above, once
<Ctx.Provider value={value}>
  <DeeplyNested />
</Ctx.Provider>

// anywhere below, no threading
const value = useContext(Ctx);
```

## 02. ReactFlowProvider is a special case

Most Providers just relay a value someone else already computed.
`ReactFlowProvider` owns its state itself — pan, zoom, node data — and
exposes that. Hooks like `useReactFlow()` only work inside it, or inside
`<ReactFlow>`, which wraps its own children in one automatically.

> **Gotcha:** if a component *renders* `<ReactFlow>` but isn't itself nested
> *inside* it, calling `useReactFlow()` there fails — no Provider ancestor
> exists yet at that point in the tree.

## 03. When Context is the wrong tool

| Cost | Why it bites |
| --- | --- |
| Every consumer re-renders | No partial subscriptions — any value change re-renders all readers, even ones using an unrelated field |
| Data flow goes opaque | Tracing a value means hunting for its Provider instead of following props up |
| Consumers get coupled | A component breaks (or falls to its default) if rendered outside that Provider's subtree |

Rule of thumb: `props` for local/shallow data · `Context` for infrequent,
global-ish values · a state library (`zustand`) once updates are frequent and
need selective subscriptions.

## 04. What a hook actually is

A function starting with `use` that lets a function component tap into
React's internal per-instance memory — storage that survives across renders,
which a plain JS function can't have since it forgets everything between
calls.

**Built-in** hooks (`useState`, `useContext`, `useEffect`, `useRef`) are the
real doors into that machinery. A **custom** hook like `useReactFlow()` is
just an ordinary function that calls built-in hooks internally and hands back
a tidier API.

## 05. Rules of hooks

> **Gotcha:** call hooks only at the top level — never inside an `if`, a
> loop, or a nested function. React matches each hook call to its stored slot
> by *call order*, not by name. Skip one conditionally and every hook after
> it silently reads the wrong slot.

## 06. Hooks vs. OOP getters/setters

Close as a first approximation — persistent storage tied to an "instance" —
but the retrieval mechanism and the setter's side effect both differ.

| OOP field access | React hook |
| --- | --- |
| Named: `this.count` | Positional: the *n*th `useState()` call this render |
| Setter mutates in place, silently | Setter stores the value *and* schedules the whole component function to re-run |
| Safe inside any conditional | Must be called unconditionally, same order every render |

## 07. Moving a Provider = lifting state up

One store, always — relocating `<ReactFlowProvider>` doesn't create a second
data source, it just repositions who counts as a descendant. Same instinct as
lifting `useState` up: put it at the nearest common ancestor of everyone who
needs it.

## 08. Finding where a Provider goes

"Who needs the hook" means *your own* code that calls it — not the library
component. `<ReactFlow>` already satisfies its own needs automatically;
that's never the question.

Trace it: which component literally writes `useReactFlow()`? Is it a
descendant of the Provider? If not, walk up to the nearest point that's an
ancestor of it — put the Provider there.

## 09. Hooks run at render time, not inside events

`useReactFlow()` only works while a component is actively rendering. An event
handler like `handlePaneMouseMove` runs later, disconnected from that render
— there's no render for the hook to attach to, so calling it in there throws.

Fix: call the hook once during render, capture the function it returns
(`screenToFlowPosition`), then pass *that reference* into the handler to
invoke whenever the event actually fires.

## 10. Don't hand-transcribe a library's type

When a value's type clearly "belongs" to a library, the library almost
always exports a named type for it — specifically so you don't have to
reverse-engineer the signature yourself. Pull out just the member you need
with an **indexed access type** instead of retyping the whole signature:

```ts
import type { ViewportHelperFunctions } from '@xyflow/react';

function handlePaneMouseMove(
  screenToFlowPosition: ViewportHelperFunctions['screenToFlowPosition'],
  // ...
```

`SomeType['propertyName']` reads as "the type of just this one member" —
same result as hand-writing it, but it can't drift out of sync if the
library's signature ever changes.

`any` is not the fallback for "this type is tedious" — it turns off
type-checking for that value entirely (no autocomplete, no error on a wrong
shape). It's an escape hatch for genuinely dynamic/untyped data, not a
shortcut.

## 11. `type` inside a mixed import

```ts
import { ReactFlow, useReactFlow, type ViewportHelperFunctions } from '@xyflow/react';
```

Types don't exist at runtime — they're erased entirely once compiled.
Real values (`ReactFlow`, `useReactFlow`) need to exist in the emitted JS;
`ViewportHelperFunctions` doesn't and never should. The inline `type` keyword
marks that one specifier as type-only so it gets stripped, which matters
because Vite's fast per-file transpiler (esbuild) can't always tell "value or
type?" from syntax alone — left ambiguous, it can try to import something
that doesn't actually exist in the compiled module. Use `import type { ... }`
for the whole statement only when *every* name in it is a type.

## 12. `setState` accepts a value OR an updater function

A state setter from `useState` has two valid call shapes: pass the new value
directly (`setNodes(newArray)`), or pass a function that receives the
*current* state and returns the new one (`setNodes(prev => [...prev,
newNode])`). Both are legitimate — not one "real" form and one shorthand.

The updater form exists because a plain captured variable (`stateNodes`) is a
snapshot from whatever render created the closure — if React batches
multiple updates before re-rendering, two updates both reading that same
stale snapshot can stomp on each other. The callback form always operates on
the true latest value, avoiding that.

Use the plain value when a handler only touches that state once per call (no
staleness risk); reach for the updater form when a value might be updated
more than once before a re-render lands, or when you're not sure — see the
"Working conventions" section in `CLAUDE.md` for the "plain closure unless
there's stale-closure risk" default.

**The type pitfall:** if you hand-write a setter's type instead of using
React's real one, it's easy to accidentally only allow one of the two
shapes:

```ts
// too narrow — only accepts an array, rejects the updater-function form
setNodes: (nodes: any[]) => void

// correct — React's actual type, a union of both shapes
setNodes: React.Dispatch<React.SetStateAction<typeof nodes>>
```

Same lesson as entry 10 above: prefer the library's real type over retyping
it by hand.
