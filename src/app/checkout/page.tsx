"use client"

import Link from "next/link"
import { useMemo } from "react"

import { useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"

const currencyFormatter = new Intl.NumberFormat("ru-RU")

export default function CheckoutPage() {
  const { items, itemCount, totalPrice, clear } = useCart()
  const hasItems = items.length > 0

  const orderCode = useMemo(() => {
    const value = Math.floor(Math.random() * 9000 + 1000)
    return `#${value}`
  }, [])

  const summaryText = hasItems
    ? `Покажите этот экран официантке. Заказ ${orderCode} на ${itemCount} ${declineItems(
        itemCount
      )}.`
    : "Корзина пуста. Добавьте товары из меню."

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-black">Ваш заказ</h1>
          <p className="text-sm text-black/50">{summaryText}</p>
        </div>

        <Button asChild variant="outline" className="rounded-full border-black/10 text-black">
          <Link href="/">← Меню</Link>
        </Button>
      </div>

      {hasItems ? (
        <section className="space-y-6 rounded-2xl border border-black/10 bg-white px-6 py-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-black/40">
              Подтверждение
            </p>
            <div className="flex items-center gap-3 text-sm font-medium text-black/60">
              <span>Код заказа</span>
              <span className="text-lg font-semibold text-black">{orderCode}</span>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b border-black/5 pb-3 text-sm last:border-b-0 last:pb-0"
              >
                <div className="space-y-1">
                  <span className="text-black">{item.name}</span>
                  {item.variantName ? (
                    <span className="block text-xs text-black/60">{item.variantName}</span>
                  ) : null}
                  {item.variantDescription ? (
                    <span className="block text-xs text-black/40">
                      {item.variantDescription}
                    </span>
                  ) : null}
                  {item.quantity > 1 ? (
                    <span className="text-xs text-black/40">
                      × {item.quantity} · {currencyFormatter.format(item.price)} ₸
                    </span>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-black/70">
                  {currencyFormatter.format(item.price * item.quantity)} ₸
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/5 pt-4 text-base font-semibold text-black">
            <span>Итого</span>
            <span>{currencyFormatter.format(totalPrice)} ₸</span>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full border-black/10 text-black hover:border-black/40"
            onClick={clear}
          >
            Очистить корзину
          </Button>
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-black/20 py-12 text-center">
          <p className="text-sm text-black/50">
            Здесь появятся блюда, которые вы добавите в корзину.
          </p>
          <Button asChild className="mt-4 rounded-full bg-black text-white hover:bg-black/80">
            <Link href="/">Перейти к меню</Link>
          </Button>
        </div>
      )}
    </main>
  )
}

function declineItems(count: number) {
  const remainder10 = count % 10
  const remainder100 = count % 100

  if (remainder100 >= 11 && remainder100 <= 19) {
    return "позиций"
  }

  if (remainder10 === 1) {
    return "позиция"
  }

  if (remainder10 >= 2 && remainder10 <= 4) {
    return "позиции"
  }

  return "позиций"
}
