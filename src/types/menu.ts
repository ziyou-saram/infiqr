// /src/types/menu.ts
import rawMenu from "../../infiqr_menu_b2c_complete.json";

export type Menu = MenuCategory[];

export interface MenuCategory {
  category: string;
  order?: number;
  subcategories: MenuSubcategory[];
}

export interface MenuSubcategory {
  name: string;
  order?: number;
  items: MenuItem[];
}

export type MenuPrice = number | PriceRange | null;

export interface PriceRange {
  min: number;
  max: number;
}

export interface MenuItem {
  name: string;
  price: MenuPrice;
  image: string[];
}

type RawMenu = typeof rawMenu;

const parsePrice = (price: string): MenuPrice => {
  const trimmed = price.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split("/").map((value) => Number(value.trim()));
  if (parts.length === 2 && parts.every((value) => Number.isFinite(value))) {
    return { min: parts[0], max: parts[1] };
  }

  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
};

const normalizeMenu = (data: RawMenu): Menu =>
  data.map((category) => ({
    category: category.category,
    order: typeof category.order === "number" ? category.order : undefined,
    subcategories: (category.subcategories ?? []).map((subcategory) => ({
      name: subcategory.name,
      order: typeof subcategory.order === "number" ? subcategory.order : undefined,
      items: (subcategory.items ?? []).map((item) => ({
        name: item.name,
        price: parsePrice(item.price ?? ""),
        image: Array.isArray(item.image) ? item.image : [],
      })),
    })),
  }));

export const menuData: Menu = normalizeMenu(rawMenu);
