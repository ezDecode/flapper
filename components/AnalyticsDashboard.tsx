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
import { Heart, Zap, Twitter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MetricRow = {
  day: string;
  twitter: number;
};

const emptySeries = Array.from({ length: 7 }).map((_, index) => ({
  day: format(subDays(new Date(), 6 - index), "MMM d"),
  twitter: 0,
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
        (sum, row) => sum + row.twitter,
        0
      ),
    [series]
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-primary" />
              <p className="text-sm text-muted-foreground">
                Total engagement (7d)
              </p>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {plugsFired}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-primary" />
                <p className="text-sm text-muted-foreground">
                  Top posts tracked
                </p>
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {topPosts.length}
              </p>
            </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Twitter size={16} className="text-primary" />
                <p className="text-sm text-muted-foreground">
                  Platforms active
                </p>
              </div>
              <p className="text-2xl font-semibold text-foreground">
                1
              </p>
            </div>
        </div>
      </div>

      {/* Engagement over time */}
      {/* Engagement over time */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              Engagement over time
            </h3>
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-xs text-muted-foreground">
                  Twitter
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "hsl(var(--text-soft))" }}
                  stroke="hsl(var(--border))"
                />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--text-soft))" }} stroke="hsl(var(--border))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--text))" }}
                />
                <Line
                  type="monotone"
                  dataKey="twitter"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top posts by likes */}
      {/* Top posts by likes */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-lg font-medium text-foreground">
            Top posts by likes
          </h3>
        </div>
        <div className="p-6">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPosts}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "hsl(var(--text-soft))" }}
                  stroke="hsl(var(--border))"
                />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--text-soft))" }} stroke="hsl(var(--border))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", color: "hsl(var(--text))" }}
                />
                <Bar
                  dataKey="likes"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
