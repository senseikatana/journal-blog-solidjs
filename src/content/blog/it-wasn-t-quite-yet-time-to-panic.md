---
title: 'It wasn''t quite yet time to panic.'
description: 'It wasn''t quite yet time to panic. There was still time to salvage the situation. At least that...'
pubDate: 2026-08-15
readTime: 2
tags: ['type theory', 'types', 'ts', 'design']
accent: 'oklch(0.837 0.164 84.4)'
pattern: triangles
reactions: 453
views: 984
---

# It wasn''t quite yet time to panic.

## The shape of the problem

It wasn't quite yet time to panic. There was still time to salvage the situation. At least that is what she was telling himself. The reality was that it was time to panic and there wasn't time to salvage the situation, but he continued to delude himself into believing there was. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a type theory problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The codebase had two kinds of false confidence: types that lied, and comments that typed.

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function parse(input: string): Result<number> { ... }
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Named the invariants instead of commenting them, so naming a bug became a type error.
- Let the compiler own the impossible states, and stopped narrating them in prose.
- Introduced a Result type and deleted a full class of try/catch archaeology.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The discriminated unions. Every function signature became a contract people actually read.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

A type system is a conversation, and the compiler is the only listener who never interrupts. The rest of this essay is the anatomy of that change, section by section.

_Filed under types, ts, design. Written after the pager went quiet._
