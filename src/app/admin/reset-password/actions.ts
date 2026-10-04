"use server";

import { redirect } from "next/navigation";
import { adminEmails, isSupabaseConfigured } from "@/lib/supabase/config";
import {
  clearRecoveryCookies,
  createSupabaseRecoveryClient,
} from "@/lib/supabase/recovery";

export type ResetPasswordState =
  | { error?: string; tokenConsumed?: boolean }
  | undefined;

const INVALID_LINK =
  "This reset link is invalid or has expired. Request a new reset link.";
const UPDATE_FAILED = "We could not update your password. Please try again.";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function resetPassword(
  previous: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  let tokenConsumed = previous?.tokenConsumed === true;
  const password = field(formData, "password");
  const confirmation = field(formData, "confirmPassword");
  const tokenHash = field(formData, "tokenHash").trim();

  // Keep the one-time link usable when the submitted password needs correction.
  if (password.length < 12 || password.length > 128) {
    return { error: "Use a password between 12 and 128 characters.", tokenConsumed };
  }
  if (password !== confirmation) {
    return { error: "The passwords do not match.", tokenConsumed };
  }
  const allowedEmails = adminEmails();
  if (!isSupabaseConfigured() || allowedEmails.length === 0) {
    return { error: INVALID_LINK, tokenConsumed };
  }

  let supabase: Awaited<ReturnType<typeof createSupabaseRecoveryClient>>;
  try {
    supabase = await createSupabaseRecoveryClient();
    let user;
    if (tokenHash) {
      const { data, error } = await supabase.auth.verifyOtp({
        type: "recovery",
        token_hash: tokenHash,
      });
      if (error || !data.user || !data.session) {
        await clearRecoveryCookies();
        return { error: INVALID_LINK, tokenConsumed: false };
      }
      user = data.user;
    } else {
      // A consumed link can retry using only the scoped recovery cookie.
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        await clearRecoveryCookies();
        return { error: INVALID_LINK, tokenConsumed };
      }
      user = data.user;
    }
    tokenConsumed = true;
    if (!user.email || !allowedEmails.includes(user.email.toLowerCase())) {
      await clearRecoveryCookies();
      return { error: INVALID_LINK, tokenConsumed };
    }

    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      const message =
        error.code === "same_password"
          ? "Choose a password different from your current password."
          : error.code === "weak_password"
            ? "Choose a stronger password that meets the account password requirements."
            : UPDATE_FAILED;
      return { error: message, tokenConsumed };
    }
    if (!data.user) return { error: UPDATE_FAILED, tokenConsumed };
  } catch {
    return { error: tokenConsumed ? UPDATE_FAILED : INVALID_LINK, tokenConsumed };
  }

  // The password has already changed. A sign-out failure must not report that
  // the update failed or invite another use of the consumed recovery link.
  try {
    await supabase.auth.signOut({ scope: "global" });
  } catch {
    // Still remove the recovery session from this browser.
  }
  await clearRecoveryCookies();
  redirect("/admin/login?reset=success");
}
