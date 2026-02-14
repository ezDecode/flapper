"use client";

import { useState } from "react";
import { PLATFORM_CHAR_LIMITS } from "@/lib/constants";

type Platform = keyof typeof PLATFORM_CHAR_LIMITS;

interface AutoPlugConfigProps {
  selectedPlatforms: Platform[];
}

export function AutoPlugConfig({ selectedPlatforms }: AutoPlugConfigProps) {
  const [plugContent, setPlugContent] = useState("");
  const remaining = 280 - plugContent.length;

  if (selectedPlatforms.length === 0) {
    return <p>Select at least one platform to configure auto-plugs.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "1rem", border: "1px solid #e2e8f0", padding: "1rem", borderRadius: 8 }}>
      <h3>Auto-Plug Configuration</h3>
      {selectedPlatforms.map((platform) => (
        <div key={platform} style={{ display: "grid", gap: "0.5rem", padding: "0.75rem", background: "#fff" }}>
          <strong>{platform}</strong>
          <textarea
            value={plugContent}
            onChange={(event) => setPlugContent(event.target.value)}
            maxLength={280}
            placeholder="Add plug reply/comment"
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select defaultValue="LIKES">
              <option value="LIKES">Likes</option>
              <option value="COMMENTS">Comments</option>
              <option value="REPOSTS">Reposts</option>
            </select>
            <input type="number" min={1} defaultValue={100} />
          </div>
          <small>{remaining} characters remaining</small>
        </div>
      ))}
    </div>
  );
}

