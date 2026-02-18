"use client";

import { CalendarDays } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <CalendarDays size={24} className="text-primary" />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Schedule</h1>
          <p className="text-sm text-muted-foreground">
            Manage your content calendar and upcoming posts.
          </p>
        </div>
      </div>
      <ScheduleCalendar />
    </div>
  );
}
