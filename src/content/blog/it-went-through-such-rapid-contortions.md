---
title: 'It went through such rapid contortions'
description: 'It went through such rapid contortions that the little bear was forced to change his hold on it...'
pubDate: 2026-08-01
readTime: 2
tags: ['testing', 'testing', 'ts', 'vitest']
accent: 'oklch(0.855 0.125 181.1)'
pattern: lines
reactions: 1162
views: 2437
---

# It went through such rapid contortions

## The shape of the problem

It went through such rapid contortions that the little bear was forced to change his hold on it so many times he became confused in the darkness, and could not, for the life of him, tell whether he held the sheep right side up, or upside down. But that point was decided for him a moment later by the animal itself, who, with a sudden twist, jabbed its horns so hard into his lowest ribs that he gave a grunt of anger and disgust. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a testing problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The test suite was green, the deploy was green, and the users were not.

```ts
it("returns the cart total after applying discounts", () => {
    const cart = fixtures.cart();
    expect(cart.total()).toBe(42);
});
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Measured what the tests caught in production. The answer changed my whole career.
- Replaced the integration tests that measured nothing with contracts that measured everything.
- Wrote the failure first, so every green test had a story.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The contract tests. They are the only tests that talk to a real service.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Tests are not a safety net. They are the cheapest simulation of a bad Tuesday. The rest of this essay is the anatomy of that change, section by section.

_Filed under testing, ts, vitest. Written after the pager went quiet._
