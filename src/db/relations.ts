import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  meals: {
    mealFoodItems: r.many.mealFoodItems({
      from: r.meals.id,
      to: r.mealFoodItems.mealId,
    }),
    foodItems: r.many.foodItems({
      from: r.meals.id.through(r.mealFoodItems.mealId),
      to: r.foodItems.id.through(r.mealFoodItems.foodItemId),
    }),
  },
  foodItems: {
    mealFoodItems: r.many.mealFoodItems({
      from: r.foodItems.id,
      to: r.mealFoodItems.foodItemId,
    }),
  },
  mealFoodItems: {
    meal: r.one.meals({
      from: r.mealFoodItems.mealId,
      to: r.meals.id,
    }),
    foodItem: r.one.foodItems({
      from: r.mealFoodItems.foodItemId,
      to: r.foodItems.id,
    }),
  },
}));
