"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFoodItemAction } from "./actions";

// Behavior-only form: composes shadcn primitives and calls the server action
// with typed values (no FormData).
export function AddFoodItemForm({ mealId }: { mealId: string }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await addFoodItemAction({
          mealId,
          name,
          calories: Number(calories),
          quantity: Number(quantity),
        });
        toast.success("Food item added");
        setName("");
        setCalories("");
        setQuantity("1");
      } catch {
        setError("Could not add the food item. Check the fields and try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="food-name">Name</Label>
        <Input
          id="food-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="food-calories">Calories</Label>
          <Input
            id="food-calories"
            type="number"
            min={0}
            step={1}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="food-quantity">Quantity</Label>
          <Input
            id="food-quantity"
            type="number"
            min={0.01}
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add food item"}
      </Button>
    </form>
  );
}
