import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getPosts, getPrograms } from "@/lib/content";
import { programStatus, programStatusLabels } from "@/lib/content-types";

export const dynamic = "force-dynamic";

async function getViews() {
  const [programs, posts] = await Promise.all([getPrograms({ includeUnpublished: true }), getPosts({ includeUnpublished: true })]);
  return {
    programs: programs.map((p) => ({ ...p, status: programStatus(p) })),
    posts,
  };
}

export default async function AdminUpdate() {
  await requireAdmin();
  const views = await getViews();

  return (
    <>
      <div className="admin-prose admin-prose--wide">
        <section className="admin-section">
          <h2>Edit at a glance</h2>
          <p className="field-help">
            Use the links below to open each editor.
            The programs list includes the <strong>status badge</strong> your dates control,
            and the post list links straight to the draft editor.
          </p>

          <div className="admin-panels admin-panels--2">
            <div className="admin-panel">
              <h3>Programs &amp; events <span className="quiet-label">({views.programs.length})</span></h3>
              {views.programs.length === 0 ? (
                <p className="field-help">No programs yet. Go to <Link href="/admin/programs/new" className="text-link">New program</Link>.</p>
              ) : (
                <ul className="program-list">
                  {views.programs.map((program) => (
                    <li key={program.id ?? program.slug}>
                      <Link
                        href={
                          program.id
                            ? `/admin/programs/${program.id}`
                            : "/admin/programs/new"
                        }
                        className="program-row"
                      >
                        <div className="program-row__main">
                          <span className={`status-badge status-${program.status}`}>
                            {programStatusLabels[program.status]}
                          </span>
                          <div className="program-row__body">
                            <span className="program-row__title">{program.title}</span>
                            <span className="program-row__meta">{program.category} · {program.location}</span>
                          </div>
                        </div>
                        <span className="program-row__action">Open →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="admin-panel-actions">
                <Link href="/admin/programs/new" className="button button-primary">+ New program</Link>
                <Link href="/admin/programs" className="text-link">Manage programs →</Link>
              </div>
            </div>

            <div className="admin-panel">
              <h3>Blog</h3>
              {views.posts.length === 0 ? (
                <p className="field-help">No posts yet. Go to <Link href="/admin/posts/new" className="text-link">New post</Link>.</p>
              ) : (
                <ul className="post-list">
                  {views.posts.map((post) => (
                    <li key={post.id ?? post.slug}>
                      <Link href={post.id ? `/admin/posts/${post.id}` : "/admin/posts/new"} className="post-row">
                        <span className="post-row__main">
                          <span className={`status-badge ${post.published ? "status-active" : "status-past"}`}>
                            {post.published ? "Published" : "Draft"}
                          </span>
                          <div className="post-row__body">
                            <span className="post-row__title">{post.title}</span>
                            <span className="post-row__meta">{post.author} · {post.tags.join(", ")}</span>
                          </div>
                        </span>
                        <span className="post-row__info">
                          <span className="post-row__excerpt">{post.excerpt || "No excerpt"}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="admin-panel-actions">
                <Link href="/admin/posts/new" className="button button-primary">+ New post</Link>
                <Link href="/admin/posts" className="text-link">Manage posts →</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-section admin-section--narrow">
          <h2>Media library</h2>
          <p className="field-help">
            Use the image upload fields in the program and post editors to add
            cover images. Each upload creates a public image URL that you can
            reuse in other entries.
          </p>
        </section>
      </div>

      <footer className="admin-footer">
        <p>
          <Link href="/admin" className="text-link">← Back to Admin overview</Link>
        </p>
      </footer>
    </>
  );
}
