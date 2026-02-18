"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type Event,
  type View,
} from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PostEvent = Event & {
  resource: {
    id: string;
    status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
  };
};

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const statusColor: Record<string, string> = {
  DRAFT: "#333333",
  SCHEDULED: "#666666",
  PUBLISHING: "#888888",
  PUBLISHED: "#FFFFFF",
  FAILED: "#333333",
};

const statusPillClasses: Record<string, string> = {
  DRAFT: "bg-white/10 text-white border border-white/20",
  SCHEDULED: "bg-white/10 text-white border border-white/20",
  PUBLISHING: "bg-white/10 text-white border border-white/20",
  PUBLISHED: "bg-white/10 text-white border border-white/20",
  FAILED: "bg-white/10 text-white border border-white/20",
};

export function ScheduleCalendar() {
  const supabase = createClient();
  const [events, setEvents] = useState<PostEvent[]>([]);
  const [view, setView] = useState<View>("month");
  const [selectedEvent, setSelectedEvent] = useState<PostEvent | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, content, status, scheduled_at, published_at")
        .order("scheduled_at", { ascending: true });

      const mapped =
        data?.map((post) => {
          const when =
            post.scheduled_at ?? post.published_at ?? new Date().toISOString();
          return {
            title: post.content.slice(0, 50) || "(no content)",
            start: new Date(when),
            end: new Date(new Date(when).getTime() + 30 * 60 * 1000),
            resource: {
              id: post.id,
              status: post.status,
            },
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
        borderRadius: 8,
        fontSize: "0.8125rem",
      },
    }),
    []
  );

  return (
    <div className="rounded-xl border border-[#E8E8E4] bg-white">
      <div className="border-b border-[#E8E8E4] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#6B6B6B]" />
            <p className="text-sm font-medium text-[#1A1A2E]">
              Post Calendar
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/10 text-white border border-white/20">Scheduled</span>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/10 text-white border border-white/20">Published</span>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/10 text-white border border-white/20">Failed</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(nextView: View) => setView(nextView)}
          onSelectEvent={(event: Event) =>
            setSelectedEvent(event as PostEvent)
          }
          eventPropGetter={eventPropGetter}
          style={{ height: 600 }}
        />

        {selectedEvent ? (
          <div className="mt-4 rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#1A1A2E]">
                  Selected post
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusPillClasses[selectedEvent.resource.status] ?? "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {selectedEvent.resource.status}
                </span>
              </div>
              <p className="text-sm">{selectedEvent.title}</p>
              <p className="text-xs text-[#6B6B7B]">
                {format(selectedEvent.start as Date, "PPpp")}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
