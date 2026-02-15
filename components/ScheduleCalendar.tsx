"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, type Event, type View } from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { createClient } from "@/lib/supabase/client";

type PostEvent = Event & {
  resource: {
    id: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
  };
};

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales
});

const statusColor: Record<string, string> = {
  DRAFT: "#8f9ba8",
  SCHEDULED: "#0284c7",
  PUBLISHING: "#b45309",
  PUBLISHED: "#16a34a",
  FAILED: "#dc2626"
};

export function ScheduleCalendar() {
  const supabase = createClient();
  const [events, setEvents] = useState<PostEvent[]>([]);
  const [view, setView] = useState<View>("month");
  const [selectedEvent, setSelectedEvent] = useState<PostEvent | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("posts").select("id, content, status, scheduled_at, published_at").order("scheduled_at", {
        ascending: true
      });

      const mapped =
        data?.map((post) => {
          const when = post.scheduled_at ?? post.published_at ?? new Date().toISOString();
          return {
            title: post.content.slice(0, 50) || "(no content)",
            start: new Date(when),
            end: new Date(new Date(when).getTime() + 30 * 60 * 1000),
            resource: {
              id: post.id,
              status: post.status
            }
          } satisfies PostEvent;
        }) ?? [];

      setEvents(mapped);
    };
    void load();
  }, []);

  const eventPropGetter = useMemo(
    () => (event: PostEvent) => ({
      style: {
        backgroundColor: statusColor[event.resource.status] ?? "#64748b",
        borderColor: "transparent",
        color: "white",
        borderRadius: 8
      }
    }),
    []
  );

  return (
    <div className="space-y-4 rounded-xl border border-[var(--line)] bg-white p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={(nextView: View) => setView(nextView)}
        onSelectEvent={(event: Event) => setSelectedEvent(event as PostEvent)}
        eventPropGetter={eventPropGetter}
        style={{ height: 600 }}
      />

      {selectedEvent ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="font-semibold">Selected post</p>
          <p className="mt-1">{selectedEvent.title}</p>
          <p className="mt-1 text-slate-600">
            {selectedEvent.resource.status} · {format(selectedEvent.start as Date, "PPpp")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
