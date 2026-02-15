"use client";

import { Flex, H1, Text } from "@maximeheckel/design-system";
import { Eye } from "lucide-react";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <Flex direction="column" gap="5">
      <Flex alignItems="center" gap="3">
        <Eye size={24} className="text-[#7C3AED]" />
        <div>
          <H1>Analytics</H1>
          <Text size="2" variant="tertiary">
            Track engagement and auto-plug performance across platforms.
          </Text>
        </div>
      </Flex>
      <AnalyticsDashboard />
    </Flex>
  );
}
