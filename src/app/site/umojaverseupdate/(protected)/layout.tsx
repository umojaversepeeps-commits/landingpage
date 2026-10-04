import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UmojaverseUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="container admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow"><span className="accent-square" /> Umojaverse</p>
          <h1>Update dashboard</h1>
          <p className="quiet-label">Signed in as {user.email}</p>
        </div>
        <nav className="admin-nav" aria-label="Update dashboard navigation">
          <Link href="/site/umojaverseupdate">Overview</Link>
          <Link href="/admin/programs">Programs</Link>
          <Link href="/admin/posts">Posts</Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">View site ↗</Link>
          <form action={signOut}>
            <button type="submit" className="text-link">Sign out</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
