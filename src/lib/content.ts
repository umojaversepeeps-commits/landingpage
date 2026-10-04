import "server-only";
import { requireAdmin } from "./auth";
import {
  type Post,
  type Program,
  sortPrograms,
} from "./content-types";
import { seedPosts, seedPrograms } from "./site";
import {
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "./supabase/config";
import {
  createSupabaseAdminClient,
  createSupabasePublicClient,
} from "./supabase/server";

type ProgramRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  period: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
  overview: string;
  body: string;
  highlights: string[] | null;
  cover_image_url: string | null;
  video_url: string | null;
  source: string | null;
  source_label: string | null;
  published: boolean;
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  video_url: string | null;
  author: string;
  tags: string[] | null;
  published: boolean;
  published_at: string | null;
};

function toProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    location: row.location ?? "",
    period: row.period ?? "",
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description ?? "",
    overview: row.overview ?? "",
    body: row.body ?? "",
    highlights: row.highlights ?? [],
    coverImageUrl: row.cover_image_url,
    videoUrl: row.video_url,
    source: row.source,
    sourceLabel: row.source_label,
    published: row.published,
  };
}

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    body: row.body ?? "",
    coverImageUrl: row.cover_image_url,
    videoUrl: row.video_url,
    author: row.author ?? "Umojaverse",
    tags: row.tags ?? [],
    published: row.published,
    publishedAt: row.published_at,
  };
}

function clientFor(includeUnpublished: boolean) {
  if (includeUnpublished && isSupabaseAdminConfigured()) {
    return createSupabaseAdminClient();
  }
  return createSupabasePublicClient();
}

/** All programs, sorted active → upcoming → past. Falls back to seed data. */
export async function getPrograms(
  options: { includeUnpublished?: boolean } = {},
): Promise<Program[]> {
  const { includeUnpublished = false } = options;
  if (includeUnpublished) await requireAdmin();
  const fallback = seedPrograms.filter((program) => includeUnpublished || program.published);
  if (!isSupabaseConfigured()) {
    return sortPrograms(fallback);
  }
  try {
    let query = clientFor(includeUnpublished)
      .from("programs")
      .select("*")
      .order("start_date", { ascending: true, nullsFirst: false });
    if (!includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query;
    if (error) throw error;
    return sortPrograms((data as ProgramRow[]).map(toProgram));
  } catch {
    return sortPrograms(fallback);
  }
}

export async function getProgram(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<Program | null> {
  const { includeUnpublished = false } = options;
  if (includeUnpublished) await requireAdmin();
  const fallback = seedPrograms.find(
    (program) => program.slug === slug && (includeUnpublished || program.published),
  ) ?? null;
  if (!isSupabaseConfigured()) {
    return fallback;
  }
  try {
    let query = clientFor(includeUnpublished)
      .from("programs")
      .select("*")
      .eq("slug", slug);
    if (!includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data ? toProgram(data as ProgramRow) : null;
  } catch {
    return fallback;
  }
}

/** All posts, newest first. Falls back to seed data. */
export async function getPosts(
  options: { includeUnpublished?: boolean } = {},
): Promise<Post[]> {
  const { includeUnpublished = false } = options;
  if (includeUnpublished) await requireAdmin();
  const fallback = seedPosts.filter((post) => includeUnpublished || post.published);
  if (!isSupabaseConfigured()) {
    return fallback.sort(byPublishedAt);
  }
  try {
    let query = clientFor(includeUnpublished)
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (!includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as PostRow[]).map(toPost).sort(byPublishedAt);
  } catch {
    return fallback.sort(byPublishedAt);
  }
}

export async function getPost(
  slug: string,
  options: { includeUnpublished?: boolean } = {},
): Promise<Post | null> {
  const { includeUnpublished = false } = options;
  if (includeUnpublished) await requireAdmin();
  const fallback = seedPosts.find(
    (post) => post.slug === slug && (includeUnpublished || post.published),
  ) ?? null;
  if (!isSupabaseConfigured()) {
    return fallback;
  }
  try {
    let query = clientFor(includeUnpublished)
      .from("posts")
      .select("*")
      .eq("slug", slug);
    if (!includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return data ? toPost(data as PostRow) : null;
  } catch {
    return fallback;
  }
}

function byPublishedAt(a: Post, b: Post): number {
  const at = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const bt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
  return bt - at;
}
