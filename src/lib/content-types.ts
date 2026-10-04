// Shared content types and pure helpers. Safe to import from client components.

export type ProgramStatus = "active" | "upcoming" | "past";

export type Program = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  period: string;
  /** ISO date string (YYYY-MM-DD) or null. */
  startDate: string | null;
  /** ISO date string (YYYY-MM-DD) or null. */
  endDate: string | null;
  description: string;
  overview: string;
  /** Longer markdown body shown on the detail page. */
  body: string;
  highlights: string[];
  coverImageUrl: string | null;
  videoUrl: string | null;
  source: string | null;
  sourceLabel: string | null;
  published: boolean;
};

export type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown body. */
  body: string;
  coverImageUrl: string | null;
  videoUrl: string | null;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
};

export const programStatusLabels: Record<ProgramStatus, string> = {
  active: "Active",
  upcoming: "Upcoming",
  past: "Past event",
};

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/**
 * Derive a program's status from its dates.
 * - `upcoming`: starts in the future
 * - `past`: ended before today
 * - `active`: everything else (ongoing, single-day today, or undated)
 */
export function programStatus(
  program: Pick<Program, "startDate" | "endDate">,
  now: Date = new Date(),
): ProgramStatus {
  const start = program.startDate ? new Date(program.startDate) : null;
  const end = program.endDate ? new Date(program.endDate) : start;

  if (start && start.getTime() > now.getTime()) return "upcoming";
  if (end && endOfDay(end).getTime() < now.getTime()) return "past";
  return "active";
}

/** Date used for ordering: prefer the start date, then the end date, then published. */
function programTime(program: Program): number {
  const value = program.startDate || program.endDate;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
}

/**
 * Order for display: active first, then upcoming (soonest first),
 * then past (most recent first).
 */
export function sortPrograms(programs: Program[], now: Date = new Date()): Program[] {
  const weight: Record<ProgramStatus, number> = { active: 0, upcoming: 1, past: 2 };
  return [...programs].sort((a, b) => {
    const statusA = programStatus(a, now);
    const statusB = programStatus(b, now);
    if (weight[statusA] !== weight[statusB]) return weight[statusA] - weight[statusB];
    const diff = programTime(a) - programTime(b);
    return statusA === "past" ? -diff : diff;
  });
}

/** Turn an arbitrary title into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
