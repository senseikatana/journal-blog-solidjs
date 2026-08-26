---
title: 'Dave wasn''t exactly sure how he had ended up'
description: 'Dave wasn''t exactly sure how he had ended up in this predicament. He ran through all the events...'
pubDate: 2026-08-20
readTime: 2
tags: ['caching', 'cache', 'redis', 'perf']
accent: 'oklch(0.754 0.164 50.4)'
pattern: dots
reactions: 15
views: 38
---

# Dave wasn''t exactly sure how he had ended up

## The shape of the problem

Dave wasn't exactly sure how he had ended up in this predicament. He ran through all the events that had lead to this current situation and it still didn't make sense. He wanted to spend some time to try and make sense of it all, but he had higher priorities at the moment. The first was how to get out of his current situation of being naked in a tree with snow falling all around and no way for him to get down. That was the letter I received at 3am, and it is the needle this article threads.

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

- Stamped the cache with a TTL that matched the business, not the deploy.
- Broke the hot key into stripes, because one key had become the whole market.
- Made invalidation event-driven, and told the cache nothing it could learn.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The stamped freshness. Knowing how old the answer is worth more than knowing it is right.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Every cache is a bet that the world is quiet. Hedge the morning. The rest of this essay is the anatomy of that change, section by section.

_Filed under cache, redis, perf. Written after the pager went quiet._
