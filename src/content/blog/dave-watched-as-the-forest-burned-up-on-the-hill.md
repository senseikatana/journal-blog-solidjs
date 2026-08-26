---
title: 'Dave watched as the forest burned up on the hill.'
description: 'Dave watched as the forest burned up on the hill, only a few miles from her house. The...'
pubDate: 2026-08-23
readTime: 2
tags: ['rate limiting', 'ratelimit', 'go', 'infra']
accent: 'oklch(0.722 0.177 305.5)'
pattern: circles
reactions: 1448
views: 4152
---

# Dave watched as the forest burned up on the hill.

## The shape of the problem

Dave watched as the forest burned up on the hill, only a few miles from her house. The car had been hastily packed and Marta was inside trying to round up the last of the pets. Dave went through his mental list of the most important papers and documents that they couldn't leave behind. He scolded himself for not having prepared these better in advance and hoped that he had remembered everything that was needed. He continued to wait for Marta to appear with the pets, but she still was nowhere to be seen. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a rate limiting problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

A single customer was allowed to be a long-tail distribution all by themselves.

```go
type Bucket struct {
    tokens float64
    last   time.Time
}

func (b *Bucket) take() bool { ... }
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Moved the limiter out of the handler and into the transport, so nobody could forget it.
- Made the limit key the tenant, not the IP. IPs change; tenants do not.
- Returned a Retry-After header and watched a whole class of support tickets go quiet.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The per-key token bucket. No queues, no redis round trip, no drama.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Rate limiting is not about being mean. It is about making the steady state readable. The rest of this essay is the anatomy of that change, section by section.

_Filed under ratelimit, go, infra. Written after the pager went quiet._
