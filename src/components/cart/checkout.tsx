// /src/components/cart/checkout.tsx
"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "../ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formatCurrency = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;

export default function Checkout() {
    const { items, totalPrice, totalQuantity, clearCart } = useCart();
    const hasItems = items.length > 0;
    const router = useRouter();

    const orderTimestamp = useMemo(() => new Date(), []);
    const orderCode = useMemo(
        () =>
            `#${orderTimestamp
                .toISOString()
                .slice(11, 19)
                .replace(/:/g, "")}`,
        [orderTimestamp],
    );
    const orderTimeLabel = useMemo(
        () => orderTimestamp.toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" }),
        [orderTimestamp],
    );

    return (
        <section className="flex h-full flex-col gap-4">
            <div className="bg-background rounded-4xl p-4 md:p-6">
                <header className="mb-6 space-y-1 text-center">
                    <h1 className="text-2xl font-semibold">Готовый заказ</h1>
                    <p className="text-muted-foreground text-sm">Покажите этот экран официанту для подтверждения.</p>
                </header>

                {!hasItems ? (
                    <p className="text-muted-foreground py-16 text-center">Корзина пуста. Вернитесь в меню, чтобы добавить блюда.</p>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-secondary/10 text-muted-foreground rounded-3xl border p-4 text-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-foreground font-medium">Номер заказа</p>
                                <p className="text-foreground text-xl font-semibold">{orderCode}</p>
                            </div>
                            <p>{orderTimeLabel}</p>
                            <p>Позиции: {totalQuantity}</p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Состав заказа</p>
                            <ScrollArea className="bg-secondary/5 max-h-[460px] rounded-2xl border">
                                <div className="divide-y px-4 py-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-3 text-sm">
                                            <p className="text-foreground font-medium">{item.name}</p>
                                            <p className="text-muted-foreground">{item.quantity} шт</p>
                                            <p className="text-right font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="bg-secondary/10 rounded-3xl border p-4">
                            <div className="text-muted-foreground flex items-center justify-between text-sm">
                                <span>Общая стоимость</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                            <Separator className="my-3" />
                            <div className="flex items-center justify-between text-lg font-semibold">
                                <span>Итого к оплате</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="bg-background mt-auto w-full rounded-4xl p-4">
                <Button
                    variant="secondary"
                    className="w-full rounded-4xl"
                    onClick={() => {
                        clearCart();
                        router.push("/");
                        router.refresh();
                    }}
                >
                    Вернуться в меню
                </Button>
            </div>
        </section>
    );
}
