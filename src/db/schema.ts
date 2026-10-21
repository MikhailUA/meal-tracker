import { index, integer, numeric, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const meals = pgTable('meals', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID
  name: text().notNull(),
  eatenAt: timestamp('eaten_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => [
  index('meals_user_id_eaten_at_idx').on(t.userId, t.eatenAt),
]);

// Shared catalog of foods.
export const foodItems = pgTable('food_items', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  calories: integer(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('food_items_name_idx').on(t.name),
]);

export const mealFoodItems = pgTable('meal_food_items', {
  mealId: uuid('meal_id').notNull().references(() => meals.id, { onDelete: 'cascade' }),
  foodItemId: uuid('food_item_id').notNull().references(() => foodItems.id, { onDelete: 'restrict' }),
  quantity: numeric({ precision: 8, scale: 2 }).notNull().default('1'), 
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.mealId, t.foodItemId] }),
  index('meal_food_items_food_item_id_idx').on(t.foodItemId),
]);

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
export type FoodItem = typeof foodItems.$inferSelect;
export type NewFoodItem = typeof foodItems.$inferInsert;
export type MealFoodItem = typeof mealFoodItems.$inferSelect;
export type NewMealFoodItem = typeof mealFoodItems.$inferInsert;
