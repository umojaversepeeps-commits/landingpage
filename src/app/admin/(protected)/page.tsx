import Link from "next/link";
import { getPosts, getPrograms } from "@/lib/content";
import { programStatus } from "@/lib/content-types";

export default async function AdminOverview() {
  const [programs, posts] = await Promise.all([
    getPrograms({ includeUnpublished: true }),
    getPosts({ includeUnpublished: true }),
  ]);

  const active = programs.filter((p) => programStatus(p) === "active").length;
  const upcoming = programs.filter((p) => programStatus(p) === "upcoming").length;
  const past = programs.filter((p) => programStatus(p) === "past").length;
  const draftPosts = posts.filter((p) => !p.published).length;

  const stats = [
    { label: "Active programs", value: active },
    { label: "Upcoming programs", value: upcoming },
    { label: "Past programs", value: past },
    { label: "Blog posts", value: posts.length },
    { label: "Unpublished drafts", value: draftPosts },
  ];

  return (
    <section className="admin-section">
      <div className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-panels">
        <div className="admin-panel">
          <h2>Programs</h2>
          <p>
            Add a program, set its start and end dates, and it is sorted into
            active, upcoming, or past automatically.
          </p>
          <div className="admin-panel-actions">
            <Link href="/admin/programs/new" className="button button-primary">
              New program
            </Link>
            <Link href="/admin/programs" className="text-link">
              Manage programs
            </Link>
          </div>
        </div>
        <div className="admin-panel">
          <h2>Blog</h2>
          <p>
            Write posts in Markdown and embed a YouTube or Vimeo link anywhere in
            the post.
          </p>
          <div className="admin-panel-actions">
            <Link href="/admin/posts/new" className="button button-primary">
              New post
            </Link>
            <Link href="/admin/posts" className="text-link">
              Manage posts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
