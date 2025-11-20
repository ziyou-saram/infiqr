// /src/components/cart/cart.tsx
'use client'
import React from "react";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-context";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formatCurrency = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;

export default function Cart() {
    const { items, totalPrice, totalQuantity, incrementItem, decrementItem, clearCart } = useCart();
    const hasItems = items.length > 0;
    const triggerLabel = totalQuantity > 99 ? "99+" : totalQuantity.toString();

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="secondary" size="lg" className="rounded-4xl" aria-label="Открыть корзину">
                    <ShoppingBag />
                    {triggerLabel}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                    <DrawerTitle>Корзина</DrawerTitle>
                    <DrawerDescription>
                        {hasItems ? "Измените позиции перед оформлением" : "Добавьте блюда, чтобы оформить заказ"}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="mx-auto w-full max-w-4xl flex-1 px-4">
                    {!hasItems ? (
                        <p className="text-muted-foreground py-8 text-center">Корзина пуста.</p>
                    ) : (
                        <ScrollArea className="max-h-[50vh]">
                            <div className="flex flex-col gap-4 py-2 pr-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-3">
                                        <div className="space-y-1">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {formatCurrency(item.price)} × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Уменьшить ${item.name}`}
                                                onClick={() => decrementItem(item.id)}
                                            >
                                                <Minus className="size-4" />
                                            </Button>
                                            <span className="min-w-6 text-center font-semibold">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Увеличить ${item.name}`}
                                                onClick={() => incrementItem(item.id)}
                                            >
                                                <Plus className="size-4" />
                                            </Button>
                                            <span className="w-20 text-right font-semibold">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex items-center justify-between font-semibold">
                                    <p>Итого</p>
                                    <p>{formatCurrency(totalPrice)}</p>
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>
                <DrawerFooter>
                    <Button variant="outline" className="w-full" onClick={clearCart} disabled={!hasItems}>
                        <Trash2 className="size-4" />
                        Очистить
                    </Button>
                    <Button className="w-full" disabled={!hasItems} asChild>
                        <Link href={"/checkout"}>
                            Оформить заказ
                        </Link>
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
