"use client";

import { CalendarDays } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <CalendarDays size={24} className="text-[#7C3AED]" />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1A1A2E]">Schedule</h1>
          <p className="text-sm text-[#6B6B7B]">
            Manage your content calendar and upcoming posts.
          </p>
        </div>
      </div>
      <ScheduleCalendar />
    </div>
  );
}
