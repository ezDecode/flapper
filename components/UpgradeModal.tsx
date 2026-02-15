"use client";

import { Button, Card, Flex, H2, Text } from "@maximeheckel/design-system";
import { AlertCircle, Sparkles } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function UpgradeModal({ open, onClose }: Props) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <Card
        depth={2}
        className="w-full max-w-md animate-in fade-in zoom-in-95"
      >
        <Card.Body>
          <Flex direction="column" gap="4">
            <Flex alignItems="center" gap="3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4E6]">
                <AlertCircle size={20} className="text-[#F76707]" />
              </div>
              <H2>Usage limit reached</H2>
            </Flex>

            <Text size="2" variant="tertiary">
              You&apos;ve hit your plan&apos;s limit for scheduling posts and
              firing auto-plugs. Upgrade to Pro or Agency to keep growing.
            </Text>

            <Flex gap="3" justifyContent="flex-end">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                startIcon={<Sparkles size={16} />}
                onClick={() => {
                  window.location.href = "/settings";
                }}
              >
                View plans
              </Button>
            </Flex>
          </Flex>
        </Card.Body>
      </Card>
    </div>
  );
}
