import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage, VideoEmbed } from "@/components/media-embed";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { getPost } from "@/lib/content";
import { formatDate } from "@/lib/content-types";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post?.title || "Post not found",
    description: post?.excerpt,
  };
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const bodyHtml = renderMarkdown(post.body);

  return (
    <article className="container post-detail">
      <Link href="/blog" className="back-link">
        ← Blog
      </Link>
      <header className="post-header">
        <Eyebrow>{post.tags[0] || "Blog"}</Eyebrow>
        <h1>{post.title}</h1>
        <div className="detail-meta">
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          {post.author && <span>{post.author}</span>}
        </div>
      </header>

      {post.coverImageUrl && (
        <div className="program-photo">
          <CoverImage src={post.coverImageUrl} alt={post.title} priority />
        </div>
      )}

      {post.videoUrl && (
        <div className="program-photo">
          <VideoEmbed url={post.videoUrl} title={post.title} />
        </div>
      )}

      <div className="detail-grid content-section">
        <div
          className="prose rich-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        <aside>
          <div className="aside-panel">
            <Eyebrow>Stay in the loop</Eyebrow>
            <h2>Hear about what’s next.</h2>
            <p>
              Join the community for new posts, workshops, and gatherings.
            </p>
            <ButtonLink href="/join" arrow>
              Join the community
            </ButtonLink>
          </div>
        </aside>
      </div>
    </article>
  );
}
