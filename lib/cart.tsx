'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem } from './types';

const STORAGE_KEY = 'midg3:cart';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  has: (listingId: string) => boolean;
  add: (item: CartItem) => void;
  remove: (listingId: string) => void;
  clear: () => void;
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // Persist + notify other tabs.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price, 0);
    return {
      items,
      count: items.length,
      subtotal,
      ready,
      has: (id) => items.some((i) => i.listingId === id),
      // Resale items are one-of-a-kind, so each can be in the basket only once.
      add: (item) =>
        setItems((prev) => (prev.some((i) => i.listingId === item.listingId) ? prev : [...prev, item])),
      remove: (id) => setItems((prev) => prev.filter((i) => i.listingId !== id)),
      clear: () => setItems([]),
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
