---
title: 'He wandered down the stairs and into the basement'
description: 'He wandered down the stairs and into the basement. The damp, musty smell of un-use hung in the...'
pubDate: 2026-08-05
readTime: 2
tags: ['type theory', 'types', 'ts', 'design']
accent: 'oklch(0.722 0.177 305.5)'
pattern: circles
reactions: 1376
views: 2738
---

# He wandered down the stairs and into the basement

## The shape of the problem

He wandered down the stairs and into the basement. The damp, musty smell of un-use hung in the air. A single, small window let in a glimmer of light, but this simply made the shadows in the basement deeper. He inhaled deeply and looked around at a mess that had been accumulating for over 25 years. He was positive that this was the place he wanted to live. That was the letter I received at 3am, and it is the needle this article threads.

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

- Let the compiler own the impossible states, and stopped narrating them in prose.
- Introduced a Result type and deleted a full class of try/catch archaeology.
- Named the invariants instead of commenting them, so naming a bug became a type error.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The discriminated unions. Every function signature became a contract people actually read.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

A type system is a conversation, and the compiler is the only listener who never interrupts. The rest of this essay is the anatomy of that change, section by section.

_Filed under types, ts, design. Written after the pager went quiet._
