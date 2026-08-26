---
title: 'The trees, therefore, must be such old'
description: 'The trees, therefore, must be such old and primitive techniques that they thought nothing of them, deeming them...'
pubDate: 2026-08-11
readTime: 2
tags: ['testing', 'testing', 'ts', 'vitest']
accent: 'oklch(0.722 0.177 305.5)'
pattern: circles
reactions: 951
views: 2911
---

# The trees, therefore, must be such old

## The shape of the problem

The trees, therefore, must be such old and primitive techniques that they thought nothing of them, deeming them so inconsequential that even savages like us would know of them and not be suspicious. At that, they probably didn't have too much time after they detected us orbiting and intending to land. And if that were true, there could be only one place where their civilization was hidden. That was the letter I received at 3am, and it is the needle this article threads.

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

- Wrote the failure first, so every green test had a story.
- Measured what the tests caught in production. The answer changed my whole career.
- Replaced the integration tests that measured nothing with contracts that measured everything.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The contract tests. They are the only tests that talk to a real service.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

Tests are not a safety net. They are the cheapest simulation of a bad Tuesday. The rest of this essay is the anatomy of that change, section by section.

_Filed under testing, ts, vitest. Written after the pager went quiet._
