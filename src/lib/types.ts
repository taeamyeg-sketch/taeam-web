export type DayHours = { open: string; close: string } | null;

export type RestaurantHours = Partial<
  Record<
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday",
    DayHours
  >
>;

export interface Restaurant {
  id: string;
  name: string;
  category: string | null;
  categories: string[] | null;
  description: string | null;
  address: string | null;
  hours: RestaurantHours | null;
  average_rating: number | null;
  total_reviews: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  hero_video_url: string | null;
  delivery_fee: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  is_open: boolean;
  accepting_orders: boolean;
  supports_pickup: boolean | null;
  halal_trust_score: number | null;
  slaughter_type: string | null;
  stunning_method: string | null;
  verification_status: string | null;
  is_test: boolean | null;
  latitude: number | null;
  longitude: number | null;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  options: MenuOptionGroup[] | null;
  is_available: boolean;
  sort_order: number | null;
  is_spicy: boolean | null;
  is_vegetarian: boolean | null;
  is_vegan: boolean | null;
}

/** Modifier groups — defensive shape; current data has none yet. */
export interface MenuOptionGroup {
  name: string;
  required?: boolean;
  multiple?: boolean;
  choices?: { name: string; price?: number }[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  is_active: boolean;
}
