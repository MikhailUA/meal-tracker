"use client";

import { useState, useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { removeFoodItemAction, updateFoodItemQuantityAction } from "./actions";

// Behavior-only row: quantity edit and remove for one logged food item.
export function FoodItemRow({
  mealId,
  foodItemId,
  name,
  calories,
  quantity,
}: {
  mealId: string;
  foodItemId: string;
  name: string;
  calories: number | null;
  quantity: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(String(quantity));
  const changed = Number(value) !== quantity;

  function save() {
    startTransition(async () => {
      try {
        await updateFoodItemQuantityAction({
          mealId,
          foodItemId,
          quantity: Number(value),
        });
        toast.success("Quantity updated");
      } catch {
        toast.error("Could not update the quantity");
        setValue(String(quantity));
      }
    });
  }

  function remove() {
    startTransition(async () => {
      try {
        await removeFoodItemAction({ mealId, foodItemId });
        toast.success("Food item removed");
      } catch {
        toast.error("Could not remove the food item");
      }
    });
  }

  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{calories ?? "—"}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Input
            aria-label={`Quantity of ${name}`}
            type="number"
            min={0.01}
            step="any"
            className="w-20"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {changed && (
            <Button
              size="icon"
              variant="ghost"
              aria-label="Save quantity"
              disabled={isPending || !(Number(value) > 0)}
              onClick={save}
            >
              <Check />
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>{calories === null ? "—" : Math.round(calories * quantity)}</TableCell>
      <TableCell>
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Remove ${name}`}
          disabled={isPending}
          onClick={remove}
        >
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
}
