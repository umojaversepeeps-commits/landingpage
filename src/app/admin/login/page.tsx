import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Eyebrow } from "@/components/ui";
import { adminReturnPath, getAdminUser } from "@/lib/auth";
import { adminEmails, isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Admin sign in" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const { next, reset } = await searchParams;
  const returnPath = adminReturnPath(next);
  const user = await getAdminUser();
  if (user && reset !== "success") redirect(returnPath);
  const configured = isSupabaseConfigured();
  const hasAdmins = adminEmails().length > 0;

  return (
    <section className="container admin-login">
      <Eyebrow>Admin</Eyebrow>
      <h1>Sign in to manage content</h1>
      {reset === "success" && (
        <p role="status" className="admin-notice">
          Password updated. Sign in with your new password.
        </p>
      )}
      {configured && hasAdmins ? (
        <>
          <p className="intro-copy">
            Use the administrator account you created in Supabase.
          </p>
          <LoginForm next={returnPath} />
        </>
      ) : configured ? (
        <div className="admin-notice">
          <h2>Administrator access is not configured yet</h2>
          <p>
            Add the administrator email addresses to <code>ADMIN_EMAILS</code>
            in the deployment environment before signing in.
          </p>
        </div>
      ) : (
        <div className="admin-notice">
          <h2>Supabase is not connected yet</h2>
          <p>
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> to your environment, and set
            <code> ADMIN_EMAILS</code> to the administrator email addresses. Then run
            the SQL in <code>supabase/schema.sql</code> and create an admin user
            in Supabase Authentication.
          </p>
        </div>
      )}
    </section>
  );
}
