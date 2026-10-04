import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/admin/reset-password-form";
import { Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reset administrator password",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function ResetPasswordPage() {
  return (
    <section className="container admin-login">
      <Eyebrow>Admin</Eyebrow>
      <h1>Set a new password</h1>
      <p className="intro-copy">
        Open this page using your private reset link, then choose a new password.
        You’ll return to sign-in when it’s saved.
      </p>
      <ResetPasswordForm />
      <p className="field-help">
        If your link has expired or was already used, request a new link from
        the site administrator.
      </p>
      <Link href="/admin/login" className="text-link">Back to sign in</Link>
    </section>
  );
}
