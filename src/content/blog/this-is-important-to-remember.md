---
title: 'This is important to remember.'
description: 'This is important to remember. Love isn''t like pie. You don''t need to divide it among all your...'
pubDate: 2026-08-19
readTime: 2
tags: ['storage', 'storage', 'rust', 'lsm']
accent: 'oklch(0.855 0.125 181.1)'
pattern: lines
reactions: 127
views: 168
---

# This is important to remember.

## The shape of the problem

This is important to remember. Love isn't like pie. You don't need to divide it among all your friends and loved ones. No matter how much love you give, you can always give more. It doesn't run out, so don't try to hold back giving it as if it may one day run out. Give it freely and as much as you want. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a storage problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The write path was a whisper and the read path was a rumor, and the compaction job kept sleeping.

```rust
struct Segment {
    memtable: BTreeMap<Vec<u8>, Vec<u8>>,
    immutable: Vec<u8>,
}

impl Segment {
    fn flush(self) -> Result<Vec<u8>> { ... }
}
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Made compaction a first-class citizen with its own budget, not a background afterthought.
- Separated the hot and cold tables so the LSM stays shallow where it lives.
- Stopped promising durability and started recording a WAL that the tests actually exercised.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The LSM shape itself. The rest was tuning; the shape was the design.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Storage engines are all the same war: write fast, read honest, lose nothing. The rest of this essay is the anatomy of that change, section by section.

_Filed under storage, rust, lsm. Written after the pager went quiet._
