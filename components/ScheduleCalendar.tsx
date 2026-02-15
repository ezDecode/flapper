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
import { Card, Flex, Pill, Text } from "@maximeheckel/design-system";
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
  DRAFT: "#8f9ba8",
  SCHEDULED: "#0284c7",
  PUBLISHING: "#b45309",
  PUBLISHED: "#16a34a",
  FAILED: "#dc2626",
};

const statusPillVariant: Record<string, "info" | "success" | "danger" | "warning"> = {
  DRAFT: "info",
  SCHEDULED: "info",
  PUBLISHING: "warning",
  PUBLISHED: "success",
  FAILED: "danger",
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
    <Card>
      <Card.Header>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap="2">
            <Clock size={16} className="text-[#6B6B6B]" />
            <Text size="2" weight="4">
              Post Calendar
            </Text>
          </Flex>
          <Flex gap="2">
            <Pill variant="info">Scheduled</Pill>
            <Pill variant="success">Published</Pill>
            <Pill variant="danger">Failed</Pill>
          </Flex>
        </Flex>
      </Card.Header>
      <Card.Body>
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
            <Flex direction="column" gap="2">
              <Flex alignItems="center" gap="2">
                <Text size="2" weight="4">
                  Selected post
                </Text>
                <Pill
                  variant={
                    statusPillVariant[selectedEvent.resource.status] ?? "info"
                  }
                >
                  {selectedEvent.resource.status}
                </Pill>
              </Flex>
              <Text size="2">{selectedEvent.title}</Text>
              <Text size="1" variant="tertiary">
                {format(selectedEvent.start as Date, "PPpp")}
              </Text>
            </Flex>
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
}
