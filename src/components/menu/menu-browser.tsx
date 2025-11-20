// /src/components/menu/menu-browser.tsx
"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import CategoryButton from "@/components/menu/category-button";
import MenuItemCard from "@/components/menu/menu-item-card";
import SubcategoryButton from "@/components/menu/subcategory-button";
import { MenuCategory, menuData, MenuItem, MenuSubcategory } from "@/types/menu";

const filterPricedItems = (items: MenuItem[] | null | undefined) => items?.filter((item) => item.price != null) ?? [];

const flattenCategoryItems = (category: MenuCategory | null) =>
  category?.subcategories.flatMap((subcategory) => filterPricedItems(subcategory.items)) ?? [];

export default function MenuBrowser() {
  const categories = useMemo(() => [...menuData].sort(sortByOrder), []);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeSubcategoryIndex, setActiveSubcategoryIndex] = useState(0);

  const activeCategory: MenuCategory | null = categories[activeCategoryIndex] ?? null;
  const subcategories: MenuSubcategory[] =
    activeCategory?.subcategories
      ?.map((subcategory) => ({
        ...subcategory,
        items: filterPricedItems(subcategory.items),
      }))
      .filter((subcategory) => subcategory.items.length > 0)
      .sort(sortByOrder) ?? [];
  const hasSubcategories = subcategories.length > 0;
  const activeSubcategory = hasSubcategories ? subcategories[activeSubcategoryIndex] ?? subcategories[0] : null;

  const itemsToDisplay = hasSubcategories ? activeSubcategory?.items ?? [] : flattenCategoryItems(activeCategory);
  const highlightImage = getHighlightImage(itemsToDisplay);

  if (!categories.length) {
    return <p className="text-muted-foreground">Menu is currently unavailable.</p>;
  }

  return (
    <section className="bg-background space-y-6 rounded-4xl p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-1 lg:flex-wrap">
          {categories.map((category, index) => (
            <CategoryButton
              key={category.category}
              category={category}
              isActive={index === activeCategoryIndex}
              onClick={() => {
                setActiveCategoryIndex(index);
                setActiveSubcategoryIndex(0);
              }}
            />
          ))}
        </div>
        {highlightImage && (
          <div className="bg-secondary/30 relative h-40 w-full overflow-hidden rounded-3xl sm:h-56 lg:w-1/3">
            <Image
              src={highlightImage || "/placeholder.svg"}
              alt={activeCategory?.category ?? "category image"}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {hasSubcategories && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-wrap">
          {subcategories.map((subcategory, index) => (
            <SubcategoryButton
              key={`${activeCategory?.category ?? "category"}-${subcategory.name}`}
              subcategory={subcategory}
              isActive={index === activeSubcategoryIndex}
              onClick={() => setActiveSubcategoryIndex(index)}
            />
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {itemsToDisplay.map((item) => (
          <MenuItemCard key={`${item.name}-${item.price ?? "price"}`} item={item} />
        ))}
      </div>
    </section>
  );
}

const getHighlightImage = (items: MenuItem[] | null | undefined) =>
  items?.find((item) => Array.isArray(item.image) && item.image.length > 0)?.image[0] ?? "";

const sortByOrder = <T extends { order?: number; category?: string; name?: string }>(a: T, b: T) => {
  const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
  const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) {
    return orderA - orderB;
  }

  const labelA = (a.category ?? a.name ?? "").toString();
  const labelB = (b.category ?? b.name ?? "").toString();
  return labelA.localeCompare(labelB, undefined, { sensitivity: "base" });
};
