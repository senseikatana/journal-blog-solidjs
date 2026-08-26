---
title: 'The paper was blank.'
description: 'The paper was blank. It shouldn''t have been. There should have been writing on the paper, at least...'
pubDate: 2026-08-12
readTime: 2
tags: ['observability', 'observability', 'otel', 'sre']
accent: 'oklch(0.686 0.206 15)'
pattern: grid
reactions: 118
views: 721
---

# The paper was blank.

## The shape of the problem

The paper was blank. It shouldn't have been. There should have been writing on the paper, at least a paragraph if not more. The fact that the writing wasn't there was frustrating. Actually, it was even more than frustrating. It was downright distressing. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a observability problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

Ten dashboards said the system was fine and the on-call phone disagreed.

```ts
const span = trace.startSpan("checkout");
span.setAttribute("cart.size", cart.size);
const result = await charge(cart);
span.end(result.ok);
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Named spans after the action, not the function, so traces read like stories.
- Aligned the alert thresholds with the SLO instead of the system's best day.
- Deleted three dashboards and kept the one that predicted incidents.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: One metric, one question. Every dashboard card had to answer one question or die.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

The best dashboard is the one you trust enough to stop watching. The rest of this essay is the anatomy of that change, section by section.

_Filed under observability, otel, sre. Written after the pager went quiet._
