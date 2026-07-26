import { createClient } from "@supabase/supabase-js";
import type { MenuItem, Restaurant } from "./types";

const RESTAURANT_COLS =
  "id,name,category,categories,description,address,hours,average_rating,total_reviews,image_url,image_urls,hero_video_url,delivery_fee,delivery_time_min,delivery_time_max,is_open,accepting_orders,supports_pickup,halal_trust_score,slaughter_type,stunning_method,verification_status,is_test,latitude,longitude";

/**
 * Server-side reads use plain fetch through supabase-js with short revalidation
 * so menu edits in the restaurant app show up within a minute.
 */
function serverClient() {
  // Static-export builds (PREVIEW_EXPORT) bake data in at build time;
  // otherwise revalidate every minute so menu edits show up quickly.
  const fetchOpts = process.env.PREVIEW_EXPORT
    ? {}
    : { next: { revalidate: 60 } };
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, ...fetchOpts }),
      },
    },
  );
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await serverClient()
    .from("restaurants")
    .select(RESTAURANT_COLS)
    .eq("is_visible", true)
    .order("total_reviews", { ascending: false })
    .order("name");
  if (error) throw error;
  // Test rows must never surface on public pages (homepage picks, cuisine
  // pages, static params). Direct getRestaurant(id) stays unfiltered so a
  // test kitchen is still reachable by URL during dev.
  const rows = (data ?? []) as unknown as Restaurant[];
  return rows.filter((r) => !r.is_test);
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  const { data, error } = await serverClient()
    .from("restaurants")
    .select(RESTAURANT_COLS)
    .eq("id", id)
    .eq("is_visible", true)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Restaurant) ?? null;
}

export async function getMenu(restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await serverClient()
    .from("menu_items")
    .select(
      "id,restaurant_id,name,description,price,image_url,category,options,is_available,sort_order,is_spicy,is_vegetarian,is_vegan",
    )
    .eq("restaurant_id", restaurantId)
    .order("category")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as unknown as MenuItem[];
}
