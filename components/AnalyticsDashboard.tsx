"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, subDays } from "date-fns";
import { Card, Flex, Text } from "@maximeheckel/design-system";
import { Heart, Zap, Twitter, Linkedin, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MetricRow = {
  day: string;
  twitter: number;
  linkedin: number;
  bluesky: number;
};

const emptySeries = Array.from({ length: 7 }).map((_, index) => ({
  day: format(subDays(new Date(), 6 - index), "MMM d"),
  twitter: 0,
  linkedin: 0,
  bluesky: 0,
}));

export function AnalyticsDashboard() {
  const supabase = createClient();
  const [series, setSeries] = useState<MetricRow[]>(emptySeries);
  const [topPosts, setTopPosts] = useState<
    Array<{ label: string; likes: number }>
  >([]);

  useEffect(() => {
    const load = async () => {
      const { data: targets } = await supabase
        .from("post_targets")
        .select("platform, likes_count, published_at, platform_post_id")
        .not("published_at", "is", null);

      if (!targets || targets.length === 0) {
        return;
      }

      const bucket = new Map<string, MetricRow>();
      emptySeries.forEach((row) => bucket.set(row.day, { ...row }));

      targets.forEach((target) => {
        if (!target.published_at) {
          return;
        }
        const key = format(new Date(target.published_at), "MMM d");
        const row = bucket.get(key);
        if (!row) {
          return;
        }
        if (target.platform === "TWITTER") {
          row.twitter += target.likes_count;
        } else if (target.platform === "LINKEDIN") {
          row.linkedin += target.likes_count;
        } else if (target.platform === "BLUESKY") {
          row.bluesky += target.likes_count;
        }
      });

      setSeries(Array.from(bucket.values()));

      const top = targets
        .slice()
        .sort((a, b) => b.likes_count - a.likes_count)
        .slice(0, 5)
        .map((item, index) => ({
          label:
            item.platform_post_id?.slice(0, 8) || `Post ${index + 1}`,
          likes: item.likes_count,
        }));

      setTopPosts(top);
    };

    void load();
  }, []);

  const plugsFired = useMemo(
    () =>
      series.reduce(
        (sum, row) => sum + row.twitter + row.linkedin + row.bluesky,
        0
      ),
    [series]
  );

  return (
    <Flex direction="column" gap="5">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <Card.Body>
            <Flex direction="column" gap="2">
              <Flex alignItems="center" gap="2">
                <Heart size={16} className="text-[#7C3AED]" />
                <Text size="1" variant="tertiary">
                  Total engagement (7d)
                </Text>
              </Flex>
              <Text size="4" weight="4">
                {plugsFired}
              </Text>
            </Flex>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Flex direction="column" gap="2">
              <Flex alignItems="center" gap="2">
                <Zap size={16} className="text-[#7C3AED]" />
                <Text size="1" variant="tertiary">
                  Top posts tracked
                </Text>
              </Flex>
              <Text size="4" weight="4">
                {topPosts.length}
              </Text>
            </Flex>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Flex direction="column" gap="2">
              <Flex alignItems="center" gap="2">
                <Globe size={16} className="text-[#7C3AED]" />
                <Text size="1" variant="tertiary">
                  Platforms active
                </Text>
              </Flex>
              <Text size="4" weight="4">
                3
              </Text>
            </Flex>
          </Card.Body>
        </Card>
      </div>

      {/* Engagement over time */}
      <Card>
        <Card.Header>
          <Flex alignItems="center" justifyContent="space-between">
            <Text size="2" weight="4">
              Engagement over time
            </Text>
            <Flex gap="3" alignItems="center">
              <Flex alignItems="center" gap="1">
                <div className="h-2 w-2 rounded-full bg-[#0ea5e9]" />
                <Text size="1" variant="tertiary">
                  Twitter
                </Text>
              </Flex>
              <Flex alignItems="center" gap="1">
                <div className="h-2 w-2 rounded-full bg-[#1d4ed8]" />
                <Text size="1" variant="tertiary">
                  LinkedIn
                </Text>
              </Flex>
              <Flex alignItems="center" gap="1">
                <div className="h-2 w-2 rounded-full bg-[#14b8a6]" />
                <Text size="1" variant="tertiary">
                  Bluesky
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card.Header>
        <Card.Body>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E8E8E4"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#6B6B6B" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6B6B6B" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="twitter"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="linkedin"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bluesky"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>

      {/* Top posts by likes */}
      <Card>
        <Card.Header>
          <Text size="2" weight="4">
            Top posts by likes
          </Text>
        </Card.Header>
        <Card.Body>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPosts}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E8E8E4"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#6B6B6B" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#6B6B6B" }} />
                <Tooltip />
                <Bar
                  dataKey="likes"
                  fill="#7C3AED"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    </Flex>
  );
}
