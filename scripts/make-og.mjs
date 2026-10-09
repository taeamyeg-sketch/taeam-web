// Social share cards (1200x630), rendered with Next's bundled @vercel/og so the
// type is real Montserrat, the site's own face. Run from taeam-web:
//
//   node scripts/make-og.mjs
//
// Writes:
//   public/og.png        the Taeam customer card (every page by default)
//   public/og-drive.png  the Tawsil driver card (/drive)
//
// Brand rules (launch test plan B6 #47): uppercase sans, no serif anywhere,
// #F6F4EF field, gold accent, no glow or sparkle. The older sharp/SVG version
// set the headline in Georgia, which broke the no-serif rule. Fonts are the
// OFL-licensed Montserrat static cuts from Fontsource, kept in scripts/fonts.
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

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
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log(`${out} done`);
}

// Customer card: cream field, black mark, uppercase black headline.
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
        background: CREAM,
        fontFamily: "Montserrat",
        position: "relative",
      },
    },
    rule({ left: 58, top: 90 }),
    rule({ right: 58, bottom: 90 }),
    h("img", { src: logo, width: 145, height: 170 }),
    h(
      "div",
      { style: { marginTop: 44, fontSize: 92, fontWeight: 900, color: INK, letterSpacing: -2, textTransform: "uppercase" } },
      "Halal, delivered.",
    ),
    h(
      "div",
      { style: { marginTop: 18, fontSize: 28, fontWeight: 600, color: MUTE, letterSpacing: 4, textTransform: "uppercase" } },
      "Halal-only kitchens · Edmonton",
    ),
  ),
  "public/og.png",
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
