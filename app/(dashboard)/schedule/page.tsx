"use client";

import { Flex, H1, Text } from "@maximeheckel/design-system";
import { CalendarDays } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

export default function SchedulePage() {
  return (
    <Flex direction="column" gap="5">
      <Flex alignItems="center" gap="3">
        <CalendarDays size={24} className="text-[#F76707]" />
        <div>
          <H1>Schedule</H1>
          <Text size="2" variant="tertiary">
            View and manage your scheduled posts on the calendar.
          </Text>
        </div>
      </Flex>
      <ScheduleCalendar />
    </Flex>
  );
}
