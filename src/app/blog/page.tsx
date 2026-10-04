import type { Metadata } from "next";
import Link from "next/link";
import { CoverImage } from "@/components/media-embed";
import { Arrow, ButtonLink, PageIntro } from "@/components/ui";
import { getPosts } from "@/lib/content";
import { formatDate } from "@/lib/content-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from our workshops, builder stories, and practical guides from the Umojaverse community.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageIntro
        label="Blog"
        title={
          <>
            Notes from
            <br />
            <span className="accent-text">the community.</span>
          </>
        }
      >
        Recaps from our programs, stories from the people building with us, and
        practical guides you can follow at your own pace.
      </PageIntro>

      <section className="container content-section">
        {posts.length ? (
          <div className="post-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="post-card-link">
                  {post.coverImageUrl && (
                    <div className="post-card-cover">
                      <CoverImage src={post.coverImageUrl} alt={post.title} />
                    </div>
                  )}
                  <div className="post-card-body">
                    <div className="row-kicker">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                      {post.publishedAt && (
                        <span className="quiet-label">
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                    </div>
                    <h2>{post.title}</h2>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <span className="text-link">
                      Read the post <Arrow />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-mark" aria-hidden="true">
              <span />
              <span />
            </div>
            <h2>The first post is on its way.</h2>
            <p>
              Follow Umojaverse to hear when the first story is published.
            </p>
            <ButtonLink href="/join" arrow>
              Join the community
            </ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}
