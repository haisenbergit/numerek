"use client";

import { CreateOrderForm, OrdersList } from "@/features/orders/components";

export default function CreateOrderPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-6xl space-y-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Zarządzanie zamówieniami
          </h1>
          <p className="mt-2 text-slate-600">
            Utwórz nowe zamówienie lub przeglądaj istniejące
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex justify-center lg:justify-end">
            <CreateOrderForm />
          </div>
          <div className="flex justify-center lg:justify-start">
            <OrdersList />
          </div>
        </div>
      </div>
    </div>
  );
}
