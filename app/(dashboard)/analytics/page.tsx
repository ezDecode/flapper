"use client";

import { Eye } from "lucide-react";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Eye size={24} className="text-primary" />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track engagement and auto-plug performance across platforms.
          </p>
        </div>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
