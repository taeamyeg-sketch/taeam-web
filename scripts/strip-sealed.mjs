// Runs after `npm run build` (npm "postbuild"). On the sealed waitlist build
// only, it deletes the parked ordering pages from out/ before they are
// uploaded to taeam.ca.
//
// Why: LaunchGate bounces visitors off those routes and robots.txt keeps
// Google out, but both happen after the file is served. Link previews
// (WhatsApp, iMessage, Facebook) read the raw HTML, ignore robots.txt and never
// run the bounce, so a pasted /restaurant/<id> link previewed the restaurant,
// test kitchens included. With the files gone, an old link gets 404.html,
// whose LaunchGate still sends a visitor home.
//
// The open build (NEXT_PUBLIC_LAUNCH_MODE=open, the parked ordering site on
// taeam-web.pages.dev) is left untouched. The route list is read from
// src/lib/launch.ts so there is one source of truth.
import { existsSync, readFileSync, rmSync } from "node:fs";

if (process.env.NEXT_PUBLIC_LAUNCH_MODE === "open") process.exit(0);
if (!existsSync("out")) process.exit(0); // not a static export build

const src = readFileSync("src/lib/launch.ts", "utf8");
const block = src.match(/SEALED_PREFIXES\s*=\s*\[([\s\S]*?)\]/);
if (!block) throw new Error("strip-sealed: SEALED_PREFIXES not found in src/lib/launch.ts");
const prefixes = [...block[1].matchAll(/"(\/[^"]+)"/g)].map((m) => m[1]);
if (prefixes.length === 0) throw new Error("strip-sealed: SEALED_PREFIXES is empty");

let removed = 0;
for (const p of prefixes) {
  for (const target of [`out${p}`, `out${p}.html`, `out${p}.txt`]) {
    if (existsSync(target)) {
      rmSync(target, { recursive: true, force: true });
      removed++;
    }
  }
}
console.log(`strip-sealed: removed ${removed} parked entries (${prefixes.join(" ")})`);
