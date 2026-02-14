"use client";

import { useMemo, useState } from "react";
import { AutoPlugConfig } from "./AutoPlugConfig";
import { PLATFORM_CHAR_LIMITS } from "@/lib/constants";

type Platform = keyof typeof PLATFORM_CHAR_LIMITS;

export function PostComposer() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

  const contentLength = content.length;
  const selectedLimits = useMemo(
    () => selectedPlatforms.map((platform) => `${platform}: ${PLATFORM_CHAR_LIMITS[platform]}`),
    [selectedPlatforms]
  );

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((item) => item !== platform) : [...prev, platform]
    );
  };

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 800 }}>
      <label style={{ display: "grid", gap: "0.5rem" }}>
        Post Content
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={6}
          placeholder="Write your post..."
        />
      </label>

      <div>
        <strong>Connected Platforms</strong>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          {(Object.keys(PLATFORM_CHAR_LIMITS) as Platform[]).map((platform) => (
            <label key={platform} style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
              />
              {platform}
            </label>
          ))}
        </div>
      </div>

      <p>
        Current length: {contentLength} chars
        {selectedLimits.length > 0 ? ` | Limits: ${selectedLimits.join(", ")}` : ""}
      </p>

      <AutoPlugConfig selectedPlatforms={selectedPlatforms} />
    </div>
  );
}

