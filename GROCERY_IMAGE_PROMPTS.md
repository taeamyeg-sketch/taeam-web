# Taeam Grocery: image prompts

Three optional photo slots on `/grocery` (`src/app/grocery/page.tsx`). Until a
photo exists, each slot shows its drawn stand-in, so the page is finished
without them. One prompt per slot below, written for Gemini (Nano Banana).

**To add a photo:** generate it, check it against the rules below, crop or
resize it to the exact pixel size, save it as WebP under the filename given,
then set that slot's `src` in `GROCERY_PHOTOS` in
`src/app/grocery/PhotoSlot.tsx` (for example `src: "/grocery-scan.webp"`).
The alt text is already written there.

**Check every image before using it:**
- No readable brand names, logos, or text anywhere: not on packages, shelf
  tags, price labels, signs, the phone screen, clothing or bags. Blur or
  inpaint any that slip through.
- No recognisable store: no chain colours, uniforms, signage or bag prints.
- People: hands only is best. If more shows, modest dress (long sleeves).
- No meat or product that could read as non-halal, and no alcohol in view.

---

## Slot 1: scanning in the aisle

- **Where:** the "Who shops" section, right column.
- **Aspect ratio:** 4:3 landscape. **Size:** 1600 x 1200 px.
- **File:** `public/grocery-scan.webp`, then `GROCERY_PHOTOS.scan.src = "/grocery-scan.webp"`.

**Prompt:**

> Photorealistic close-up photograph, 4:3 landscape, 1600 x 1200 pixels. A
> person's two hands, in the sleeves of a dark winter jacket, hold a
> smartphone up to a glass jar of golden honey on a grocery store shelf,
> scanning its barcode. The phone screen shows only a live camera view of the
> barcode with four thin gold corner brackets around it, no words or numbers.
> The shelf is a plain light wood or white metal shelf with a few everyday
> staples beside the jar: a cloth sack of rice, a bottle of cooking oil, a box
> of dates. Every package is plain or has a softly blurred label, with no
> readable brand names, logos, or text anywhere in the image. Natural, soft
> daylight from large front windows mixed with warm overhead store light, the
> feel of a quiet weekday morning in a neighbourhood grocery store in
> Edmonton, Canada. Shallow depth of field: the hands, phone and jar sharp,
> the aisle behind gently out of focus. Warm, muted colours: cream, kraft
> brown, honey gold, a little deep green. No faces, no store signage, no
> price tags with readable text, no recognisable store branding. Documentary
> style, true to life, not staged or glossy.

---

## Slot 2: the doorstep

- **Where:** the "Good to know" (questions) section, under the heading.
- **Aspect ratio:** 3:2 landscape. **Size:** 1800 x 1200 px.
- **File:** `public/grocery-doorstep.webp`, then `GROCERY_PHOTOS.doorstep.src = "/grocery-doorstep.webp"`.

**Prompt:**

> Photorealistic photograph, 3:2 landscape, 1800 x 1200 pixels. A full brown
> paper grocery bag stands on a coarse doormat in front of a closed front
> door of a modest Edmonton, Canada house. Out of the top of the bag: a loaf
> of crusty bread, a bunch of fresh green herbs, and the top of a plain white
> milk carton with no printing. Beside it, a smaller paper bag with two
> tomatoes on top. The door is painted deep green with a brass handle; the
> siding is cream, with a wooden porch floor. Late afternoon autumn light,
> low and golden, with a few fallen leaves and a light dusting of early snow
> on the edge of the step. Shot from standing height, slightly above, as if
> the delivery person just took a photo of the drop-off. No people, no house
> number, no readable text, brand names, logos or printing on the bags,
> carton or anything else. Calm, warm, true to life, documentary style, not
> glossy advertising.

---

## Slot 3: the neighbourhood grocer

- **Where:** the "Coming too" section (grocers and butchers), left column.
- **Aspect ratio:** 3:2 landscape. **Size:** 1800 x 1200 px.
- **File:** `public/grocery-grocer.webp`, then `GROCERY_PHOTOS.grocer.src = "/grocery-grocer.webp"`.

**Prompt:**

> Photorealistic photograph, 3:2 landscape, 1800 x 1200 pixels. The inside of
> a small, tidy, family-run neighbourhood grocer in Edmonton, Canada. Wooden
> shelves along the back wall hold cloth sacks of rice, glass jars of honey
> and ghee, boxes of dates, tins, and bottles of cooking oil, all with plain or
> softly blurred labels. In the foreground, a clean glass-fronted counter with
> three neat packs of fresh chicken thighs on white trays, wrapped in clear
> film, each with a small blank white sticker. Soft natural daylight from a
> front window on the left, warm and even, with a little warm interior light.
> Warm, muted colours: cream walls, kraft brown, wood, honey gold, a touch of
> deep green. No people, or at most one pair of hands in long sleeves placing
> a pack on the counter. No readable text anywhere: no signs, no price cards,
> no brand names, no logos, no writing in any language on packages or walls.
> No pork or alcohol in view. True to life, documentary style, not staged or
> glossy.

---

## Optional: a share image

`/grocery` shares with the site-wide `/og.jpg` today. A Grocery card would be
1200 x 630 px (1.91:1) at `public/og-grocery.jpg`, then swap the two `og.jpg`
references in the page's `metadata` for `/og-grocery.jpg`. The drawn shelf
from the hero, on cream with the Taeam mark, would match the page best.
