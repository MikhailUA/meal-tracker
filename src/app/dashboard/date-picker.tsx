"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Behavior-only wrapper: composes shadcn primitives and navigates via the
// `date` search param so the Server Component page does the data fetching.
export function DatePicker({ date }: { date: Date }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="outline" className="w-56 justify-start" />}
      >
        <CalendarIcon />
        {format(date, "PPP")}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(selected) => {
            if (selected) {
              router.push(`/dashboard?date=${format(selected, "yyyy-MM-dd")}`);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
