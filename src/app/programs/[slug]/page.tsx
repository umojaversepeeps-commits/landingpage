import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Eyebrow, TextLink } from "@/components/ui";
import { CoverImage, VideoEmbed } from "@/components/media-embed";
import { getProgram } from "@/lib/content";
import {
  formatDate,
  programStatus,
  programStatusLabels,
} from "@/lib/content-types";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
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
  const program = await getProgram(slug);
  if (!program) notFound();

  const status = programStatus(program);
  const start = formatDate(program.startDate);
  const end = formatDate(program.endDate);
  const dateLabel =
    start && end && start !== end
      ? `${start} – ${end}`
      : start || program.period;
  const bodyHtml = program.body ? renderMarkdown(program.body) : "";

  return (
    <>
      <section className="container detail-header">
        <Link href="/programs" className="back-link">
          ← Programs
        </Link>
        <Eyebrow>{program.category}</Eyebrow>
        <h1>{program.title}</h1>
        <p className="intro-copy">{program.description}</p>
        <div className="detail-meta">
          {dateLabel && <span>{dateLabel}</span>}
          {program.location && <span>{program.location}</span>}
          <span className={`status-badge status-${status}`}>
            {programStatusLabels[status]}
          </span>
        </div>
      </section>

      {program.coverImageUrl && (
        <div className="container program-photo">
          <CoverImage
            src={program.coverImageUrl}
            alt={program.title}
            priority
            caption={`${program.category} · ${program.location || "Umojaverse"}`}
          />
        </div>
      )}

      {program.videoUrl && (
        <div className="container program-photo">
          <VideoEmbed url={program.videoUrl} title={program.title} />
        </div>
      )}

      <section className="container detail-grid content-section">
        <div className="prose">
          {program.overview && (
            <>
              <h2>Learning through participation.</h2>
              <p>{program.overview}</p>
            </>
          )}
          {program.highlights.length > 0 && (
            <>
              <h2>Inside the program</h2>
              <ul>
                {program.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {bodyHtml && (
            <div
              className="rich-body"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          )}
          {program.source && (
            <>
              <p className="source-note">
                Find the published account and original details below.
              </p>
              <TextLink href={program.source} external>
                {program.sourceLabel || "Read more"}
              </TextLink>
            </>
          )}
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
    </>
  );
}
