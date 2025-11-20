// /src/components/menu/subcategory-button.tsx
import React from "react";

import type { MenuSubcategory } from "@/types/menu";

import { Button } from "@/components/ui/button";

type SubcategoryButtonProps = {
  subcategory: MenuSubcategory;
  isActive?: boolean;
  onClick?: () => void;
};

export default function SubcategoryButton({ subcategory, isActive = false, onClick }: SubcategoryButtonProps) {
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
      {subcategory.name}
    </Button>
  );
}
