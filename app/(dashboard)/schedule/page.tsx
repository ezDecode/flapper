"use client";

import { Flex, H1, Text } from "@maximeheckel/design-system";
import { CalendarDays } from "lucide-react";
import { ScheduleCalendar } from "@/components/ScheduleCalendar";

export default function SchedulePage() {
  return (
    <Flex direction="column" gap="5">
      <Flex alignItems="center" gap="3">
        <CalendarDays size={24} className="text-[#7C3AED]" />
        <div>
          <H1>Schedule</H1>
          <Text size="2" variant="tertiary">
            Manage your content calendar and upcoming posts.
          </Text>
        </div>
      </Flex>
      <ScheduleCalendar />
    </Flex>
  );
}
