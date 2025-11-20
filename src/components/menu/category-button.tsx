// /src/components/menu/category-button.tsx
import React from "react";

import type { MenuCategory } from "@/types/menu";

import { Button } from "@/components/ui/button";

type CategoryButtonProps = {
  category: MenuCategory;
  isActive?: boolean;
  onClick?: () => void;
};

export default function CategoryButton({ category, isActive = false, onClick }: CategoryButtonProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="justify-start rounded-4xl"
      aria-pressed={isActive}
      onClick={handleClick}
    >
      {category.category}
    </Button>
  );
}
