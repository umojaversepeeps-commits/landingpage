import Link from "next/link";
import { deletePost } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/content-types";

export default async function AdminPostsPage() {
  const posts = await getPosts({ includeUnpublished: true });

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <h2>Blog posts</h2>
        <Link href="/admin/posts/new" className="button button-primary">
          New post
        </Link>
      </div>

      {posts.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Published</th>
                <th scope="col">Visibility</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id ?? post.slug}>
                  <td>
                    <strong>{post.title}</strong>
                    <span className="quiet-label block">/blog/{post.slug}</span>
                  </td>
                  <td>{formatDate(post.publishedAt) || "—"}</td>
                  <td>{post.published ? "Published" : "Draft"}</td>
                  <td>
                    <div className="admin-row-actions">
                      {post.id && (
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="text-link"
                        >
                          Edit
                        </Link>
                      )}
                      {post.id && (
                        <form action={deletePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <ConfirmSubmit
                            message={`Delete “${post.title}”? This cannot be undone.`}
                            className="text-link danger"
                          >
                            Delete
                          </ConfirmSubmit>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-empty">
          No posts yet. Write your first one to get started.
        </p>
      )}
    </section>
  );
}
