# FLAPR CODEBASE REVISION PLAN
## Twitter/X-Only Cleanup + Bug Fixes + Optimizations
### Agent-Executable. File-by-File. Zero Ambiguity.

---

## CONTEXT SUMMARY

**What this plan does:**
The codebase was partially migrated from a multi-platform (Twitter + LinkedIn + Bluesky) design to Twitter-only, but the job was left half-done. There are broken imports referencing non-existent shared files (`bluesky.ts`, `linkedin.ts`), UI components still showing LinkedIn OAuth, non-existent DB columns being queried, and a third-party design system (`@maximeheckel/design-system`) being used that isn't part of the declared stack.

**Current state:** The DB schema and Edge Function inputs are already correct (Twitter-only enums). The frontend and some edge function internals still have multi-platform dead code + several crash-causing bugs.

**Stack reminder:** Next.js 14 App Router + Tailwind + shadcn/ui | Supabase Edge Functions (Deno) | TypeScript strict mode | No `any` types.

---

## SEVERITY LEGEND

- 🔴 **CRITICAL** — Will cause runtime crash or import failure. Fix first.
- 🟡 **BUG** — Logic error, wrong behavior, or dead code that pollutes types.
- 🔵 **CLEANUP** — Remove multi-platform leftovers, dead imports, redundant code.
- 🟢 **OPTIMIZATION** — Performance, type-safety, or code quality improvements.

---

## SECTION 1 — EDGE FUNCTIONS (Deno / supabase/functions/)

### 1.1 — `supabase/functions/publish-post/index.ts`

**Issues:**
- 🔴 Imports `BlueskyService` from `"../_shared/bluesky.ts"` — **file does not exist**
- 🔴 Imports `LinkedInService` from `"../_shared/linkedin.ts"` — **file does not exist**
- 🔴 `publishToPlatform()` has return type `Promise<undefined>` for non-TWITTER platforms — calling code does `result.platformPostId` which **crashes with TypeError**
- 🔴 References `bluesky_cid` when updating `post_targets` — **column does not exist in DB schema**
- 🟡 `publishToPlatform` accepts `"TWITTER" | "LINKEDIN" | "BLUESKY"` as platform type — should be `"TWITTER"` only

**Changes to make:**

```typescript
// REMOVE these two lines at the top:
import { BlueskyService } from "../_shared/bluesky.ts";
import { LinkedInService } from "../_shared/linkedin.ts";

// CHANGE publishToPlatform signature from:
async function publishToPlatform(
  platform: "TWITTER" | "LINKEDIN" | "BLUESKY",
  ...
  currentTarget: {
    platform_post_id: string | null;
    bluesky_cid: string | null;  // REMOVE THIS FIELD
  }
)

// TO:
async function publishToPlatform(
  platform: "TWITTER",
  content: string,
  connection: { access_token: string; platform_handle: string }
): Promise<{ platformPostId: string; platformPostUrl: string }>

// REPLACE the function body with:
{
  const service = await TwitterService.fromEncrypted(connection.access_token);
  const result = await service.publishTweet(content);
  return { platformPostId: result.id, platformPostUrl: result.url };
}

// In processPost(), change the publishToPlatform call from:
const result = await publishToPlatform(platform, post.content, connection, target);
await admin.from("post_targets").update({
  platform_post_id: result.platformPostId,
  platform_post_url: result.platformPostUrl,
  bluesky_cid: result.blueskyCid,   // REMOVE THIS LINE
  published_at: new Date().toISOString(),
  fail_reason: null
}).eq("id", target.id);

// TO:
const result = await publishToPlatform(platform, post.content, connection);
await admin.from("post_targets").update({
  platform_post_id: result.platformPostId,
  platform_post_url: result.platformPostUrl,
  published_at: new Date().toISOString(),
  fail_reason: null
}).eq("id", target.id);
```

---

### 1.2 — `supabase/functions/poll-engagement/index.ts`

**Issues:**
- 🔴 Imports `BlueskyService` from `"../_shared/bluesky.ts"` — **file does not exist**
- 🔴 Imports `LinkedInService` from `"../_shared/linkedin.ts"` — **file does not exist**
- 🔴 `.select()` query includes `bluesky_cid` — **column does not exist in DB schema**, query will fail
- 🟡 `appendUtm` function type: `"TWITTER" | "LINKEDIN" | "BLUESKY"` → narrow to `"TWITTER"`
- 🟡 Two `// @ts-ignore` comments — can be removed after the join select is fixed

**Changes to make:**

```typescript
// REMOVE these two lines:
import { BlueskyService } from "../_shared/bluesky.ts";
import { LinkedInService } from "../_shared/linkedin.ts";

// CHANGE appendUtm signature from:
function appendUtm(content: string, platform: "TWITTER" | "LINKEDIN" | "BLUESKY")
// TO:
function appendUtm(content: string, platform: "TWITTER")

// In the Supabase query, CHANGE the post_targets select from:
post_targets!inner (
  id, platform_post_id, bluesky_cid,   // REMOVE bluesky_cid
  likes_count, comments_count, reposts_count
),
// TO:
post_targets!inner (
  id, platform_post_id,
  likes_count, comments_count, reposts_count
),

// REMOVE the two @ts-ignore comments — they are no longer needed once types align.
// The first one before 'if (!plugs || plugs.length === 0)':
// @ts-ignore: explicit check for empty array   <-- REMOVE
// The second one before 'for (const plug of plugs)':
// @ts-ignore: Supabase join types...           <-- REMOVE
// Instead add a proper type assertion or typed result handling.
```

---

### 1.3 — `supabase/functions/refresh-tokens/index.ts`

**Issues:**
- 🔴 Imports `LinkedInService` from `"../_shared/linkedin.ts"` — **file does not exist**
- 🟡 `sendExpiredNotice` has type `"TWITTER" | "LINKEDIN"` → narrow to `"TWITTER"`
- 🟡 Dead comment block mentioning undefined `error` variable (lines ~1372–1374) — remove

**Changes to make:**

```typescript
// REMOVE this line:
import { LinkedInService } from "../_shared/linkedin.ts";

// CHANGE sendExpiredNotice signature from:
async function sendExpiredNotice(userId: string, platform: "TWITTER" | "LINKEDIN")
// TO:
async function sendExpiredNotice(userId: string, platform: "TWITTER")

// REMOVE the dead comment block:
// The 'error' variable here seems to be undefined based on the provided snippet.
// Assuming it was meant to be 'refreshError' or removed.
// If (error) return err(error.message, 500); // This line is problematic without 'error' being defined.
// (These 3 comment lines serve no purpose — delete them)
```

---

## SECTION 2 — FRONTEND COMPONENTS (components/)

### 2.1 — `components/AuthModal.tsx`

**Issues:**
- 🔵 LinkedIn OAuth button is present — remove it entirely
- 🔵 `LinkedInIcon` import from `./ui/icons` — remove

**Changes to make:**

```typescript
// In the OAuth buttons section, REMOVE the entire LinkedIn button block:
<button
  type="button"
  onClick={() => oauth("linkedin_oidc")}
  className="..."
  style={{ backgroundColor: "#0077B5", color: "#ffffff" }}
>
  <LinkedInIcon className="mr-2 h-5 w-5" />
  Sign in with LinkedIn
</button>

// ALSO remove the LinkedInIcon import:
import { LinkedInIcon } from "@/components/ui/icons";  // REMOVE

// RESULT: The OAuth section should only have the Twitter button.
// Update the separator text if needed:
// "or sign in with email" — this is fine as-is.
```

---

### 2.2 — `components/AnalyticsDashboard.tsx`

**Issues:**
- 🔴 Imports `Card, Flex, Text` from `@maximeheckel/design-system` — **not in the declared stack, not a public npm package**
- 🔵 `MetricRow` type includes `linkedin` and `bluesky` fields — remove
- 🔵 `emptySeries` includes `linkedin: 0` and `bluesky: 0` — remove
- 🔵 Imports `Linkedin, Globe` from `lucide-react` — unused, remove
- 🟢 Chart should only render Twitter engagement data

**Changes to make:**

```typescript
// REMOVE this import entirely:
import { Card, Flex, Text } from "@maximeheckel/design-system";

// REMOVE unused icon imports:
import { Heart, Zap, Twitter, Linkedin, Globe } from "lucide-react";
// REPLACE WITH (only what's actually used):
import { Heart, Zap, Twitter } from "lucide-react";

// CHANGE MetricRow type from:
type MetricRow = {
  day: string;
  twitter: number;
  linkedin: number;
  bluesky: number;
};
// TO:
type MetricRow = {
  day: string;
  twitter: number;
};

// CHANGE emptySeries from:
const emptySeries = Array.from({ length: 7 }).map((_, index) => ({
  day: format(subDays(new Date(), 6 - index), "MMM d"),
  twitter: 0,
  linkedin: 0,
  bluesky: 0,
}));
// TO:
const emptySeries = Array.from({ length: 7 }).map((_, index) => ({
  day: format(subDays(new Date(), 6 - index), "MMM d"),
  twitter: 0,
}));

// Replace @maximeheckel/design-system usage with plain Tailwind divs.
// Example replacement pattern:
// <Card> → <div className="rounded-xl border border-[#27272B] bg-[#131316] p-5">
// <Flex> → <div className="flex ...">
// <Text> → <p className="..."> or <span className="...">
// Use the design system colors from lib/landing-data.ts (C palette) for consistency.
```

---

### 2.3 — `components/ui/icons.tsx`

**Issues:**
- 🔵 Exports `LinkedInIcon` and `BlueskyIcon` — no longer needed in the UI

**Changes to make:**

Remove the `LinkedInIcon` and `BlueskyIcon` component exports entirely:

```typescript
// DELETE these two components:
export const LinkedInIcon = ({ className }: IconProps) => (
  <Image src="/icons/linkedin.svg" ... />
);

export const BlueskyIcon = ({ className }: IconProps) => (
  <Image src="/icons/bluesky.svg" ... />
);
```

> **Note:** Also delete the corresponding SVG files from the `public/icons/` directory if present: `public/icons/linkedin.svg` and `public/icons/bluesky.svg`.

---

## SECTION 3 — APP PAGES (app/)

### 3.1 — `app/onboarding/page.tsx`

**Issues:**
- 🔴 Imports `Button, Card, Flex, H1, H2, Pill, Text` from `@maximeheckel/design-system` — **not in declared stack**
- 🔵 Imports `Linkedin, Globe` icons — unused (platformOptions is already Twitter-only)
- 🟢 Already correctly limits `platformOptions: Platform[] = ["TWITTER"]` — ✅ no change needed there

**Changes to make:**

```typescript
// REMOVE this import entirely:
import { Button, Card, Flex, H1, H2, Pill, Text } from "@maximeheckel/design-system";

// REMOVE unused icon imports:
import { Twitter, Linkedin, Globe, Send, Zap, Check, ChevronDown, Heart, Sparkles } from "lucide-react";
// REPLACE WITH only what's actually used:
import { Twitter, Send, Zap, Check, ChevronDown, Heart, Sparkles } from "lucide-react";

// Replace @maximeheckel/design-system components with Tailwind + shadcn/ui equivalents:
// <Button>      → import { Button } from "@/components/ui/button" (shadcn)
// <Card>        → import { Card } from "@/components/ui/card" (shadcn)
// <H1>, <H2>    → <h1 className="text-3xl font-semibold tracking-tight">, <h2 ...>
// <Text>        → <p className="text-sm text-[#A1A1AA]">
// <Flex>        → <div className="flex ...">
// <Pill>        → <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6]">
```

---

## SECTION 4 — LIB / UTILITIES

### 4.1 — `lib/utils.ts` + `lib/utils/colorUtils.ts`

**Issues:**
- 🔵 Both files export an identical `cn` function (duplicate code)
- 🟡 `colorUtils.ts` should import `cn` from `lib/utils.ts` rather than re-declaring it

**Changes to make:**

In `lib/utils/colorUtils.ts`, remove the duplicated `cn` function and add an import:

```typescript
// REMOVE these lines from colorUtils.ts:
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// ADD this import at the top instead (if cn is used anywhere in colorUtils):
export { cn } from "@/lib/utils";
// Or simply remove the export if cn isn't used within colorUtils itself.
```

---

### 4.2 — `lib/constants.ts`

**Issues:**
- 🔵 `PLAN_LIMITS` includes `platforms` key (e.g. `FREE: { posts: 10, plugs: 5, platforms: 2 }`) — meaningless with a single platform

**Changes to make:**

```typescript
// CHANGE PLAN_LIMITS from:
export const PLAN_LIMITS = {
  FREE:   { posts: 10,                        plugs: 5,                        platforms: 2 },
  PRO:    { posts: 100,                       plugs: 50,                       platforms: 3 },
  AGENCY: { posts: Number.POSITIVE_INFINITY,  plugs: Number.POSITIVE_INFINITY, platforms: 3 }
} as const;

// TO (remove the platforms key entirely):
export const PLAN_LIMITS = {
  FREE:   { posts: 10,                       plugs: 5 },
  PRO:    { posts: 100,                      plugs: 50 },
  AGENCY: { posts: Number.POSITIVE_INFINITY, plugs: Number.POSITIVE_INFINITY }
} as const;
```

---

### 4.3 — `lib/landing-data.ts`

**Issues:**
- 🔵 "Multi-Platform Sync" feature card mentions multiple platforms — update to be Twitter-focused
- 🔵 Plan cards mention "2 platforms" / "All platforms" — update to be accurate
- 🟢 FAQ already says "Twitter/X. More coming soon." — ✅ no change needed

**Changes to make:**

```typescript
// CHANGE the "Multi-Platform Sync" feature from:
{
  icon: Shield,
  title: "Multi-Platform Sync",
  desc: "One dashboard for every platform. Manage all your content and auto-plugs from a single place.",
  className: "md:col-span-3",
},
// TO:
{
  icon: Shield,
  title: "Built for Twitter/X",
  desc: "Deep Twitter/X integration — tweets, threads, reply chains, and real-time engagement metrics. More platforms coming soon.",
  className: "md:col-span-3",
},

// CHANGE plan features that mention platform counts:
// FREE plan: remove "2 platforms" line (or change to "Twitter/X")
// PRO plan: change "All platforms" to "Twitter/X + upcoming platforms"
// AGENCY plan: change "All platforms" to "Twitter/X + upcoming platforms"

// Specific changes in the plans array:
// FREE features: replace "2 platforms" with "Twitter / X"
// PRO features: replace "All platforms" with "Twitter/X (+ more coming)"
// AGENCY features: same as PRO
```

---

## SECTION 5 — DATABASE SCHEMA (supabase/migrations/)

### 5.1 — `post_targets` table

**Issues:**
- 🔴 `publish-post` and `poll-engagement` edge functions reference a `bluesky_cid` column that **does not exist** in `20240216130001_core_schema.sql`
- These columns were clearly planned but never added to the migration

**Verification step:** Confirm `post_targets` schema in migration file. The current definition is:
```sql
CREATE TABLE public.post_targets (
  id                TEXT, post_id TEXT, platform platform_type,
  platform_post_id  TEXT, platform_post_url TEXT,
  likes_count INTEGER, comments_count INTEGER, reposts_count INTEGER,
  last_polled_at TIMESTAMPTZ, published_at TIMESTAMPTZ, fail_reason TEXT
  -- NO bluesky_cid column
);
```

**Action:** No DB change needed. The fix is in the Edge Functions (already covered in Sections 1.1 and 1.2 above) — remove all `bluesky_cid` references from the TS code.

---

## SECTION 6 — SHARED TYPES (`supabase/functions/_shared/database.types.ts`)

**Issues:**
- 🟢 Already correctly typed as `"TWITTER"` only throughout — ✅ no changes needed
- The `platform_type` enum is `"TWITTER"` only — matches the DB schema perfectly

**Verification:** Confirm all `platform` field types in `database.types.ts` are:
- `platform_connections.Row.platform: "TWITTER"` ✅
- `post_targets.Row.platform: "TWITTER"` ✅
- `auto_plugs.Row.platform: "TWITTER"` ✅
- `api_rate_tracking.Row.platform: "TWITTER"` ✅

No changes needed here.

---

## SECTION 7 — IMPLEMENTATION ORDER

Execute changes in this exact sequence to avoid breaking dependencies:

```
PHASE 1 — CRITICAL CRASH FIXES (do these first, test immediately after)
  1. supabase/functions/publish-post/index.ts       (Sections 1.1)
  2. supabase/functions/poll-engagement/index.ts    (Section 1.2)
  3. supabase/functions/refresh-tokens/index.ts     (Section 1.3)

PHASE 2 — FRONTEND PLATFORM CLEANUP
  4. components/AuthModal.tsx                       (Section 2.1)
  5. components/ui/icons.tsx                        (Section 2.3)
  6. components/AnalyticsDashboard.tsx              (Section 2.2)
  7. app/onboarding/page.tsx                        (Section 3.1)

PHASE 3 — LIB / CONSTANTS CLEANUP
  8. lib/constants.ts                               (Section 4.2)
  9. lib/utils/colorUtils.ts                        (Section 4.1)
  10. lib/landing-data.ts                           (Section 4.3)

PHASE 4 — VERIFICATION
  11. Run TypeScript check: npm run typecheck
  12. Verify no remaining references to LinkedIn or Bluesky
  13. Verify no remaining @maximeheckel/design-system imports
```

---

## SECTION 8 — GREP CHECKLIST (run these after all edits)

Run these searches in the codebase root to verify cleanup is complete. Each should return **zero results**:

```bash
# Non-existent import files
grep -r "bluesky.ts" --include="*.ts" supabase/
grep -r "linkedin.ts" --include="*.ts" supabase/

# LinkedIn/Bluesky remnants in frontend
grep -r "linkedin_oidc" --include="*.tsx"
grep -r "LinkedInIcon\|BlueskyIcon" --include="*.tsx"
grep -r "LINKEDIN\|BLUESKY" --include="*.ts" --include="*.tsx" supabase/
grep -r "@maximeheckel/design-system" --include="*.tsx"

# Non-existent DB column
grep -r "bluesky_cid" --include="*.ts"

# Duplicate cn function
grep -r "export function cn" --include="*.ts" --include="*.tsx"
# Should return exactly 1 result (lib/utils.ts only)
```

---

## SECTION 9 — FILES NOT NEEDING CHANGES (verified clean)

These files are already correctly Twitter-only and need no edits:

| File | Status |
|---|---|
| `middleware.ts` | ✅ No platform references |
| `supabase/functions/platform-connect/index.ts` | ✅ Already rejects non-TWITTER with error |
| `supabase/functions/send-email/index.ts` | ✅ Platform-agnostic |
| `supabase/functions/_shared/cors.ts` | ✅ Platform-agnostic |
| `supabase/functions/_shared/token-crypto.ts` | ✅ Platform-agnostic |
| `supabase/functions/_shared/twitter.ts` | ✅ Twitter-only |
| `supabase/functions/_shared/usage.ts` | ✅ Uses `"TWITTER"` type only |
| `supabase/functions/_shared/validators.ts` | ✅ TWITTER-only in limits map |
| `supabase/functions/_shared/database.types.ts` | ✅ All platform fields are `"TWITTER"` |
| `supabase/migrations/20240216130001_core_schema.sql` | ✅ `platform_type ENUM ('TWITTER')` |
| `lib/supabase/client.ts` | ✅ No platform references |
| `lib/supabase/server.ts` | ✅ No platform references |
| `lib/supabase/middleware.ts` | ✅ No platform references |
| `app/(auth)/login/page.tsx` | ✅ No platform-specific code |
| `app/(auth)/register/page.tsx` | ✅ No platform-specific code |
| `app/auth/callback/route.ts` | ✅ OAuth callback handler |
| `components/PostComposer.tsx` | ✅ Verify uses `PLATFORM_CHAR_LIMITS.TWITTER` |
| `components/AutoPlugConfig.tsx` | ✅ Verify no multi-platform logic |
| `components/PlatformConnector.tsx` | ✅ Verify Twitter-only connect flow |
| `components/PostPreview.tsx` | ✅ Verify no LinkedIn/Bluesky preview |
| `components/ScheduleCalendar.tsx` | ✅ No platform-specific rendering |

> **Note:** The files marked with "Verify" should be spot-checked to confirm they don't have multi-platform logic that was missed in the truncated view of the codebase.

---

## SECTION 10 — QUICK BUG SUMMARY TABLE

| # | File | Type | Issue | Fix |
|---|---|---|---|---|
| 1 | `publish-post/index.ts` | 🔴 CRITICAL | Imports non-existent `bluesky.ts` + `linkedin.ts` | Remove imports |
| 2 | `publish-post/index.ts` | 🔴 CRITICAL | `result.platformPostId` crashes when `publishToPlatform` returns `undefined` | Fix return type, always return value |
| 3 | `publish-post/index.ts` | 🔴 CRITICAL | Updates `bluesky_cid` column that doesn't exist in DB | Remove that field from the update |
| 4 | `poll-engagement/index.ts` | 🔴 CRITICAL | Imports non-existent `bluesky.ts` + `linkedin.ts` | Remove imports |
| 5 | `poll-engagement/index.ts` | 🔴 CRITICAL | Selects `bluesky_cid` column that doesn't exist in DB | Remove from select query |
| 6 | `refresh-tokens/index.ts` | 🔴 CRITICAL | Imports non-existent `linkedin.ts` | Remove import |
| 7 | `components/AnalyticsDashboard.tsx` | 🔴 CRITICAL | Imports `@maximeheckel/design-system` (not in stack) | Replace with Tailwind + shadcn/ui |
| 8 | `app/onboarding/page.tsx` | 🔴 CRITICAL | Imports `@maximeheckel/design-system` (not in stack) | Replace with Tailwind + shadcn/ui |
| 9 | `components/AuthModal.tsx` | 🔵 CLEANUP | LinkedIn OAuth button visible to users | Remove the button |
| 10 | `components/ui/icons.tsx` | 🔵 CLEANUP | Exports unused LinkedIn/Bluesky icons | Remove exports |
| 11 | `lib/utils/colorUtils.ts` | 🟡 BUG | Duplicate `cn` function | Remove duplicate, re-export from `lib/utils.ts` |
| 12 | `lib/constants.ts` | 🟡 BUG | `platforms` key in `PLAN_LIMITS` is meaningless | Remove the key |
| 13 | `lib/landing-data.ts` | 🔵 CLEANUP | Feature copy mentions multi-platform | Update to Twitter-focused copy |
| 14 | `refresh-tokens/index.ts` | 🟡 BUG | Dead comment block about undefined `error` var | Remove the comment |

---

*Total: 6 crash-level bugs, 3 logic/type bugs, 5 cleanup items.*
*All are straightforward edits — no architectural changes required.*
