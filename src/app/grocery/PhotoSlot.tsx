import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * PHOTO SLOTS for /grocery. Each slot shows its drawn stand-in until a real
 * photo exists. To add one: put the file in public/ under the name below, then
 * set `src` to "/<that name>". Prompts, sizes and filenames for each slot are
 * in GROCERY_IMAGE_PROMPTS.md at the repo root.
 */
export const GROCERY_PHOTOS = {
  // Slot 1, "Who shops": hands holding a phone, scanning a barcode in an aisle.
  // File: public/grocery-scan.webp, 4:3, 1600 x 1200.
  scan: {
    src: "/grocery-scan.webp" as string | null,
    alt: "A shopper's hands holding a phone up to a jar on a grocery shelf, scanning its barcode",
  },
  // Slot 2, "Good to know": a paper grocery bag on a doorstep.
  // File: public/grocery-doorstep.webp, 3:2, 1800 x 1200.
  doorstep: {
    src: "/grocery-doorstep.webp" as string | null,
    alt: "A paper grocery bag of bread, greens and staples waiting on a doormat beside a front door",
  },
  // Slot 3, "Coming too": a small halal grocer's shelves and counter.
  // File: public/grocery-grocer.webp, 3:2, 1800 x 1200.
  grocer: {
    src: "/grocery-grocer.webp" as string | null,
    alt: "Shelves of rice, dates, oil and jars in a small neighbourhood grocer, with wrapped packs on the counter",
  },
};

export function PhotoSlot({
  photo,
  aspect,
  sizes,
  fallback,
  className,
}: {
  photo: { src: string | null; alt: string };
  /** Tailwind aspect class, e.g. "aspect-[4/3]". */
  aspect: string;
  sizes: string;
  /** The drawn art shown until the photo exists. */
  fallback: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-cream-line bg-[#F6F1E7]",
        aspect,
        className,
      )}
    >
      {photo.src ? (
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
}
