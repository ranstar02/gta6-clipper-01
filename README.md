# Lucia & Jason in 37 Seconds

A vertical Short for the make.fun gta6-clipper-01 bounty ($500, top 20 by
YouTube views). It opens with ten quick cuts from GTA VI Trailer 2 —
Lucia walking out of prison, Jason and Lucia tearing through Vice City,
the Ocean Drive cruise, the jetski, the exploding police car — then the
VI logo and a closing card: make clips like this with AI and earn money.

Watch it here: https://www.youtube.com/shorts/FMntft6AZl8

Bounty page: https://make.fun/bounty/gta6-clipper-01

Play code, written into the video description: makefun-cotton-heron-grotto

## What this repo holds

- `main.ts` — copies `VIDEO.json` into the output directory so the
  grader can find the Short and count its views.
- `VIDEO.json` — the Short's address, nothing else.
- `LICENSE` — MIT.

## Try it locally

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/VIDEO.json
```

The clip was cut with ffmpeg from the official Trailer 2 and uploaded
as a public Short by RanSTAR ID.
