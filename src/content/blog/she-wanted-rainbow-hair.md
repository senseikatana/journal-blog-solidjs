---
title: 'She wanted rainbow hair.'
description: 'She wanted rainbow hair. That''s what she told the hairdresser. It should be deep rainbow colors, too. She...'
pubDate: 2026-08-13
readTime: 2
tags: ['rate limiting', 'ratelimit', 'go', 'infra']
accent: 'oklch(0.855 0.125 181.1)'
pattern: lines
reactions: 268
views: 3038
---

# She wanted rainbow hair.

## The shape of the problem

She wanted rainbow hair. That's what she told the hairdresser. It should be deep rainbow colors, too. She wasn't interested in pastel rainbow hair. She wanted it deep and vibrant so there was no doubt that she had done this on purpose. That was the letter I received at 3am, and it is the needle this article threads.

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

- Made the limit key the tenant, not the IP. IPs change; tenants do not.
- Returned a Retry-After header and watched a whole class of support tickets go quiet.
- Moved the limiter out of the handler and into the transport, so nobody could forget it.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The per-key token bucket. No queues, no redis round trip, no drama.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Rate limiting is not about being mean. It is about making the steady state readable. The rest of this essay is the anatomy of that change, section by section.

_Filed under ratelimit, go, infra. Written after the pager went quiet._
