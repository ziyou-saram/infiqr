// /src/components/cart/cart-context.tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

import type { MenuItem, MenuPrice } from "@/types/menu";

export type CartLineItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartLineItem[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (item: MenuItem) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const resolvePrice = (price: MenuPrice): number | null => {
  if (typeof price === "number") {
    return price;
  }

  if (price && typeof price === "object") {
    return Number.isFinite(price.min) ? price.min : Number.isFinite(price.max) ? price.max : null;
  }

  return null;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem) => {
    const price = resolvePrice(menuItem.price);
    if (price == null) {
      console.warn(`Cannot add "${menuItem.name}" to cart because price is unavailable.`);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.name);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...prev,
        {
          id: menuItem.name,
          name: menuItem.name,
          price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const incrementItem = useCallback((id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  }, []);

  const decrementItem = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { totalQuantity, totalPrice } = useMemo(() => {
    const nextTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const nextTotalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { totalQuantity: nextTotalQuantity, totalPrice: nextTotalPrice };
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      incrementItem,
      decrementItem,
      clearCart,
      totalQuantity,
      totalPrice,
    }),
    [items, addItem, incrementItem, decrementItem, clearCart, totalQuantity, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
