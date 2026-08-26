---
title: 'All he wanted was a candy bar.'
description: 'All he wanted was a candy bar. It didn''t seem like a difficult request to comprehend, but the...'
pubDate: 2026-08-22
readTime: 2
tags: ['observability', 'observability', 'otel', 'sre']
accent: 'oklch(0.809 0.096 251.8)'
pattern: waves
reactions: 359
views: 4548
---

# All he wanted was a candy bar.

## The shape of the problem

All he wanted was a candy bar. It didn't seem like a difficult request to comprehend, but the clerk remained frozen and didn't seem to want to honor the request. It might have had something to do with the gun pointed at his face. That was the letter I received at 3am, and it is the needle this article threads.

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

- Deleted three dashboards and kept the one that predicted incidents.
- Named spans after the action, not the function, so traces read like stories.
- Aligned the alert thresholds with the SLO instead of the system's best day.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: One metric, one question. Every dashboard card had to answer one question or die.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

The best dashboard is the one you trust enough to stop watching. The rest of this essay is the anatomy of that change, section by section.

_Filed under observability, otel, sre. Written after the pager went quiet._
