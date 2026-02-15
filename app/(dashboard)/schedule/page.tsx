import { ScheduleCalendar } from "@/components/ScheduleCalendar";

export default function SchedulePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <ScheduleCalendar />
    </div>
  );
}
