// /src/app/page.tsx

import BusinessHeader from "@/components/business/business-header";
import Cart from "@/components/cart/cart";
import MenuBrowser from "@/components/menu/menu-browser";

export default function Home() {
  return (
    <div className="relative mx-auto min-h-dvh max-w-4xl">
      <main className="flex flex-col gap-8 p-4 md:p-6 lg:gap-10 lg:p-8">
        <BusinessHeader />
        <MenuBrowser />
      </main>
      <div className="fixed right-4 bottom-2 flex h-full flex-col justify-end-safe">
        <Cart />
      </div>
    </div>
  );
}
