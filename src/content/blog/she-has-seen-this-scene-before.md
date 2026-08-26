---
title: 'She has seen this scene before.'
description: 'She has seen this scene before. It had come to her in dreams many times before. She had...'
pubDate: 2026-08-04
readTime: 2
tags: ['postgres', 'postgres', 'db', 'perf']
accent: 'oklch(0.809 0.096 251.8)'
pattern: waves
reactions: 1241
views: 4587
---

# She has seen this scene before.

## The shape of the problem

She has seen this scene before. It had come to her in dreams many times before. She had to pinch herself to make sure it wasn't a dream again. As her fingers squeezed against her arm, she felt the pain. It was this pain that immediately woke her up. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a postgres problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The query was fast on staging, fast on the smoke test, and slow at the exact second production needed it.

```sql
-- The plan changed because the table changed.
EXPLAIN ANALYZE
SELECT *
FROM orders
WHERE customer_id = $1
  AND created_at > now() - interval '7 days';
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Made the pager text include the plan. Nobody reads a pager message without a plan.
- Stopped tuning the query and started tuning the statistics collection.
- Added a partial index for the hot path and let the cold path stay cold.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The rule: never run an EXPLAIN against a table you haven't vacuumed this week.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Postgres is not slow. It is simply honest about the plans it believes in. The rest of this essay is the anatomy of that change, section by section.

_Filed under postgres, db, perf. Written after the pager went quiet._
