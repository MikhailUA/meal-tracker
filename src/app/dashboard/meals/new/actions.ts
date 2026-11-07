"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createMeal } from "@/data/meals";

const createMealSchema = z.object({
  name: z.string().trim().min(1).max(100),
  eatenAt: z.date(),
});

export async function createMealAction(
  params: z.infer<typeof createMealSchema>,
) {
  const data = createMealSchema.parse(params);

  await createMeal(data);
  revalidatePath("/dashboard");
}
