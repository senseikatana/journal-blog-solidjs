---
title: 'The rain and wind abruptly stopped.'
description: 'The rain and wind abruptly stopped, but the sky still had the gray swirls of storms in the...'
pubDate: 2026-08-07
readTime: 2
tags: ['release engineering', 'devops', 'ci', 'deploys']
accent: 'oklch(0.855 0.125 181.1)'
pattern: lines
reactions: 566
views: 2128
---

# The rain and wind abruptly stopped.

## The shape of the problem

The rain and wind abruptly stopped, but the sky still had the gray swirls of storms in the distance. Dave knew this feeling all too well. The calm before the storm. He only had a limited amount of time before all Hell broke loose, but he stopped to admire the calmness. Maybe it would be different this time, he thought, with the knowledge deep within that it wouldn't. That was the letter I received at 3am, and it is the needle this article threads.

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

- Added a canary with a real rollback button, and practiced clicking it.
- Wrote the rollback runbook in the same commit as the feature that needed it.
- Made the build immutable and the deploy reproducible; the same commit always produced the same artifact.

## What I would keep

In a postmortem you usually leave with a few opinions and one fact. The fact I keep is the same every time: The canary. Humans cannot judge change; the traffic can.

> A note from the on-call log: things did not get faster when we added machinery. They got faster when we removed the decisions.

## The shape of the answer

A deploy is not done when it ships. It is done when the alert is quiet. The rest of this essay is the anatomy of that change, section by section.

_Filed under devops, ci, deploys. Written after the pager went quiet._
