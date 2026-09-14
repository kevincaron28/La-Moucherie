"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  variantNameFr: string;
  variantNameEn: string;
  sku: string;
  // Mirrors the product's category so the checkout can preview bulk pricing;
  // the charge itself is always recomputed server-side from the database.
  category: string;
  unitPriceCents: number;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  /** Merges a recovered basket in, keeping whatever is already in the cart. */
  mergeItems: (incoming: CartItem[]) => void;
  subtotalCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "la-moucherie-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage, which isn't available during SSR
    // (needed so the server-rendered empty cart doesn't hydration-mismatch).
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota/blocked storage errors
    }
  }, [items, hydrated]);

  const mergeItems = useCallback<CartContextValue["mergeItems"]>((incoming) => {
    setItems((prev) => {
      const merged = [...prev];
      for (const item of incoming) {
        const existing = merged.find((i) => i.variantId === item.variantId);
        // Take the larger quantity rather than summing: the recovered order and
        // the current cart usually describe the same intent, and doubling it
        // would be a nasty surprise at checkout.
        if (existing) existing.quantity = Math.max(existing.quantity, item.quantity);
        else merged.push(item);
      }
      return merged;
    });
  }, []);

  const addItem = useCallback<CartContextValue["addItem"]>(
    (item, quantity) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.variantId === item.variantId);
        if (existing) {
          return prev.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      mergeItems,
      subtotalCents,
      itemCount,
    }),
    [items, addItem, removeItem, setQuantity, clear, mergeItems, subtotalCents, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
