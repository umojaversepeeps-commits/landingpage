import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

const RECOVERY_COOKIE = "uv-admin-recovery";
const RECOVERY_PATH = "/admin/reset-password";
const RECOVERY_MAX_AGE = 15 * 60;

function isRecoveryCookie(name: string): boolean {
  return name === RECOVERY_COOKIE || /^uv-admin-recovery\.\d+$/.test(name);
}

function recoveryCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: RECOVERY_PATH,
    maxAge,
  };
}

/** An isolated session used only to finish an administrator password reset. */
export async function createSupabaseRecoveryClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookieOptions: {
      name: RECOVERY_COOKIE,
      ...recoveryCookieOptions(RECOVERY_MAX_AGE),
    },
    cookies: {
      getAll() {
        return cookieStore.getAll().filter(({ name }) => isRecoveryCookie(name));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          if (!isRecoveryCookie(name)) continue;
          // SSR supplies its own long-lived maxAge, so enforce our limit here.
          cookieStore.set(
            name,
            value,
            recoveryCookieOptions(options.maxAge === 0 ? 0 : RECOVERY_MAX_AGE),
          );
        }
      },
    },
  });
}

/** Clear only the recovery session, including any chunks written by SSR. */
export async function clearRecoveryCookies(): Promise<void> {
  const cookieStore = await cookies();
  const names = new Set([
    RECOVERY_COOKIE,
    ...cookieStore.getAll().map(({ name }) => name).filter(isRecoveryCookie),
  ]);
  for (const name of names) {
    cookieStore.set(name, "", recoveryCookieOptions(0));
  }
}
