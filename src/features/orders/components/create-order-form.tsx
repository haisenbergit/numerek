"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateOrder } from "@/features/orders/api/use-create-order";

export const CreateOrderForm = () => {
  const router = useRouter();
  const [estimatedReadinessTime, setEstimatedReadinessTime] =
    useState<string>("");
  const [orderName, setOrderName] = useState<string>("");

  const { mutate, isPending } = useCreateOrder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estimatedReadinessTimeInMinutes = parseInt(
      estimatedReadinessTime,
      10
    );

    if (
      isNaN(estimatedReadinessTimeInMinutes) ||
      estimatedReadinessTimeInMinutes <= 0
    ) {
      toast.error("Wprowadź prawidłową liczbę minut");
      return;
    }

    void mutate(
      {
        timePreparationInMinutes: estimatedReadinessTimeInMinutes,
        name: orderName.trim() || undefined,
      },
      {
        onSuccess(orderId) {
          if (orderId) {
            toast.success("Zamówienie utworzone pomyślnie!");
            setEstimatedReadinessTime("");
            setOrderName("");
            router.refresh();
          } else {
            toast.error("Nie udało się utworzyć zamówienia");
          }
        },
        onError() {
          toast.error("Nie udało się utworzyć zamówienia");
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Utwórz nowe zamówienie</CardTitle>
        <CardDescription>Wprowadź czas zamówienia w minutach</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="orderName" className="text-sm font-medium">
              Nazwa zamówienia{" "}
              <span className="text-gray-400">(opcjonalnie)</span>
            </label>
            <Input
              id="orderName"
              type="text"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              disabled={isPending}
              placeholder="np. Pizza Margherita"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="orderTime" className="text-sm font-medium">
              Czas zamówienia (minuty)
            </label>
            <Input
              id="orderTime"
              type="number"
              value={estimatedReadinessTime}
              onChange={(e) => setEstimatedReadinessTime(e.target.value)}
              disabled={isPending}
              required
              autoFocus
              min={1}
              placeholder="np. 30"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Tworzenie..." : "Utwórz zamówienie"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
