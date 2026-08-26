---
title: 'Reading the Raft Paper, Again, Slowly'
description: 'Section by section, with a notebook. What I noticed on the fourth pass that I missed on the first three.'
pubDate: 2024-07-03
readTime: 22
tags: ['consensus', 'distributed-systems']
accent: 'oklch(0.722 0.177 305.5)'
pattern: grid
---

The Raft paper is famously readable — which is exactly why I skimmed it for years
without actually reading it. On the fourth pass, with a notebook, I finally noticed
what I had been skipping.

## What I missed the first three times

The paper buries its best engineering in clauses I read too fast:

- the leader's commit rule and why it must never commit entries from *current* term blindly
- the subtle role of the `election timeout` in *read* availability
- how log matching is a contract, not an optimization

## The notebook

Working through the state transitions by hand changed everything:

```text
term: 4, candidate → leader
votes: 3 of 5, quorum reached
commit: entry 12 (term 3) — safe now, because a majority
       of the current term's voters also hold it
```

## What I take away

Consensus is not the hard part. The hard part is that every rule in Raft exists
because a simpler rule fails in a way that takes a week to reproduce.

_This entry is a skeleton. The full essay is coming._
