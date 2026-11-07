"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMealAction } from "./actions";

// Behavior-only form: composes shadcn primitives and calls the server action
// with typed values (no FormData).
export function EditMealForm({
  meal,
}: {
  meal: { id: string; name: string; eatenAt: Date };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(meal.name);
  const [eatenAt, setEatenAt] = useState(() =>
    format(meal.eatenAt, "yyyy-MM-dd'T'HH:mm"),
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await updateMealAction({
          id: meal.id,
          name,
          eatenAt: new Date(eatenAt),
        });
        toast.success("Meal updated successfully");
        router.push(`/dashboard?date=${format(new Date(eatenAt), "yyyy-MM-dd")}`);
      } catch {
        setError("Could not update the meal. Check the fields and try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="eatenAt">Date and time</Label>
        <Input
          id="eatenAt"
          type="datetime-local"
          value={eatenAt}
          onChange={(e) => setEatenAt(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
