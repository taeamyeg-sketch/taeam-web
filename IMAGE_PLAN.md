# taeam.ca image plan

Where photography goes for every slot, and what still has to happen before any
of it ships.

**Progress: all 15 generated, 14 placed and building green.** Watermarks removed,
converted to WebP under 300 KB, and wired into their pages. Slot 15 is
deliberately unplaced (see below). Slot 1 still needs its Sriracha bottles
inpainted — it is live on `/about` with them visible right now.

Source PNGs are in `Desktop/FireFox downloads/Web pics`; the shipped WebPs are in
`public/`.

---

## The full set

| Slot | Source file | Target filename | Status |
|---|---|---|---|
| 1 | `Gemini_..._jhjjxu...` | `public/about-table.jpg` | **Inpaint needed** — see below |
| 2 | `Gemini_..._o04feg...` | `public/about-city.jpg` | Approved |
| 3 | `fix2.png` | `public/rewards-hero.jpg` | Approved |
| 4 | `Gemini_..._koggu9...` | `public/trust-butcher.jpg` | Approved |
| 5 | `Gemini_..._t4wjdh...` | `public/pitavibe-hero.jpg` | Approved |
| 6 | `fix3.png` | `public/verify-supplier.jpg` | Approved |
| 7 | `7.png` | `public/verify-lines.jpg` | Approved — see dark-band note |
| 8 | `Gemini_..._t09p9t...` | `public/rewards-plus.jpg` | Approved |
| 9 | `9.png` | `public/rewards-everyday.jpg` | Approved — see food note |
| 10 | `Gemini_..._il58nz...` | `public/fridge-homecook.jpg` | Approved |
| 11 | `11.png` | `public/drive-night.jpg` | Approved — remove visor label |
| 12 | `12.png` | `public/drive-winter.jpg` | Approved — remove bin decal |
| 13 | `13.png` | `public/arbaab-craving.jpg` | Approved for low-opacity use only |
| 14 | `14.png` | `public/contact-band.jpg` | Approved — crop top-left notices |
| 15 | `15..png` | `public/launch-edmonton.jpg` | Approved (optional slot) |

Strongest of the set: **2, 6, 10, 12, 14**. Slot 4 came out good enough to
reconsider the `PREFER REAL` warning on it.

### Where each one goes

Line numbers are from when the plan was written — verify before editing.

| Slot | File | Placement |
|---|---|---|
| 1 | [about/page.tsx](src/app/about/page.tsx) ~33 | Full-width under the h1, above the body copy |
| 2 | [about/page.tsx](src/app/about/page.tsx) ~80 | Full-bleed band before the "Hungry already?" CTA |
| 3 | [rewards/page.tsx](src/app/rewards/page.tsx) ~152 | Right column of the dark hero, or masked backdrop |
| 4 | [TrustGap.tsx](src/components/marketing/TrustGap.tsx) ~101 | Beside the per-protein card in the 2-col grid |
| 5 | [ReserveClient.tsx](src/app/reserve/ReserveClient.tsx) ~248 | Replaces the `PLACEHOLDER hero` block |
| 6 | [how-we-verify/page.tsx](src/app/how-we-verify/page.tsx) ~139 | Right column of "Your standard, not ours" |
| 7 | [how-we-verify/page.tsx](src/app/how-we-verify/page.tsx) ~250 | Full-bleed band above the hard-lines cards |
| 8 | [rewards/page.tsx](src/app/rewards/page.tsx) ~418 | Backdrop behind the Taeam Plus column, ~25% opacity |
| 9 | [rewards/page.tsx](src/app/rewards/page.tsx) ~378 | Band above the "More ways to earn" cards |
| 10 | [FridgeClient.tsx](src/app/fridge/FridgeClient.tsx) ~115 | Image above the "If you make it" copy |
| 11 | [DriveClient.tsx](src/app/drive/DriveClient.tsx) ~240 | Band above the three pay-tier cards |
| 12 | [DriveClient.tsx](src/app/drive/DriveClient.tsx) ~335 | Band above the "Why drive with us" perks |
| 13 | [ArbaabClient.tsx](src/app/arbaab/ArbaabClient.tsx) ~153 | Dark-masked backdrop behind the chat mockup, low opacity |
| 14 | [ContactSection.tsx](src/components/marketing/ContactSection.tsx) ~30 | Full-bleed band behind or above the contact cards |
| 15 | [LaunchZones.tsx](src/components/marketing/LaunchZones.tsx) ~59 | Optional — only if the Leaflet map ever feels too cold |

---

## Cleanup checklist — do this before anything ships

Applies to every file.

1. **Crop out the Gemini watermark.** Every file has a four-point sparkle burned
   into the bottom-right corner. A 3–4% crop off the bottom-right clears it
   without hurting any of these compositions.
2. **Remove the burned-in text listed per slot below.** Inpaint or crop.
3. **Compress.** They are 8–10 MB PNGs. Convert to WebP at roughly 2000px on the
   long edge, target under ~300 KB, before they go near Cloudflare.
4. **Rename** to the target filename in the table above.
5. **Re-check at 100% zoom** after inpainting.

### Per-slot text to remove

| Slot | What to remove |
|---|---|
| 1 | Two Sriracha bottles with legible rooster labels, front and centre |
| 11 | Printed airbag warning label on the sun visor; small badge on the steering wheel hub |
| 12 | City decal with legible text on the garbage bin |
| 14 | Papers taped up in the top-left corner with visible text |
| 15 | A few tiny lit business signs mid-frame — likely illegible at web size, optional |

### The pattern, for anything generated later

Four of the last five images carried burned-in text, and in **every case it was
on a small incidental background object** — a visor label, a bin decal, taped
notices, distant signage. The no-text instruction reliably keeps text off the
primary subject and reliably fails on set dressing. If you generate more, the
negative has to name background props specifically, not just say "anywhere in
the frame."

---

## Notes carried by individual images

**Slot 1 — inpaint, do not regenerate.** Two Sriracha bottles sit front and
centre with legible labels. A full regenerate was attempted (`fix1.png`) and came
out worse: it removed the bottles and finally pushed the composition right as
instructed, but nobody was engaged with anyone, one of the four had her back
fully to camera contributing no face, the room was bare and cafeteria-like with
no other diners, and the food became pale rice instead of curries and naan. The
two men also drifted back toward a shared beard and hairline. **Once a frame has
the right energy, patch it rather than re-rolling it** — regeneration re-rolls
the parts that were already right.

**Slot 7 is very dark.** It goes as a full-bleed band in the "Our hard lines"
section of [/how-we-verify](src/app/how-we-verify/page.tsx), which is a light
cream section. A near-black band there will read as a hole in the page. Either
lift the shadows in post, or restyle that section dark to receive it. Decide
before building it in.

**Slot 9's food is illegible.** The expression fix worked — no laughing, no
teeth, no eye contact — but the shawarmas read as crumpled foil and a napkin wad,
and the two subjects came out near-symmetric despite the anti-symmetry block.
Acceptable on a "more ways to earn" band. Also check the small fabric tag on the
left jacket's chest pocket at 100%.

**Slot 13 is approved for one use only.** The arms do not fully reconcile —
an upper arm reaches to the phone while a lower arm with a bangle crosses the
body, and the geometry of both belonging to one person lying that way does not
work. The fingers on the phone hand are soft. This survives *only* because it
sits as a dark-masked backdrop at low opacity behind the Arbaab chat mockup,
where the problem disappears. Do not reuse it anywhere it would be seen at full
strength.

**Slot 2 — open question.** Every storefront in it is dark, empty and vacant.
Technically one of the best images, but on an About page whose copy is "we're
starting where we live," a dead commercial strip carries a message you may not
want. If it bothers you, regenerate asking for two or three shops to be visibly
open and occupied. If it doesn't, ship it.

---

## What worked, if you ever generate more

**Reliable levers.** Casting, lighting, expression and set dressing instructions
landed nearly every time. Naming Edmonton's actual communities — Pakistani,
Indian, Bangladeshi; Somali, Eritrean, Sudanese; Lebanese, Syrian, Palestinian;
Afghan — fixed the white-default problem in one pass. Naming a real camera, a
plausible exposure triangle, and a specific list of imperfections is what keeps
these from looking synthetic.

**Unreliable lever.** Composition. "Push it off-centre," "one subject closer than
the other," "cut one by the frame edge" got ignored repeatedly, and the one time
it landed it cost everything else in the frame. Do not spend a regenerate on
composition alone — crop instead.

**Anti-cloning still needs saying explicitly.** Without it, everyone shares a
jaw and a charcoal jacket. The block that worked: different face shape, jawline,
nose, hairline, age; no two sharing a garment colour family, fabric, collar type
or silhouette; postures that differ.

**Expression is a separate instruction from "candid."** Slot 9's first pass had
perfect casting and a stock-photo grin. "No open-mouth laughing, no visible
teeth, relaxed closed-mouth expressions" fixed it in one pass.

---

# Not covered here

- **`og.png`** — the social share card. Worth refreshing now that slots 1 and 2
  exist, since that image is what appears in every link preview.
- **Restaurant card photography** — [RestaurantCard.tsx](src/components/RestaurantCard.tsx)
  and the browse tiles are behind the launch seal. These must be **real photos of
  real menu items** from each partner kitchen. Generating food a restaurant does
  not actually serve is a different category of problem from everything above.

---

# Review checklist

Used on every image in this set. Keep it for anything generated later — name
files by slot number, e.g. `06-verify-supplier.jpg`.

1. **Casting** — did it render the community, or drift back to white default?
   Does it look like a real Edmonton friend group or a diversity stock photo? Is
   darker skin properly exposed rather than muddy?
2. **Expression** — open-mouth laughs, posed reactions, camera eye contact. This
   is what sent slot 9 back.
3. **Faces** — cloned features across people, waxy skin, mismatched eye
   direction, teeth artifacts, ears.
4. **Hands and limbs** — finger count, fused knuckles, impossible grips,
   disembodied arms at frame edges, and limbs that don't reconcile with the
   pose. This is what sent slot 6 back and what nearly disqualified slot 13.
5. **Text** — burned-in lettering at 100% zoom. Check the primary subject, then
   check **every background prop separately**: visor labels, bin decals, taped
   notices, signage, packaging, screens. Set dressing is where it actually slips
   through, not the subject.
6. **Light logic** — shadows that disagree with the stated source.
7. **Physical sense** — cutlery merging into plates, chair legs not reaching the
   floor, reflections that do not match the room.
8. **Brand fit** — does it sit next to the rest of the set without looking like
   a different website.
9. **Watermark and weight** — sparkle cropped out, converted to WebP, under
   ~300 KB.

---

# Remaining work

Generation, conversion and placement are done. What's left:

1. **Inpaint slot 1's Sriracha bottles.** It is live on `/about` with legible
   third-party branding visible. Then re-run the conversion into
   `public/about-table.webp`. This is the only outstanding blocker.
2. **Optional text cleanups** — the visor label in `drive-night`, the bin decal
   in `drive-winter`, the taped notices in `contact-band`. All small; none are
   legible at the size they render.
3. **Slot 15 is unplaced by design.** `launch-edmonton.webp` sits in `public/`
   unused. The Leaflet map on the home page is the better visual for that
   section, exactly as the original plan said. Delete the file or place it if
   the map ever gets replaced.
4. **Three more placeholders exist on `/reserve`** that were never part of this
   plan: "The pitas", "The bowls", "The spot" at
   [ReserveClient.tsx:287](src/app/reserve/ReserveClient.tsx#L287) still say
   "Photo coming soon". These should be real photos of real Pitavibe food, not
   generated ones.
5. **Refresh `og.png`** now that slots 1 and 2 exist.

## How the two flagged images were handled

**Slot 7's darkness solved itself structurally.** Rather than dropping a
near-black band into a cream section, the image now *carries* the "Our hard
lines" heading — it sits directly below the already-dark supplier-privacy
section, so the page reads as one dark passage that hard-cuts into the cream
refusal cards. No shadow lifting needed.

**Slot 13 is at 25% opacity in dark mode and 12% in light**, behind the Arbaab
hero with a gradient scrim to the page background. The arm-geometry problem is
invisible at that treatment. Do not raise the opacity.
