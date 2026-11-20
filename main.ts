// Lucia & Jason in 37 Seconds — entry for the gta6-clipper-01 bounty.
// A 37-second vertical Short cut from GTA VI Trailer 2: the hook is ten
// fast moments of Lucia and Jason around Vice City, then the VI logo,
// then a closing card that points viewers at make.fun, where clips like
// this one earn money. The Short itself lives on YouTube; this program
// only hands its address to the grader.
//
// How it runs: the grader calls this file with node and reads VIDEO.json
// out of the output directory, then looks the video up through the
// YouTube Data API and counts its views. Nothing here scores anything,
// fetches anything, or writes anything about the video itself.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const VIDEO_FILE = 'VIDEO.json';

function directories() {
  return {
    from: process.env.MAKEFUN_BOT_DIR ?? '/bot',
    to: process.env.MAKEFUN_OUTPUT_DIR ?? '/output',
  };
}

function loadAddress() {
  const { from } = directories();
  const raw = readFileSync(join(from, VIDEO_FILE), 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`${VIDEO_FILE} is not a JSON object`);
  }
  const address = parsed.url;
  if (typeof address !== 'string' || address.trim() !== address || address.length === 0) {
    throw new Error(`${VIDEO_FILE} has no clean url string`);
  }
  return address;
}

function extractId(address) {
  let parsed;
  try {
    parsed = new URL(address);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const path = parsed.pathname;
  if (host === 'youtu.be') {
    const id = path.slice(1).split('/')[0];
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (path.startsWith('/shorts/')) {
      const id = path.slice('/shorts/'.length).split('/')[0];
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (path === '/watch') {
      const id = parsed.searchParams.get('v') ?? '';
      return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
  }
  return null;
}

function publish() {
  const address = loadAddress();
  const id = extractId(address);
  if (id === null) {
    console.error(`Not a YouTube video address: ${address}`);
    process.exit(1);
  }
  const { from, to } = directories();
  mkdirSync(to, { recursive: true });
  copyFileSync(join(from, VIDEO_FILE), join(to, VIDEO_FILE));
  console.log(`Published ${VIDEO_FILE} for video ${id}: ${address}`);
}

try {
  publish();
} catch (err) {
  // A broken or missing VIDEO.json must fail with one clean line, not a
  // raw stack trace: the grader only needs to know the entry is invalid.
  console.error(`VIDEO.json error: ${err.message}`);
  process.exit(1);
}
