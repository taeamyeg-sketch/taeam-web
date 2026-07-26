"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartLine {
  key: string;
  itemId: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
  imageUrl?: string | null;
  category?: string | null;
}

interface CartRestaurant {
  id: string;
  name: string;
  deliveryFee: number | null;
}

interface CartState {
  restaurant: CartRestaurant | null;
  lines: CartLine[];
}

interface CartApi extends CartState {
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (restaurant: CartRestaurant, line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
}

const CartCtx = createContext<CartApi | null>(null);
const STORAGE_KEY = "taeam.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ restaurant: null, lines: [] });
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* fresh cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full/blocked — cart still works in memory */
    }
  }, [state, hydrated]);

  const add: CartApi["add"] = useCallback((restaurant, line) => {
    setState((prev) => {
      // One restaurant per cart, like the app: starting a new kitchen resets it.
      const sameRestaurant = prev.restaurant?.id === restaurant.id;
      const lines = sameRestaurant ? [...prev.lines] : [];
      const key = `${line.itemId}:${line.note ?? ""}`;
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        existing.qty += line.qty;
      } else {
        lines.push({ ...line, key });
      }
      return { restaurant, lines };
    });
  }, []);

  const setQty: CartApi["setQty"] = useCallback((key, qty) => {
    setState((prev) => {
      const lines = prev.lines
        .map((l) => (l.key === key ? { ...l, qty } : l))
        .filter((l) => l.qty > 0);
      return { restaurant: lines.length ? prev.restaurant : null, lines };
    });
  }, []);

  const clear = useCallback(() => {
    setState({ restaurant: null, lines: [] });
    setOpen(false);
  }, []);

  const value = useMemo<CartApi>(() => {
    const count = state.lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = state.lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { ...state, count, subtotal, open, setOpen, add, setQty, clear };
  }, [state, open, add, setQty, clear]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
