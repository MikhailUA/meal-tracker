import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { meals } from "@/db/schema";

export async function getMealsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return db.query.meals.findMany({
    where: { userId, eatenAt: { gte: start, lt: end } },
    orderBy: { eatenAt: "asc" },
    with: { mealFoodItems: { with: { foodItem: true } } },
  });
}

export async function createMeal(data: { name: string; eatenAt: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [meal] = await db
    .insert(meals)
    .values({ userId, name: data.name, eatenAt: data.eatenAt })
    .returning();

  return meal;
}

export async function getMeal(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.meals.findFirst({
    where: { id, userId },
  });
}

export async function updateMeal(
  id: string,
  data: { name: string; eatenAt: Date },
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [meal] = await db
    .update(meals)
    .set({ name: data.name, eatenAt: data.eatenAt })
    .where(and(eq(meals.id, id), eq(meals.userId, userId)))
    .returning();

  if (!meal) throw new Error("Meal not found");
  return meal;
}
