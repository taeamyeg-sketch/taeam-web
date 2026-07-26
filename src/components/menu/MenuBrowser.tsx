"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Leaf, Plus } from "@phosphor-icons/react";
import { money } from "@/lib/format";
import type { MenuItem, Restaurant } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ItemSheet } from "./ItemSheet";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function MenuBrowser({
  restaurant,
  items,
}: {
  restaurant: Restaurant;
  items: MenuItem[];
}) {
  const sections = useMemo(() => {
    const by = new Map<string, MenuItem[]>();
    for (const item of items) {
      const cat = item.category?.trim() || "Menu";
      if (!by.has(cat)) by.set(cat, []);
      by.get(cat)!.push(item);
    }
    return [...by.entries()].map(([title, list]) => ({
      title,
      id: slugify(title),
      items: list,
    }));
  }, [items]);

  const [active, setActive] = useState(sections[0]?.id);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const suppressSpy = useRef(false);

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(`section-${s.id}`))
      .filter(Boolean) as HTMLElement[];
    if (!headings.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (suppressSpy.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("section-", ""));
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [sections]);

  function jump(id: string) {
    setActive(id);
    suppressSpy.current = true;
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => (suppressSpy.current = false), 800);
  }

  if (!items.length) {
    return (
      <p className="py-16 text-center text-ink-mute">
        This kitchen hasn&apos;t published its menu yet.
      </p>
    );
  }

  return (
    <div>
      {/* Category rail, sticks under the site header */}
      <nav className="rail sticky top-20 z-30 -mx-4 overflow-x-auto border-b border-cream-line bg-cream/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <div className="flex w-max gap-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => jump(s.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors",
                active === s.id
                  ? "bg-ink text-cream"
                  : "text-ink-soft hover:bg-cream-deep",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      </nav>

      <div className="mt-8 space-y-12 pb-28">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <h2
              id={`section-${section.id}`}
              className="scroll-mt-36 font-black uppercase tracking-tight text-2xl text-ink"
            >
              {section.title}
            </h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => item.is_available && setSelected(item)}
                    disabled={!item.is_available}
                    className={cn(
                      "group flex w-full items-stretch justify-between gap-4 rounded-2xl border border-cream-line bg-cream p-4 text-left transition-all",
                      item.is_available
                        ? "hover:-translate-y-0.5 hover:shadow-card"
                        : "opacity-50",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">{item.name}</p>
                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-mute">
                          {item.description}
                        </p>
                      )}
                      <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink">
                        {money(item.price)}
                        {item.is_spicy && (
                          <Flame
                            weight="fill"
                            className="h-4 w-4 text-red"
                            aria-label="Spicy"
                          />
                        )}
                        {(item.is_vegetarian || item.is_vegan) && (
                          <Leaf
                            weight="fill"
                            className="h-4 w-4 text-green"
                            aria-label={item.is_vegan ? "Vegan" : "Vegetarian"}
                          />
                        )}
                        {!item.is_available && (
                          <span className="text-xs font-medium text-ink-mute">
                            Sold out
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="relative flex shrink-0 items-center">
                      {item.image_url ? (
                        <span className="relative block h-24 w-24 overflow-hidden rounded-xl bg-cream-deep">
                          <Image
                            src={item.image_url}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </span>
                      ) : (
                        <span className="block h-24 w-2" aria-hidden />
                      )}
                      {item.is_available && (
                        <span className="absolute -bottom-1 -right-1 rounded-full border border-cream-line bg-cream p-1.5 text-ink shadow-card transition-colors group-hover:bg-gold">
                          <Plus className="h-4 w-4" aria-hidden />
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {selected && (
        <ItemSheet
          item={selected}
          restaurant={restaurant}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
