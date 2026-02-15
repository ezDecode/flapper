"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";
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
  bluesky: 0
}));

export function AnalyticsDashboard() {
  const supabase = createClient();
  const [series, setSeries] = useState<MetricRow[]>(emptySeries);
  const [topPosts, setTopPosts] = useState<Array<{ label: string; likes: number }>>([]);

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
          label: item.platform_post_id?.slice(0, 8) || `Post ${index + 1}`,
          likes: item.likes_count
        }));

      setTopPosts(top);
    };

    void load();
  }, []);

  const plugsFired = useMemo(() => series.reduce((sum, row) => sum + row.twitter + row.linkedin + row.bluesky, 0), [series]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--line)] bg-white p-4">
        <p className="text-sm text-slate-600">Total tracked engagement (7d)</p>
        <p className="text-2xl font-semibold">{plugsFired}</p>
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">Posts over time</h3>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="twitter" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="linkedin" stroke="#1d4ed8" strokeWidth={2} />
              <Line type="monotone" dataKey="bluesky" stroke="#14b8a6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--line)] bg-white p-4">
        <h3 className="mb-3 text-sm font-semibold">Top posts by likes</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topPosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="likes" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
