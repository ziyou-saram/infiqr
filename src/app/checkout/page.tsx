// /src/app/checkout/page.tsx
import React from "react";
import { Suspense } from "react";

import Checkout from "@/components/cart/checkout";

export default function CheckoutPage() {
  return (
    <div className="relative mx-auto min-h-dvh max-w-4xl">
      <main className="flex flex-col gap-8 p-4 md:p-6 lg:gap-10 lg:p-8">
        <Suspense>
          <Checkout />
        </Suspense>
      </main>
    </div>
  );
}
