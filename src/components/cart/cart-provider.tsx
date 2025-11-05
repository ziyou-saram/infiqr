"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { Product, ProductVariant } from "@/types/menu"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
  variantId?: string
  variantName?: string
  variantDescription?: string
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  addItem: (product: Product, variant?: ProductVariant | null) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = "infiqr:cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return []
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return []
      }

      const parsed = JSON.parse(stored) as Array<Record<string, unknown>>
      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed
        .filter(
          (item): item is Record<string, unknown> =>
            !!item &&
            typeof item.id === "string" &&
            typeof item.name === "string" &&
            typeof item.price === "number" &&
            typeof item.quantity === "number"
        )
        .map((item) => ({
          id: item.id as string,
          productId:
            typeof item.productId === "string" ? (item.productId as string) : (item.id as string),
          name: item.name as string,
          price: item.price as number,
          quantity: Math.max(1, Math.trunc(item.quantity as number)),
          image: typeof item.image === "string" ? (item.image as string) : undefined,
          description:
            typeof item.description === "string" ? (item.description as string) : undefined,
          variantId:
            typeof item.variantId === "string" ? (item.variantId as string) : undefined,
          variantName:
            typeof item.variantName === "string" ? (item.variantName as string) : undefined,
          variantDescription:
            typeof item.variantDescription === "string"
              ? (item.variantDescription as string)
              : undefined,
        }))
    } catch (error) {
      console.error("Failed to read cart from storage", error)
      return []
    }
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, variant?: ProductVariant | null) => {
    setItems((previousItems) => {
      const variantId = variant?.id
      const cartItemId = variantId ? `${product.id}:${variantId}` : product.id
      const existing = previousItems.find((item) => item.id === cartItemId)

      if (existing) {
        return previousItems.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...previousItems,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: variant?.price ?? product.price,
          image: product.image,
          description: product.description,
          variantId,
          variantName: variant?.name,
          variantDescription: variant?.description,
          quantity: 1,
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setItems((previousItems) => {
      if (quantity <= 0) {
        return previousItems.filter((item) => item.id !== cartItemId)
      }

      return previousItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    })
  }, [])

  const removeItem = useCallback((cartItemId: string) => {
    setItems((previousItems) =>
      previousItems.filter((item) => item.id !== cartItemId)
    )
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)
    const totalPrice = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    )

    return {
      items,
      itemCount,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clear,
    }
  }, [addItem, clear, items, removeItem, updateQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
