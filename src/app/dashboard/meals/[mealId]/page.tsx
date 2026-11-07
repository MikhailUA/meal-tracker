import { notFound } from "next/navigation";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMeal } from "@/data/meals";
import { EditMealForm } from "./edit-meal-form";

export default async function EditMealPage({
  params,
}: PageProps<"/dashboard/meals/[mealId]">) {
  const { mealId } = await params;
  if (!z.uuid().safeParse(mealId).success) notFound();

  const meal = await getMeal(mealId);
  if (!meal) notFound();

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
    </main>
  );
}
