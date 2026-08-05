import sharp from "sharp";

// 1200x630 Open Graph card: cream field, ink mark, gold rule accents.
//
// The corner accents used to be khatams (eight-pointed stars). That motif is
// gone from the whole site — see components/Pattern.tsx — so the share card
// uses the same short gold rule the pages do.
const W = 1200, H = 630;

const rule = (x, y, w, color, opacity) => `
  <rect x="${x - w / 2}" y="${y}" width="${w}" height="2" fill="${color}" opacity="${opacity}"/>`;

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#faf6ee"/>
  ${rule(90, 90, 64, "#eea742", 0.9)}
  ${rule(1110, 540, 64, "#eea742", 0.9)}
  <text x="600" y="415" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="88" font-weight="600" fill="#121212">Halal, delivered.</text>
  <text x="600" y="490" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#6f6659">Every kitchen verified · Edmonton</text>
</svg>`;

const logo = await sharp("public/logo-mark.png").resize({ height: 170 }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();

await sharp(Buffer.from(svg))
  .composite([{ input: logo, top: 105, left: Math.round((W - logoMeta.width) / 2) }])
  .png()
  .toFile("public/og.png");
console.log("og.png done");
