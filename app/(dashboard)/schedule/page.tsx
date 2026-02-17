"use client";

import { CalendarDays } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <CalendarDays size={24} className="text-[#00AA45]" />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#000000]">Schedule</h1>
          <p className="text-sm text-[#6B6B6B]">
            Manage your content calendar and upcoming posts.
          </p>
        </div>
      </div>
      <ScheduleCalendar />
    </div>
  );
}
