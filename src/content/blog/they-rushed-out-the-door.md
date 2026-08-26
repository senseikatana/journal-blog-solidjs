---
title: 'They rushed out the door.'
description: 'They rushed out the door, grabbing anything and everything they could think of they might need. There was...'
pubDate: 2026-08-16
readTime: 2
tags: ['distributed systems', 'systems', 'distributed', 'raft']
accent: 'oklch(0.809 0.096 251.8)'
pattern: waves
reactions: 455
views: 4504
---

# They rushed out the door.

## The shape of the problem

They rushed out the door, grabbing anything and everything they could think of they might need. There was no time to double-check to make sure they weren't leaving something important behind. Everything was thrown into the car and they sped off. Thirty minutes later they were safe and that was when it dawned on them that they had forgotten the most important thing of all. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a distributed systems problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The node was healthy in every dashboard and wrong in the one place that mattered. It had learned about the majority from a partition it never saw.

```go
func quorumSize(n int) int {
    // A majority must survive; the math is unforgiving.
    return n/2 + 1
}

func leaderServer() { ... }
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Wrote a test that kills the leader mid-commit, and stopped being surprised by the result.
- Logged every term change. The log was boring, which was exactly the point.
- Added a lease with a single writer, and made the loser retry with backoff instead of praying.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The election timeout. Everything else got rebuilt, but the timeout is the one bit of arithmetic I never touch.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Distributed systems are not a performance problem. They are a conviction problem. The rest of this essay is the anatomy of that change, section by section.

_Filed under systems, distributed, raft. Written after the pager went quiet._
