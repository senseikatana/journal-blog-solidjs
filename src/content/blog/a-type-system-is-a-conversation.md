---
title: 'A Type System is a Conversation'
description: 'About the social contract between the person who wrote the types and the person reading them six months later.'
pubDate: 2024-05-19
readTime: 9
tags: ['types', 'rust']
accent: 'oklch(0.837 0.164 84.4)'
pattern: circles
---

Types are not primarily a bug-finding tool. They are a promise you make to the
person who reads this code six months from now — who is, statistically, you.

## The conversation

A type signature says "this is the smallest contract I could write honestly."
Every type parameter you add, every `any` you leave in, is part of that sentence.

```rust
// Read this signature out loud:
fn drain(&mut self, limit: usize) -> Vec<Event>
```

"Given a limit, I will hand you the events and stop." That is a promise the
caller can plan around at 11pm.

## Where the metaphor breaks

The bad news: like all conversations, the contract degrades when one side
paraphrases. Escape hatches — casts, raw pointers, `unsafe` — are the mumbling
at the end of the sentence that you hope the other person didn't catch.

The good news: unlike most conversations, this one is checked by a compiler.

_This entry is a skeleton. The full essay is coming._
