import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { adminEmails, isSupabaseConfigured } from "./supabase/config";
import { createSupabaseServerClient } from "./supabase/server";

export type AdminUser = { id: string; email: string };

/** The signed-in admin, or null when unauthenticated or not on the allowlist. */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return null;
    const allow = adminEmails();
    if (!allow.includes(user.email.toLowerCase())) return null;
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
});

/** Redirect to the login page when there is no valid admin session. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Keep login return URLs inside the content dashboard. */
export function adminReturnPath(value: unknown): string {
  if (typeof value !== "string" || /[\\\u0000-\u001f\u007f]/.test(value)) {
    return "/admin";
  }
  try {
    const base = "https://umojaverse.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return "/admin";
    if (
      url.pathname === "/admin" ||
      /^\/admin\/(programs|posts)(\/|$)/.test(url.pathname) ||
      url.pathname === "/site/umojaverseupdate"
    ) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    // Invalid return URLs go to the dashboard overview.
  }
  return "/admin";
}
