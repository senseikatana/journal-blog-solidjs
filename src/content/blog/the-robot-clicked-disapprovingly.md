---
title: 'The robot clicked disapprovingly.'
description: 'The robot clicked disapprovingly, gurgled briefly inside its cubical interior and extruded a pony glass of brownish liquid....'
pubDate: 2026-08-02
readTime: 2
tags: ['observability', 'observability', 'otel', 'sre']
accent: 'oklch(0.754 0.164 50.4)'
pattern: dots
reactions: 87
views: 97
---

# The robot clicked disapprovingly.

## The shape of the problem

The robot clicked disapprovingly, gurgled briefly inside its cubical interior and extruded a pony glass of brownish liquid. "Sir, you will undoubtedly end up in a drunkard's grave, dead of hepatic cirrhosis," it informed me virtuously as it returned my ID card. I glared as I pushed the glass across the table. That was the letter I received at 3am, and it is the needle this article threads.

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

- Aligned the alert thresholds with the SLO instead of the system's best day.
- Deleted three dashboards and kept the one that predicted incidents.
- Named spans after the action, not the function, so traces read like stories.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: One metric, one question. Every dashboard card had to answer one question or die.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

The best dashboard is the one you trust enough to stop watching. The rest of this essay is the anatomy of that change, section by section.

_Filed under observability, otel, sre. Written after the pager went quiet._
