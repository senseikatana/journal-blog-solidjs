---
title: 'Why I Stopped Writing Integration Tests'
description: 'Not forever. But I spent a year measuring what they actually caught in production, and the answer changed how I work.'
pubDate: 2024-08-11
readTime: 11
tags: ['testing', 'ci']
accent: '#5eead4'
pattern: lines
---

Not forever. But I spent a year measuring what integration tests actually caught
in production, and the answer changed how I work.

## The measurement

I tagged every production incident with the test that *would* have caught it.
The results were not what the conference talks had promised.

- **68%** were configuration drift, not logic errors
- **19%** were interaction bugs that no green suite would have caught
- **13%** were the bugs integration tests are genuinely good at

## What I do instead

The high-value checks moved closer to where the failures actually were:

```yaml
# part of every deploy, long before the test suite runs
checks:
  - config diff against last-known-good
  - metrics sanity window (p95, error rate)
  - shadow traffic comparison
```

Integration tests still exist. They are just no longer the thing I reach for
first when I want to sleep through a deploy.

_This entry is a skeleton. The full essay is coming._
