// /src/components/menu/menu-item-card.tsx
import React from "react";

import { useCart } from "@/components/cart/cart-context";
import type { MenuItem, MenuPrice } from "@/types/menu";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type MenuItemCardProps = {
  item: MenuItem;
};

const formatPrice = (price: MenuPrice) => {
  if (price == null) {
    return "";
  }

  if (typeof price === "number") {
    return price.toLocaleString("ru-RU");
  }

  return `${price.min.toLocaleString("ru-RU")} / ${price.max.toLocaleString("ru-RU")}`;
};

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const priceLabel = formatPrice(item.price);
  const { addItem } = useCart();

  if (!priceLabel) {
    return null;
  }

  return (
    <Card className="bg-secondary/30 rounded-2xl border-none shadow-none">
      {item.image.length > 0 && <CardHeader>
        <img src={item.image[0]} alt="" className="aspect-3/2 h-full w-full rounded-2xl object-cover" />
      </CardHeader>}
      <CardContent className="space-y-2 p-4 pb-0">
        <CardTitle>{item.name}</CardTitle>
      </CardContent>
      <CardFooter className="mt-auto flex items-center justify-between gap-2 p-4 pt-2">
        <p className="text-base font-semibold">{priceLabel} ₸</p>
        <Button className="w-fit rounded-4xl" onClick={() => addItem(item)}>
          <Plus />
          Добавить
        </Button>
      </CardFooter>
    </Card>
  );
}
