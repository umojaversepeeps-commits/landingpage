import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { programs } from "@/lib/site";
import { ButtonLink, CommunityImage, Eyebrow, TextLink } from "@/components/ui";

export const dynamicParams = false;
export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  return {
    title: program?.title || "Program not found",
    description: program?.description,
  };
}

export default async function ProgramDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();
  return (
    <>
      <section className="container detail-header">
        <Link href="/programs" className="back-link">
          ← Programs & Events
        </Link>
        <Eyebrow>{program.category}</Eyebrow>
        <h1>{program.title}</h1>
        <p className="intro-copy">{program.description}</p>
        <div className="detail-meta">
          <span>{program.period}</span>
          <span>{program.location}</span>
          <span className="tag">{program.status}</span>
        </div>
      </section>
      {slug === "arbitrum-pulse-ethiopia" && (
        <div className="container program-photo">
          <CommunityImage
            priority
            variant="gathering"
            className="panorama"
            caption="The people behind the gathering."
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) calc(100vw - 64px), 1184px"
          />
        </div>
      )}
      <section className="container detail-grid content-section">
        <div className="prose">
          <h2>Learning through participation.</h2>
          <p>{program.overview}</p>
          <h2>Inside the program</h2>
          <ul>
            {program.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="source-note">
            This is an archived program. Find the published account and original
            details below.
          </p>
          <TextLink href={program.source} external>
            {program.sourceLabel}
          </TextLink>
        </div>
        <aside>
          <div className="aside-panel">
            <Eyebrow>Keep exploring</Eyebrow>
            <h2>Your next step starts here.</h2>
            <p>
              Find fellow builders and hear about future opportunities through
              the community.
            </p>
            <ButtonLink href="/join" arrow>
              Join the community
            </ButtonLink>
          </div>
        </aside>
      </section>
      {slug === "arbitrum-builders-initiative" && (
        <section className="container related-story">
          <div className="program-outcome">
            <Eyebrow>Kenya · 2024 initiative</Eyebrow>
            <strong>23</strong>
            <p>
              Project submissions from the campus tour and virtual hackerhouse.
            </p>
          </div>
          <div>
            <Eyebrow>Beyond the workshop</Eyebrow>
            <h2>What came next?</h2>
            <p>
              Explore the published outcomes of the campus tour and virtual
              hackerhouse.
            </p>
            <TextLink href="/projects/builders-initiative">
              Read the community story
            </TextLink>
          </div>
        </section>
      )}
    </>
  );
}
