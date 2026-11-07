import { format, isValid, parse } from "date-fns";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMealsForDate } from "@/data/meals";
import { DatePicker } from "./date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const parsed = dateParam
    ? parse(dateParam, "yyyy-MM-dd", new Date())
    : new Date();
  const date = isValid(parsed) ? parsed : new Date();

  const meals = await getMealsForDate(date);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <DatePicker date={date} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meals</CardTitle>
          <CardDescription>{format(date, "EEEE, MMMM d, yyyy")}</CardDescription>
          <CardAction>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/meals/new" />}
            >
              <Plus />
              Log new meal
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No meals logged for this date.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {meals.map((meal) => {
                const calories = meal.mealFoodItems.reduce(
                  (sum, mfi) =>
                    sum + (mfi.foodItem?.calories ?? 0) * Number(mfi.quantity),
                  0,
                );
                return (
                  <li key={meal.id}>
                    <Card size="sm">
                      <CardHeader>
                        <CardTitle>{meal.name}</CardTitle>
                        <CardDescription>
                          {format(meal.eatenAt, "HH:mm")} · {Math.round(calories)} kcal
                        </CardDescription>
                        <CardAction>
                          <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={<Link href={`/dashboard/meals/${meal.id}`} />}
                          >
                            <Pencil />
                            Edit
                          </Button>
                        </CardAction>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {meal.mealFoodItems.map((mfi) => (
                          <Badge key={mfi.foodItemId} variant="secondary">
                            {mfi.foodItem?.name}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
