import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { foodItems, mealFoodItems } from "@/db/schema";

async function requireOwnedMeal(mealId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const meal = await db.query.meals.findFirst({
    where: { id: mealId, userId },
  });
  if (!meal) throw new Error("Meal not found");
}

export async function addFoodItemToMeal(data: {
  mealId: string;
  name: string;
  calories: number;
  quantity: number;
}) {
  await requireOwnedMeal(data.mealId);

  let foodItem = await db.query.foodItems.findFirst({
    where: { name: data.name, calories: data.calories },
  });
  if (!foodItem) {
    [foodItem] = await db
      .insert(foodItems)
      .values({ name: data.name, calories: data.calories })
      .returning();
  }

  const existing = await db.query.mealFoodItems.findFirst({
    where: { mealId: data.mealId, foodItemId: foodItem.id },
  });

  if (existing) {
    await db
      .update(mealFoodItems)
      .set({ quantity: String(Number(existing.quantity) + data.quantity) })
      .where(
        and(
          eq(mealFoodItems.mealId, data.mealId),
          eq(mealFoodItems.foodItemId, foodItem.id),
        ),
      );
  } else {
    await db.insert(mealFoodItems).values({
      mealId: data.mealId,
      foodItemId: foodItem.id,
      quantity: String(data.quantity),
    });
  }
}

export async function updateMealFoodItemQuantity(data: {
  mealId: string;
  foodItemId: string;
  quantity: number;
}) {
  await requireOwnedMeal(data.mealId);

  const rows = await db
    .update(mealFoodItems)
    .set({ quantity: String(data.quantity) })
    .where(
      and(
        eq(mealFoodItems.mealId, data.mealId),
        eq(mealFoodItems.foodItemId, data.foodItemId),
      ),
    )
    .returning();
  if (rows.length === 0) throw new Error("Food item not found");
}

export async function removeFoodItemFromMeal(data: {
  mealId: string;
  foodItemId: string;
}) {
  await requireOwnedMeal(data.mealId);

  await db
    .delete(mealFoodItems)
    .where(
      and(
        eq(mealFoodItems.mealId, data.mealId),
        eq(mealFoodItems.foodItemId, data.foodItemId),
      ),
    );
}
