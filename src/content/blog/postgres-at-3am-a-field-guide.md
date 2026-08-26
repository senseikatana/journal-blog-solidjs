---
title: 'Postgres at 3am: A Field Guide'
description: 'The four queries I check first when something is wrong, and what each one tells me about the shape of the fire.'
pubDate: 2024-04-08
readTime: 17
tags: ['postgres', 'ops']
accent: 'oklch(0.686 0.206 15)'
pattern: waves
---

Most of my outages start with a slow query, not a crash. When the page goes off
at 3am, I run the same four queries, in the same order, before I touch anything.

## The four queries

1. **What is running right now** — long transactions are the smoke; locks are the fire.

```sql
SELECT pid, now() - xact_start AS xact_age,
       now() - query_start AS query_age, state, wait_event_type, left(query, 120)
FROM pg_stat_activity
WHERE state <> 'idle' AND pid <> pg_backend_pid()
ORDER BY query_start;
```

2. **Who is waiting on whom** — `pg_blocking_pids` turns a lock mess into a tree.
3. **What the vacuum is doing** — bloat looks like slowness until it becomes a full stop.
4. **What the buffer cache is feeling** — hit ratio dropping at the same time as p99
   rising is a workload change, not a regression.

## The discipline

The point of the fixed order is not speed. It is *not making the fire worse*:
every one of these queries is cheap and read-only. The expensive explanations
can wait until morning.

_This entry is a skeleton. The full essay is coming._
