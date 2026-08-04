# /halal/hand-vs-machine image plan

Four slots on the Hand or Machine research page. The page already renders a
graceful placeholder for each missing file, so the article ships and reads fine
before any image exists. Drop each finished image into `public/halal/methods/`
with the exact target filename and it appears on the next build.

Generator: Gemini (Nano Banana Pro). Paste each prompt as written.

## Why the first round screamed AI, and what changed

The v1 prompts were heavy on mood and camera gear but silent on scene logic, so
the model invented the physics: a meat label floating on the wrong face of the
tray, packaging wrapped in ways no machine wraps, shelves stocked with shapes
no store stocks. A viewer cannot name the problem but their brain flags it
instantly. The fix is to write like a prop stylist, not a mood board:

- Every object gets an exact position, orientation, and reason to exist. If the
  prompt does not say which face of the tray the sticker is on, the model
  decides, and it decides wrong.
- Real environments have specific mundane furniture: shelf price rails, floor
  drains, apron ties, chalk ghosting. Naming these mundane details is what
  reads as real. Omitting them is what reads as render.
- Each slot now ends with a REJECT IF checklist. Run it on every output before
  saving. One failed line means rerun, no exceptions.

Rules that apply to every prompt, learned the hard way:

- No text anywhere in the image. No signage, no labels with readable words, no
  watermarks. Nano Banana loves burning in fake captions, so every prompt below
  forbids it explicitly. Reject any output with readable text and rerun.
- No real brand names, logos, or packaging designs. Everything generic.
- No blood, no carcasses, no distress. This is a dignified editorial page about
  faith and food, not shock content. Every prompt is composed to stay tasteful.
- The page palette is warm cream (#FAF7F0), deep brown ink, and gold. Images
  should feel warm, natural, and editorial, like the photography already on
  /halal. Avoid cold blue color grades except where slot 2 calls for steel tones.
- Universal REJECT IF, applies to all four slots: extra or fused fingers, a
  duplicated object where the scene calls for one, any readable character in
  any script, a light source whose shadows point the wrong way, any object
  whose placement you could not physically recreate on a real set.

---

## The slots

| Slot | Target filename | Placement | Aspect |
|---|---|---|---|
| 1 | `public/halal/methods/knife-and-steel.jpg` | Full-bleed banner after the lede | Wide, 21:9 or 16:9, min 2400px wide |
| 2 | `public/halal/methods/plant-floor.jpg` | Inset figure inside chapter 02 | 16:10 landscape |
| 3 | `public/halal/methods/label-shelf.jpg` | Tall side panel beside chapter 06 | 4:5 portrait |
| 4 | `public/halal/methods/butcher-portrait.jpg` | Full-bleed band before the numbers grid | Wide, 21:9 or 16:9, min 2400px wide |

---

## Slot 1: knife-and-steel.jpg

The opening image. Quiet, reverent, sets the tone that this is about care and
craft, not industry. The hands and the tools are the whole picture, so the
prompt choreographs them exactly: which hand holds what, the angle between
blade and steel, where the edge faces. Left unspecified, models produce
physically impossible honing grips.

Prompt:

Photorealistic editorial photograph, shot on a Canon EOS R5 with an 85mm f/1.4
lens at f/2.0, shallow depth of field. Extreme close-up of the weathered hands
of a Muslim halal slaughterman in his fifties honing a long straight slaughter
knife against a sharpening steel, caught mid-stroke. The choreography is
exact: his left hand grips the handle of the sharpening steel, holding it
vertically, tip pointing up, forearm braced. His right hand holds the knife by
its plain wooden handle, all four fingers wrapped around the handle and thumb
resting along the spine, drawing the blade down the steel at roughly a twenty
degree angle, cutting edge facing away from his body and away from the hand
holding the steel. The blade touches the steel at exactly one contact point
about two thirds of the way up the steel. There is exactly one knife and
exactly one steel in the frame, nothing else in his hands. Each hand has five
fingers, naturally posed. His hands are strong and creased with work, short
clean fingernails, a simple plain wedding band on the left hand, trimmed grey
beard slightly visible out of focus at the top edge of frame. He wears a clean
white cotton work apron with the fabric ties visible where they wrap his
waist, over a simple grey thobe sleeve rolled neatly to the forearm in two
folds. Setting is a small traditional halal butcher workspace at dawn, warm
golden morning light streaming from a single window camera left, so every
shadow in the frame falls to camera right, raking across the blade and
catching a single fine edge highlight along the cutting edge. The blade
surface shows honest wear, fine longitudinal sharpening scratches and one or
two small dark patina spots near the spine, but reflects only warm window
light and soft blurred room tones, no readable reflections, no faces in the
reflection, no text in the reflection. Background falls into soft warm bokeh:
the end grain of a worn wooden butcher block lower right, a hanging two-pan
balance scale upper left suspended from a ceiling hook by its chain, both
completely out of focus. Color grade warm and filmic, cream and amber tones,
gentle contrast, true-to-life skin texture with visible pores. Composition is
wide cinematic 21:9 with the hands and blade in the lower right third and
calm negative space upper left. Absolutely no blood, no meat, no animals in
frame. No text, no signage, no labels, no logos, no watermark anywhere in the
image, including engraved or stamped writing on the blade.

REJECT IF:
- The cutting edge faces toward either hand or the grip is anatomically wrong.
- Blade and steel touch at more than one point, cross impossibly, or float
  without contact.
- More than one knife or steel appears anywhere, even in bokeh.
- Any maker's mark, stamp, or engraving is visible on blade or steel.
- Shadows contradict the single window-left light source.
- The balance scale hangs from nothing or its chains merge into the ceiling.

---

## Slot 2: plant-floor.jpg

The one industrial image. It illustrates the chapter about mechanical lines
without showing anything graphic. Empty line, no birds, pure geometry.
Repeating geometry is where diffusion models melt, so the prompt pins the
shackle spacing, the rail's continuity, and the mundane plant furniture that
proves the room is real.

Prompt:

Photorealistic industrial editorial photograph, shot on a Sony A1 with a 24mm
f/1.4 lens at f/4, deep focus. Interior of a modern, spotless poultry
processing facility photographed empty during a sanitation shutdown, no
animals and no people anywhere, and no human reflections in any surface. A
single continuous overhead conveyor rail carries a long row of identical
clean stainless steel shackles, each shackle the same simple stirrup shape,
hanging plumb straight down under gravity, evenly spaced about thirty
centimeters apart, none swinging, none touching, none merged together. The
rail is one unbroken line that recedes in a smooth gentle curve from lower
left foreground into the far depth of the hall, never branching, never
crossing itself, never terminating mid-air. Every surface is gleaming and
freshly washed. The floor is pale sealed concrete with a visible slope toward
one long stainless drain channel running along the base of the far wall, wet
in patches, carrying faint accurate reflections of the overhead lights
directly above each wet patch. Mundane real-plant details are present and
correct: round LED high-bay fixtures in a regular grid on the ceiling, a
coiled yellow washdown hose hung on a wall bracket in the far background out
of focus, stainless wall cladding with clean vertical seams at regular
panel widths. Cool brushed-steel tones in the machinery balanced by warm
neutral overhead light so the frame does not feel sterile or blue. Slight
atmospheric haze catching the light only in the far depth of the hall.
Composition uses the receding line of empty shackles as a strong leading
diagonal from lower left to upper right, one-point-perspective industrial
geometry, documentary style reminiscent of an architecture magazine feature
on food infrastructure. Hyper-detailed metal texture, visible weld seams at
the rail hanger brackets, water droplets on the nearest shackles.
Absolutely no birds, no meat, no blood, no workers, no gloves or boots or
any trace of a person. No text, no signage, no safety posters, no floor
markings with readable words, no stenciled numbers on equipment, no logos,
no watermark anywhere in the image.

REJECT IF:
- Any two shackles differ in shape, merge, or hang at unexplained angles.
- The rail branches, gaps, or ends nowhere; count its path across the frame.
- Shackle spacing drifts from regular to random partway down the line.
- Reflections on the wet floor do not sit under the fixture that casts them.
- Any stencil, number, sign, or poster survived, even blurred but readable.
- The ceiling light grid is irregular in a way a contractor would never build.

---

## Slot 3: label-shelf.jpg

The consumer moment. VERSION 3. Round two produced a technically clean image
that still read as AI, and the diagnosis is the prop: the model rendered an
empty unwrapped tray, so the viewer saw a woman studying a bare piece of foam,
plus sauna-grade fog over the cooler and a big blank rectangle sticker no
store uses. The v3 strategy stops asking the model to juggle a full figure
plus a believable package at arm's length. It moves the camera in so the
package is the hero, keeps the shopper as soft human context behind it, and
makes the sticker the small oval gold foil seal real halal packaging actually
carries. Fewer square inches for the model to get wrong, and the square
inches that remain are the ones it renders best.

Prompt:

Photorealistic lifestyle editorial photograph, shot on a Fujifilm GFX 100 II
with an 80mm f/1.7 lens at f/2, medium format look, tight focus on the
foreground package with creamy falloff behind. Vertical 4:5 portrait
composition. Close over-the-shoulder view: two feminine hands hold a real
supermarket package of fresh chicken in the foreground lower two thirds of
frame, and the package is the sharpest thing in the image. The package is
built exactly like a real one: a shallow white foam tray holding two plump
raw skinless chicken breasts, pale pink, glistening slightly, clear plastic
film stretched machine-taut over the top and tucked under the base, one thin
absorbent pad just visible beneath the meat, the film catching one long soft
reflection from the cooler lights. On the top surface of the film sits
exactly one label: a small oval gold foil seal about the size of a coin,
embossed rim, blank center with no writing and no barcode, adhered flat and
following the film's curve. No other label or sticker exists on any face of
the package. Her hands: one hand supports the tray from beneath, four
fingertips visible curling around the far edge, the other hand steadies the
near short end with the thumb on the film edge, five fingers per hand,
natural short nails, a thin simple ring on one finger, knuckle creases and
fine skin texture in focus. Behind the package, softly out of focus, the
shopper herself: a young woman in a soft sage green hijab and camel wool
coat seen from a high three-quarter angle over her right shoulder, head bowed
toward the package in her hands, the curve of her cheek and dark eyebrow
visible in profile, face rendered soft by shallow depth of field, not the
subject of the photo. Beyond her, deeper out of focus, one shelf line of the
open cooler case: identical generic white film-wrapped trays lying flat in a
row, front edges aligned along a plain empty grey price rail, cool white
case light glowing off the film tops. Air is completely clear, no fog, no
mist, no condensation clouds anywhere. Lighting is simple and honest: cool
white light from the cooler case camera left falling on the package and the
backs of her hands, warm store ambience far behind her, nothing else. Color
grade warm cream and gold with soft muted green from the hijab, editorial
magazine quality. No visible brand names, no readable text anywhere on any
package or rail, no logos, no numbers, no watermark anywhere in the image.

REJECT IF:
- The tray is empty, unwrapped, or the film is loose or torn: the chicken
  and taut film must both be clearly present and believable.
- The gold seal is anything except one small blank oval on the top film
  surface: rectangular, oversized, duplicated, or on a wrong face all fail.
- Fog, mist, or steam appears anywhere in the frame.
- Hands: wrong finger count, fingers through the tray, or a grip that could
  not support the tray.
- Her face is in sharp focus or dominates the frame: the package is the
  subject, the person is soft context.
- Shelf stock behind is amorphous blobs instead of an aligned row of trays.
- Any character, number, or barcode is readable anywhere in the image.

---

## Slot 4: butcher-portrait.jpg

The closing full-bleed. A human face for the trade, calm and proud. This is
the emotional landing before the statistics. Two v1 traps fixed here: a
perfectly blank chalkboard reads as fake because real blank chalkboards carry
eraser ghosting, and background props must hang from actual mounts or the
brain flags the room as a render.

Prompt:

Photorealistic environmental portrait, shot on a Leica SL3 with a 50mm f/1.2
lens at f/2, cinematic shallow depth. Wide 21:9 composition. A dignified
Muslim halal butcher in his early sixties with a neat grey beard and white
kufi cap stands at rest behind the worn wooden counter of his small
family-run halal butcher shop at closing time, arms loosely folded across
his chest with each hand resting visibly on the opposite forearm, five
fingers per hand, looking slightly off camera left with a calm, warm,
quietly proud expression, gentle crow's feet, natural asymmetry in his face.
He wears a clean white cotton apron over a pressed navy shirt with the top
button open, apron neck loop visible around his neck and the waist ties
knotted at his side. The counter in front of him is clean and empty, its
wooden top showing decades of honest wear: knife scars, a shallow dished
depression in the middle from years of cutting, edges rounded and darkened
by hands, all rendered with true wood grain that flows continuously through
the scars. Golden hour light pours through the shop front window camera
left, wrapping the left side of his face in warm amber light, the right
side falling into soft shadow, and throwing one long soft window-shaped
patch of light across the counter toward camera right. Behind him, softly
out of focus: an antique two-pan balance scale hanging from a visible
ceiling hook by its chains, a horizontal stainless rail mounted to the wall
with brackets carrying a few empty gleaming stainless hooks, and a wall
chalkboard in a wooden frame that carries no writing but shows realistic
grey eraser ghosting and chalk dust smudges, the way a working board looks
after being wiped. Every hanging object hangs plumb under gravity from a
visible support. Rich filmic color grade, deep warm browns, cream
highlights, gold accents, hyper-detailed skin texture and fabric weave, the
quality of a National Geographic portrait. Absolutely no meat, no blood, no
carcasses visible anywhere. No text, no readable chalkboard writing, no
ghosted letters that resolve into words, no signage, no labels, no logos,
no watermark anywhere in the image.

REJECT IF:
- The chalkboard is either laser-clean or its smudges resolve into letters.
- The scale or hooks hang from nothing, or chains merge into the wall.
- Arms-folded pose hides or mangles the hands, or finger count is wrong.
- Window light direction and the shadow side of his face disagree.
- Wood grain on the counter breaks or repeats in tiling patterns.
- His beard or kufi edge dissolves into the background bokeh.

---

## After generating

1. Run the slot's REJECT IF list plus the universal list before saving
   anything. One failure means rerun. Do not keep a 90 percent output.
2. Save each approved image to `public/halal/methods/` under its target
   filename. Create the folder if it does not exist.
3. Keep source PNGs out of git if they are huge; `public/` is already mostly
   untracked, follow whatever you did for the /halal images.
4. Rebuild and the placeholders swap out automatically. Nothing in the code
   needs to change.
