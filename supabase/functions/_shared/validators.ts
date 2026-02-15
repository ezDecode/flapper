type Platform = "TWITTER" | "LINKEDIN" | "BLUESKY";

const limits: Record<Platform, number> = {
  TWITTER: 280,
  LINKEDIN: 3000,
  BLUESKY: 300
};

export function validatePostContent(content: string, platform: Platform) {
  const errors: string[] = [];
  const trimmed = content.trim();

  if (!trimmed) {
    errors.push("Content is required.");
  }

  const limit = limits[platform];
  if (trimmed.length > limit) {
    errors.push(`${platform} content exceeds ${limit} characters.`);
  }

  return { valid: errors.length === 0, errors };
}
