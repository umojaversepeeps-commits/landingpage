"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminReturnPath, getAdminUser } from "@/lib/auth";
import { slugify } from "@/lib/content-types";
import {
  adminEmails,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export type ActionState = { error?: string; message?: string } | undefined;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullable(value: string): string | null {
  return value ? value : null;
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function tags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured yet. Add the environment variables before signing in.",
    };
  }
  const allow = adminEmails();
  if (!allow.length) {
    return { error: "Administrator access has not been configured yet." };
  }
  const email = text(formData, "email");
  const passwordValue = formData.get("password");
  const password = typeof passwordValue === "string" ? passwordValue : "";
  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return { error: "That email or password was not recognised." };
  }

  if (!data.user.email || !allow.includes(data.user.email.toLowerCase())) {
    await supabase.auth.signOut();
    return { error: "This account is not allowed to manage the site." };
  }

  redirect(adminReturnPath(formData.get("next")));
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // A failed auth service request must not expose dashboard content.
    }
  }
  redirect("/admin/login");
}

async function requireWriter(): Promise<string | null> {
  const user = await getAdminUser();
  if (!user) return "You need to sign in again.";
  if (!isSupabaseAdminConfigured()) {
    return "Supabase is not fully configured (missing service role key).";
  }
  return null;
}

// ---------------------------------------------------------------------------
// Programs
// ---------------------------------------------------------------------------
export async function saveProgram(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireWriter();
  if (denied) return { error: denied };

  const id = text(formData, "id");
  const title = text(formData, "title");
  if (!title) return { error: "A title is required." };

  const slug = slugify(text(formData, "slug") || title);
  if (!slug) return { error: "Could not build a URL slug from that title." };

  const payload = {
    title,
    slug,
    category: text(formData, "category") || "Campus tour",
    location: text(formData, "location"),
    period: text(formData, "period"),
    start_date: nullable(text(formData, "startDate")),
    end_date: nullable(text(formData, "endDate")),
    description: text(formData, "description"),
    overview: text(formData, "overview"),
    body: text(formData, "body"),
    highlights: lines(text(formData, "highlights")),
    cover_image_url: nullable(text(formData, "coverImageUrl")),
    video_url: nullable(text(formData, "videoUrl")),
    source: nullable(text(formData, "source")),
    source_label: nullable(text(formData, "sourceLabel")),
    published: formData.get("published") === "on",
  };

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = id
      ? await supabase.from("programs").update(payload).eq("id", id)
      : await supabase.from("programs").insert(payload);
    if (error) {
      if (error.code === "23505") {
        return { error: "A program with that slug already exists." };
      }
      return { error: error.message };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Save failed." };
  }

  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath(`/programs/${slug}`);
  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function deleteProgram(formData: FormData): Promise<void> {
  const denied = await requireWriter();
  if (denied) throw new Error(denied);
  const id = text(formData, "id");
  if (id) {
    const supabase = createSupabaseAdminClient();
    await supabase.from("programs").delete().eq("id", id);
  }
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------
export async function savePost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const denied = await requireWriter();
  if (denied) return { error: denied };

  const id = text(formData, "id");
  const title = text(formData, "title");
  if (!title) return { error: "A title is required." };

  const slug = slugify(text(formData, "slug") || title);
  if (!slug) return { error: "Could not build a URL slug from that title." };

  const published = formData.get("published") === "on";
  const publishedAt = text(formData, "publishedAt");

  const payload = {
    title,
    slug,
    excerpt: text(formData, "excerpt"),
    body: text(formData, "body"),
    cover_image_url: nullable(text(formData, "coverImageUrl")),
    video_url: nullable(text(formData, "videoUrl")),
    author: text(formData, "author") || "Umojaverse",
    tags: tags(text(formData, "tags")),
    published,
    published_at: publishedAt
      ? new Date(publishedAt).toISOString()
      : new Date().toISOString(),
  };

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = id
      ? await supabase.from("posts").update(payload).eq("id", id)
      : await supabase.from("posts").insert(payload);
    if (error) {
      if (error.code === "23505") {
        return { error: "A post with that slug already exists." };
      }
      return { error: error.message };
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Save failed." };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData): Promise<void> {
  const denied = await requireWriter();
  if (denied) throw new Error(denied);
  const id = text(formData, "id");
  if (id) {
    const supabase = createSupabaseAdminClient();
    await supabase.from("posts").delete().eq("id", id);
  }
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// ---------------------------------------------------------------------------
// Media uploads
// ---------------------------------------------------------------------------
export async function uploadMedia(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const denied = await requireWriter();
  if (denied) return { error: denied };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image uploads are supported." };
  }
  if (file.size > 4 * 1024 * 1024) {
    return { error: "Images must be 4MB or smaller." };
  }

  const folder = text(formData, "folder") || "general";
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]+/g, "-").toLowerCase();
  const path = `${folder}/${Date.now()}-${safeName}`;

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) return { error: error.message };
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload failed." };
  }
}
