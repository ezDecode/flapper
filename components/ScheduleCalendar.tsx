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
  DRAFT: "hsl(var(--text-muted))",
  SCHEDULED: "hsl(var(--primary))",
  PUBLISHING: "hsl(var(--warm, 38 92% 50%))",
  PUBLISHED: "hsl(var(--success))",
  FAILED: "hsl(var(--destructive))",
};

const statusPillClasses: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground border border-border",
  SCHEDULED: "bg-primary/10 text-primary border border-primary/20",
  PUBLISHING: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  PUBLISHED: "bg-success/10 text-success border border-success/20",
  FAILED: "bg-destructive/10 text-destructive border border-destructive/20",
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
        backgroundColor: statusColor[event.resource.status] ?? "hsl(var(--text-muted))",
        borderColor: "transparent",
        color: "white",
        borderRadius: 8,
        fontSize: "0.8125rem",
      },
    }),
    []
  );

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Post Calendar
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20">Scheduled</span>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success border border-success/20">Published</span>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">Failed</span>
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
          <div className="mt-4 rounded-xl border border-border bg-surface-alt p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">
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
              <p className="text-xs text-muted-foreground">
                {format(selectedEvent.start as Date, "PPpp")}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
