import sharp from "sharp";

const SRC = "/Users/rayanraja/Taeam/CascadeProjects/taeam_app/assets/images/taeam_logo.png";
const OUT_MARK = "/Users/rayanraja/Taeam/CascadeProjects/taeam-web/public/logo-mark.png";
const OUT_ICON = "/Users/rayanraja/Taeam/CascadeProjects/taeam-web/src/app/icon.png";

// The source already carries clean transparency (near-black mark, alpha
// background) — just trim the padding and export the sizes we use.
const trimmed = await sharp(SRC).trim({ threshold: 10 }).png().toBuffer();
const meta = await sharp(trimmed).metadata();
console.log("trimmed:", meta.width, "x", meta.height);

await sharp(trimmed).resize({ height: 128 }).png().toFile(OUT_MARK);

const size = Math.max(meta.width, meta.height);
const padX = Math.round((size - meta.width) / 2 + size * 0.08);
const padY = Math.round((size - meta.height) / 2 + size * 0.08);
await sharp(trimmed)
  .extend({
    top: padY,
    bottom: padY,
    left: padX,
    right: padX,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .resize(256, 256)
  .png()
  .toFile(OUT_ICON);

console.log("done");
