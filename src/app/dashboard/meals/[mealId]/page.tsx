import { notFound } from "next/navigation";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMeal } from "@/data/meals";
import { AddFoodItemForm } from "./add-food-item-form";
import { EditMealForm } from "./edit-meal-form";
import { FoodItemRow } from "./food-item-row";

export default async function EditMealPage({
  params,
}: PageProps<"/dashboard/meals/[mealId]">) {
  const { mealId } = await params;
  if (!z.uuid().safeParse(mealId).success) notFound();

  const meal = await getMeal(mealId);
  if (!meal) notFound();

  const totalCalories = meal.mealFoodItems.reduce(
    (sum, item) =>
      sum + (item.foodItem?.calories ?? 0) * Number(item.quantity),
    0,
  );

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit meal</CardTitle>
          <CardDescription>Update the details of this meal.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditMealForm
            meal={{ id: meal.id, name: meal.name, eatenAt: meal.eatenAt }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Food items</CardTitle>
          <CardDescription>
            {meal.mealFoodItems.length === 0
              ? "No food items logged yet."
              : `Total: ${Math.round(totalCalories)} kcal`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {meal.mealFoodItems.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {meal.mealFoodItems.map((item) => (
                  <FoodItemRow
                    key={item.foodItemId}
                    mealId={meal.id}
                    foodItemId={item.foodItemId}
                    name={item.foodItem?.name ?? ""}
                    calories={item.foodItem?.calories ?? null}
                    quantity={Number(item.quantity)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
          <AddFoodItemForm mealId={meal.id} />
        </CardContent>
      </Card>
    </main>
  );
}
