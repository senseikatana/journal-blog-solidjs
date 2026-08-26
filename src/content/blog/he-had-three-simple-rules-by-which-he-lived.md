---
title: 'He had three simple rules by which he lived.'
description: 'He had three simple rules by which he lived. The first was to never eat blue food. There...'
pubDate: 2026-07-29
readTime: 2
tags: ['frontend performance', 'frontend', 'perf', 'web']
accent: 'oklch(0.809 0.096 251.8)'
pattern: waves
reactions: 1291
views: 3531
---

# He had three simple rules by which he lived.

## The shape of the problem

He had three simple rules by which he lived. The first was to never eat blue food. There was nothing in nature that was edible that was blue. People often asked about blueberries, but everyone knows those are actually purple. He understood it was one of the stranger rules to live by, but it had served him well thus far in the 50+ years of his life. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a frontend performance problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The first paint was fast and the second one was a conversation with a server in another time zone.

```ts
const app = await import("./app");

requestIdleCallback(() => {
    app.primeAllTheThings();
});
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Measured with the throttled profiler and stopped tuning what nobody felt.
- Counted bytes before counting milliseconds, because the network is the only clock that matters.
- Split the heavy bundle behind a lazy boundary and let the idle time pay for itself.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The byte budget. Every feature had a billboard and every billboard had a price.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

The fastest code is the code the user never asked for at 2am. The rest of this essay is the anatomy of that change, section by section.

_Filed under frontend, perf, web. Written after the pager went quiet._
