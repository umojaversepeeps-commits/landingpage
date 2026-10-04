import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost } from "@/app/admin/actions";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { PostForm } from "@/components/admin/post-form";
import { getPosts } from "@/lib/content";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const posts = await getPosts({ includeUnpublished: true });
  const post = posts.find((item) => item.id === id);
  if (!post) notFound();

  return (
    <section className="admin-section">
      <Link href="/admin/posts" className="back-link">
        ← Posts
      </Link>
      <div className="admin-section-head">
        <h2>Edit post</h2>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <ConfirmSubmit
            message={`Delete “${post.title}”? This cannot be undone.`}
            className="button button-secondary"
          >
            Delete post
          </ConfirmSubmit>
        </form>
      </div>
      <PostForm post={post} />
    </section>
  );
}
