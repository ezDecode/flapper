"use client";

import { Card, Flex, Pill, Text } from "@maximeheckel/design-system";
import { Twitter, Linkedin, Globe, MessageSquare } from "lucide-react";
import { PLATFORM_CHAR_LIMITS, type Platform } from "@/lib/constants";

type Props = {
  content: string;
  selectedPlatforms: Platform[];
};

const platformMeta: Record<
  Platform,
  { icon: React.ReactNode; label: string; color: string; bgClass: string }
> = {
  TWITTER: {
    icon: <Twitter size={16} />,
    label: "Twitter / X",
    color: "#1DA1F2",
    bgClass: "bg-[#E8F5FD]",
  },
  LINKEDIN: {
    icon: <Linkedin size={16} />,
    label: "LinkedIn",
    color: "#0A66C2",
    bgClass: "bg-[#E8F0FE]",
  },
  BLUESKY: {
    icon: <Globe size={16} />,
    label: "Bluesky",
    color: "#0085FF",
    bgClass: "bg-[#E8F4FF]",
  },
};

export function PostPreview({ content, selectedPlatforms }: Props) {
  return (
    <Card>
      <Card.Header>
        <Flex alignItems="center" gap="2">
          <MessageSquare size={16} className="text-[#6B6B6B]" />
          <Text size="2" weight="4">
            Post Preview
          </Text>
        </Flex>
      </Card.Header>
      <Card.Body>
        {selectedPlatforms.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#E8E8E4] px-6 py-10 text-center">
            <Text size="2" variant="tertiary">
              Select one or more platforms to preview your post.
            </Text>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {selectedPlatforms.map((platform) => {
              const meta = platformMeta[platform];
              const charLimit = PLATFORM_CHAR_LIMITS[platform];
              const remaining = charLimit - content.length;

              return (
                <div
                  key={platform}
                  className="rounded-xl border border-[#E8E8E4] bg-[#FAFAF8] p-4"
                >
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    gap="2"
                  >
                    <Flex alignItems="center" gap="2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${meta.bgClass}`}
                        style={{ color: meta.color }}
                      >
                        {meta.icon}
                      </div>
                      <Text size="1" weight="4">
                        {meta.label}
                      </Text>
                    </Flex>
                    <Pill
                      variant={remaining < 0 ? "danger" : "info"}
                    >
                      {remaining}
                    </Pill>
                  </Flex>

                  <div className="mt-3 min-h-[80px] rounded-lg bg-white p-3 shadow-sm">
                    <Text size="2" className="whitespace-pre-wrap">
                      {content || (
                        <span className="text-[#6B6B6B] italic">
                          Your post preview appears here…
                        </span>
                      )}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
