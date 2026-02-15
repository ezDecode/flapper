"use client";

import { Flex, H1, Text } from "@maximeheckel/design-system";
import { Send } from "lucide-react";
import { PostComposer } from "@/components/PostComposer";

export default function ComposePage() {
  return (
    <Flex direction="column" gap="5">
      <Flex alignItems="center" gap="3">
        <Send size={24} className="text-[#F76707]" />
        <div>
          <H1>Compose</H1>
          <Text size="2" variant="tertiary">
            Write, schedule, and auto-plug your posts across platforms.
          </Text>
        </div>
      </Flex>
      <PostComposer />
    </Flex>
  );
}
