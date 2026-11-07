"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

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
