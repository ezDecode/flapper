"use client";

import { Send } from "lucide-react";
import { PostComposer } from "@/components/PostComposer";

export default function ComposePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Send size={24} className="text-[#00AA45]" />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#000000]">Compose</h1>
          <p className="text-sm text-[#6B6B6B]">
            Draft, schedule, and configure Auto-Plugs across platforms.
          </p>
        </div>
      </div>
      <PostComposer />
    </div>
  );
}
