// gta6-clipper-01 entry — "Lucia & Jason in 37 Seconds".
// Node 22+, standard library only. Written fresh in this session
// (WhatsApp chat, 20 Nov 2026, user prompt "GTA clipper submit").
//
// The entry itself is the YouTube Short: a 37-second vertical cut of GTA VI
// Trailer 2 (Lucia and Jason's best moments first, then make.fun's pitch on
// screen — "Make clips like this with AI and earn money on make.fun").
// The clip was re-rendered with ffmpeg in this session from the same
// trailer source and filter, uploaded as a public Short, and its address
// is recorded in VIDEO.json.
//
// This program does the one thing the gate asks of it: it carries VIDEO.json
// from the repository into the output directory, where the house reads it
// and then reads the video's views through the YouTube Data API. It scores
// nothing itself and writes nothing about the video.
//
// Run it the way the kit documents:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader the defaults /bot and /output apply instead.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const FILENAME = 'VIDEO.json';

const source = join(BOT_DIR, FILENAME);
const target = join(OUTPUT_DIR, FILENAME);

// Read first so a broken VIDEO.json fails loudly instead of silently
// copying garbage into /output.
const video = JSON.parse(readFileSync(source, 'utf8'));
if (typeof video !== 'object' || video === null || typeof video.url !== 'string') {
  console.error(`${FILENAME} must be a JSON object with a string "url" field.`);
  process.exit(1);
}

// The gate only accepts a real YouTube video address, so refuse a VIDEO.json
// whose url is not shaped like one instead of copying it through and
// scoring an invalid entry. Parse it too: the video id is the part the
// house grades on, so log it and refuse an address whose id is missing.
const YOUTUBE_URL = /^https:\/\/(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const match = YOUTUBE_URL.exec(video.url);
if (!match) {
  console.error(`VIDEO.json "url" is not a YouTube video address: ${video.url}`);
  process.exit(1);
}
const videoId = match[3];

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(source, target);
console.log(`Wrote ${target} -> ${video.url} (video ${videoId})`);
