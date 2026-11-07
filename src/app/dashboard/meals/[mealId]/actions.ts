"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  addFoodItemToMeal,
  removeFoodItemFromMeal,
  updateMealFoodItemQuantity,
} from "@/data/food-items";
import { updateMeal } from "@/data/meals";

const updateMealSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1).max(100),
  eatenAt: z.date(),
});

export async function updateMealAction(
  params: z.infer<typeof updateMealSchema>,
) {
  const { id, ...data } = updateMealSchema.parse(params);

  await updateMeal(id, data);
  revalidatePath("/dashboard");
}

const quantitySchema = z.number().positive().max(999999.99);

const addFoodItemSchema = z.object({
  mealId: z.uuid(),
  name: z.string().trim().min(1).max(100),
  calories: z.number().int().nonnegative().max(100000),
  quantity: quantitySchema,
});

export async function addFoodItemAction(
  params: z.infer<typeof addFoodItemSchema>,
) {
  const data = addFoodItemSchema.parse(params);

  await addFoodItemToMeal(data);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/meals/${data.mealId}`);
}

const updateFoodItemQuantitySchema = z.object({
  mealId: z.uuid(),
  foodItemId: z.uuid(),
  quantity: quantitySchema,
});

export async function updateFoodItemQuantityAction(
  params: z.infer<typeof updateFoodItemQuantitySchema>,
) {
  const data = updateFoodItemQuantitySchema.parse(params);

  await updateMealFoodItemQuantity(data);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/meals/${data.mealId}`);
}

const removeFoodItemSchema = z.object({
  mealId: z.uuid(),
  foodItemId: z.uuid(),
});

export async function removeFoodItemAction(
  params: z.infer<typeof removeFoodItemSchema>,
) {
  const data = removeFoodItemSchema.parse(params);

  await removeFoodItemFromMeal(data);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/meals/${data.mealId}`);
}
