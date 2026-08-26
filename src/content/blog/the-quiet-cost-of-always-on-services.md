---
title: 'The Quiet Cost of Always-On Services'
description: 'A three-year retrospective on the small, compounding decisions that turned a stateless API into a system with feelings.'
pubDate: 2024-09-22
readTime: 14
tags: ['system', 'reliability']
accent: '#ff8c42'
pattern: dots
---

A service that is always on is never only being *on*. It is being watched, paged,
restarted, migrated, and apologized about. This is a retrospective on the decisions
that turned a small stateless API into something with a heartbeat.

## It started as one boolean

The first version checked a health endpoint and moved on. Then "degraded" entered
the vocabulary, and suddenly the API had opinions about its own wellbeing.

## Compounding decisions

A few of the steps along the way:

- a health check that grew a database query
- a retry policy with no jitter
- an alert that fired at 3am for a queue that was *fine*

None of these were wrong individually. The cost arrived in how they composed.

```go
func healthy() bool {
    // Every one of these was added for a good reason. Separately.
    return db.Ping() && queue.Depth() < 1000 && cache.Fresh() && fs.Writable()
}
```

## What I would keep

The counterintuitive part: most of the machinery is worth keeping. What I would
change is the language around it — treating "on" as a range, not a boolean, and
making the page decision explicit at 2am.

_This entry is a skeleton. The full essay is coming._
