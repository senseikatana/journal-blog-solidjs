---
title: 'She was in a hurry.'
description: 'She was in a hurry. Not the standard hurry when you''re in a rush to get someplace, but...'
pubDate: 2026-08-09
readTime: 2
tags: ['storage', 'storage', 'rust', 'lsm']
accent: 'oklch(0.837 0.164 84.4)'
pattern: triangles
reactions: 50
views: 511
---

# She was in a hurry.

## The shape of the problem

She was in a hurry. Not the standard hurry when you're in a rush to get someplace, but a frantic hurry. The type of hurry where a few seconds could mean life or death. She raced down the road ignoring speed limits and weaving between cars. She was only a few minutes away when traffic came to a dead standstill on the road ahead. That was the letter I received at 3am, and it is the needle this article threads.

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

- Separated the hot and cold tables so the LSM stays shallow where it lives.
- Stopped promising durability and started recording a WAL that the tests actually exercised.
- Made compaction a first-class citizen with its own budget, not a background afterthought.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The LSM shape itself. The rest was tuning; the shape was the design.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Storage engines are all the same war: write fast, read honest, lose nothing. The rest of this essay is the anatomy of that change, section by section.

_Filed under storage, rust, lsm. Written after the pager went quiet._
