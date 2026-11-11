// Social share cards (1200x630), rendered with Next's bundled @vercel/og so the
// type is real Montserrat, the site's own face. Run from taeam-web:
//
//   node scripts/make-og.mjs
//
// Writes:
//   public/og.jpg        the Taeam customer card (every page by default)
//   public/og-drive.png  the Tawsil driver card (/drive)
//
// Brand rules (launch test plan B6 #47): uppercase sans, no serif anywhere,
// #F6F4EF field, gold accent, no glow or sparkle. The older sharp/SVG version
// set the headline in Georgia, which broke the no-serif rule. Fonts are the
// OFL-licensed Montserrat static cuts from Fontsource, kept in scripts/fonts.
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import sharp from "sharp";

const W = 1200;
const H = 630;
const CREAM = "#F6F4EF";
const INK = "#121212";
const MUTE = "#6f6659";
const GOLD = "#eea742";
const NOIR = "#0f0f0f";

const fonts = [
  { name: "Montserrat", data: await readFile("scripts/fonts/Montserrat-900.ttf"), weight: 900, style: "normal" },
  { name: "Montserrat", data: await readFile("scripts/fonts/Montserrat-600.ttf"), weight: 600, style: "normal" },
];

const logo = `data:image/png;base64,${(await readFile("public/logo-mark.png")).toString("base64")}`;

const rule = (style) =>
  h("div", { style: { position: "absolute", width: 64, height: 3, background: GOLD, ...style } });

async function render(tree, out) {
  const res = new ImageResponse(tree, { width: W, height: H, fonts });
  let buf = Buffer.from(await res.arrayBuffer());
  // A photo card as PNG is ~900 KB; WhatsApp and some chat apps skip share
  // images over ~300 KB, so photo cards are written as JPEG.
  if (out.endsWith(".jpg")) buf = await sharp(buf).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  await writeFile(out, buf);
  console.log(`${out} done`);
}

// Customer card: a real grill under a dark wash, the orange app tile, and a
// stacked headline. Google search and many chat apps crop share images to a
// centred SQUARE, so the tile and headline must live inside the middle
// 630x630; the old cream card put "HALAL, DELIVERED." across the full width
// and the square crop read "AL, DELIVER".
const grill = `data:image/jpeg;base64,${(await readFile("public/halal/mixed-grill.jpg")).toString("base64")}`;
const tile = `data:image/png;base64,${(await readFile("src/app/icon.png")).toString("base64")}`;
await render(
  h(
    "div",
    {
      style: {
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: NOIR,
        fontFamily: "Montserrat",
        position: "relative",
      },
    },
    h("img", {
      src: grill,
      width: W,
      height: H,
      style: { position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover", objectPosition: "50% 70%" },
    }),
    h("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: H,
        background: "linear-gradient(180deg, rgba(15,15,15,0.55) 0%, rgba(15,15,15,0.72) 55%, rgba(15,15,15,0.88) 100%)",
      },
    }),
    h("img", { src: tile, width: 150, height: 150 }),
    h(
      "div",
      {
        style: {
          marginTop: 34,
          fontSize: 80,
          fontWeight: 900,
          lineHeight: 0.98,
          color: "#ffffff",
          letterSpacing: -2,
          textTransform: "uppercase",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      },
      h("span", null, "Halal,"),
      h("span", { style: { color: GOLD } }, "delivered."),
    ),
    h(
      "div",
      { style: { marginTop: 26, fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.78)", letterSpacing: 4, textTransform: "uppercase" } },
      "Edmonton · Halal-only kitchens",
    ),
  ),
  "public/og.jpg",
);

// Driver card: Tawsil is the driver brand (gold on a dark field, like the app).
await render(
  h(
    "div",
    {
      style: {
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0 96px",
        background: NOIR,
        fontFamily: "Montserrat",
        position: "relative",
      },
    },
    rule({ left: 96, top: 120 }),
    h(
      "div",
      { style: { fontSize: 28, fontWeight: 900, color: GOLD, letterSpacing: 6, textTransform: "uppercase" } },
      "Edmonton driver waitlist",
    ),
    h(
      "div",
      {
        style: {
          marginTop: 22,
          fontSize: 104,
          fontWeight: 900,
          lineHeight: 0.95,
          color: "#ffffff",
          letterSpacing: -2,
          textTransform: "uppercase",
          display: "flex",
          flexDirection: "column",
        },
      },
      h("span", null, "Drive with"),
      h("span", { style: { color: GOLD } }, "Tawsil."),
    ),
    h(
      "div",
      { style: { marginTop: 34, fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.72)", letterSpacing: 3, textTransform: "uppercase" } },
      "Your schedule · One order at a time · 100% of tips",
    ),
  ),
  "public/og-drive.png",
);
