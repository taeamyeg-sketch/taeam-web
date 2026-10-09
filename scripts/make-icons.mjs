// Square site icons from the Taeam mark (launch test plan B6 #42). Run from
// taeam-web:
//
//   node scripts/make-icons.mjs
//
// Same look as the app's launcher icon (taeam_app/flutter_launcher_icons.yaml):
// the black mark on brand gold, so it reads on light and dark browser tabs.
// Writes Next's file-convention icons, which Next links in <head> itself:
//   src/app/favicon.ico     16/32/48 px, served at /favicon.ico
//   src/app/icon.png        512 px
//   src/app/apple-icon.png  180 px, opaque (iOS rounds the corners itself)
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "../taeam_app/assets/images/taeam_logo.png";
const GOLD = { r: 0xee, g: 0xa7, b: 0x42, alpha: 1 };

const mark = await sharp(SRC).trim({ threshold: 10 }).png().toBuffer();

/** The mark centred on a gold square, `pad` of the side left clear around it. */
async function square(size, pad) {
  const inner = Math.round(size * (1 - 2 * pad));
  const fitted = await sharp(mark)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: GOLD } })
    .composite([{ input: fitted, gravity: "centre" }])
    .png()
    .toBuffer();
}

await writeFile("src/app/icon.png", await square(512, 0.16));
await writeFile("src/app/apple-icon.png", await square(180, 0.16));

// ICO with embedded PNG images (supported by every current browser).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(s, 0.1)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
const dir = Buffer.alloc(16 * sizes.length);
let offset = 6 + dir.length;
sizes.forEach((s, i) => {
  const e = i * 16;
  dir.writeUInt8(s, e); // width
  dir.writeUInt8(s, e + 1); // height
  dir.writeUInt8(0, e + 2); // palette
  dir.writeUInt8(0, e + 3); // reserved
  dir.writeUInt16LE(1, e + 4); // colour planes
  dir.writeUInt16LE(32, e + 6); // bits per pixel
  dir.writeUInt32LE(pngs[i].length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, dir, ...pngs]));
console.log("icons done");
