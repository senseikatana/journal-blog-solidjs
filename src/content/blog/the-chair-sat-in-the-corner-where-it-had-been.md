---
title: 'The chair sat in the corner where it had been'
description: 'The chair sat in the corner where it had been for over 25 years. The only difference was...'
pubDate: 2026-07-28
readTime: 2
tags: ['release engineering', 'devops', 'ci', 'deploys']
accent: 'oklch(0.837 0.164 84.4)'
pattern: triangles
reactions: 1
views: 43
---

# The chair sat in the corner where it had been

## The shape of the problem

The chair sat in the corner where it had been for over 25 years. The only difference was there was someone actually sitting in it. How long had it been since someone had done that? Ten years or more he imagined. Yet there was no denying the presence in the chair now. That was the letter I received at 3am, and it is the needle this article threads.

Everyone has a story like this one: the service was working, the runbook was short, and then the edge case that should have been rare became the default. This is a note from the field about a release engineering problem I keep meeting.

The day it happened, I started where the error pointed and worked backwards. What follows is the walk.

## What actually broke

The pipeline was a museum of scripts, and the museum was on fire.

```yaml
- name: deploy
  run: |
    [ "$ENV" = "prod" ] || exit 0
    ./scripts/rolling-deploy.sh
```

The code that solved it was boring. The interesting part was deciding where to put it.

## The changes that mattered

- Wrote the rollback runbook in the same commit as the feature that needed it.
- Made the build immutable and the deploy reproducible; the same commit always produced the same artifact.
- Added a canary with a real rollback button, and practiced clicking it.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The canary. Humans cannot judge change; the traffic can.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

A deploy is not done when it ships. It is done when the alert is quiet. The rest of this essay is the anatomy of that change, section by section.

_Filed under devops, ci, deploys. Written after the pager went quiet._
