import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <section className="admin-section">
      <Link href="/admin/posts" className="back-link">
        ← Posts
      </Link>
      <h2>New post</h2>
      <PostForm />
    </section>
  );
}
