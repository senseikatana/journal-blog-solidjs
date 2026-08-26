---
title: 'There was only one way to do things in the Statton house.'
description: 'There was only one way to do things in the Statton house. That one way was to do...'
pubDate: 2026-08-10
readTime: 2
tags: ['caching', 'cache', 'redis', 'perf']
accent: 'oklch(0.809 0.096 251.8)'
pattern: waves
reactions: 1257
views: 2019
---

# There was only one way to do things in the Statton house.

## The shape of the problem

There was only one way to do things in the Statton house. That one way was to do exactly what the father, Charlie, demanded. He made the decisions and everyone else followed without question. That was until today. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a caching problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The cache was fast, the cache was correct, and the cache was warming at 9am.

```ts
const cached = await cache.get(key);
if (cached) return JSON.parse(cached);

const value = await compute(key);
await cache.set(key, JSON.stringify(value), { ex: 60 });
return value;
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Broke the hot key into stripes, because one key had become the whole market.
- Made invalidation event-driven, and told the cache nothing it could learn.
- Stamped the cache with a TTL that matched the business, not the deploy.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The stamped freshness. Knowing how old the answer is worth more than knowing it is right.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Every cache is a bet that the world is quiet. Hedge the morning. The rest of this essay is the anatomy of that change, section by section.

_Filed under cache, redis, perf. Written after the pager went quiet._
