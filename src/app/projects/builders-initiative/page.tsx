import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Eyebrow, TextLink } from "@/components/ui";
import { sources } from "@/lib/site";

export const metadata: Metadata = {
  title: "From ideas to prototypes",
  description:
    "A community story from Umojaverse’s Arbitrum Builders Initiative, based on the January 2025 program report.",
};

export default function BuilderStory() {
  return (
    <>
      <section className="container detail-header">
        <Link href="/projects" className="back-link">
          ← Projects & Impact
        </Link>
        <Eyebrow>Community story</Eyebrow>
        <h1>From first ideas to working prototypes.</h1>
        <p className="intro-copy">
          Learning together gives an idea room to grow. A look at the Arbitrum
          Builders Initiative and the people building through it.
        </p>
        <div className="detail-meta">
          <span>Kenya & online</span>
          <span>2024 program</span>
          <span className="tag">Program outcomes</span>
        </div>
      </section>
      <section className="container detail-grid content-section">
        <article className="prose">
          <h2>A starting point on campus.</h2>
          <p>
            The initiative visited five Kenyan universities for blockchain
            workshops and ideathons. Students explored technical concepts,
            shared problems worth solving, and worked on ideas with their peers.
          </p>
          <h2>Space to keep building.</h2>
          <p>
            A five-day virtual hackerhouse gave participants time to develop
            their work with mentorship. The published report records 23 project
            submissions and 11 awarded projects that advanced to the Umojaverse
            Acceleration Program.
          </p>
          <h2>What we can learn.</h2>
          <p>
            The report highlights the value of ongoing foundational training and
            mentorship. It also describes how the move to an online format
            broadened participation. For a learning community, creating space to
            continue matters as much as the first workshop.
          </p>
          <div className="article-source">
            <Eyebrow>Source & context</Eyebrow>
            <p>
              This story summarizes Umojaverse’s final report, published on 7
              January 2025. Project submissions and awards are program outcomes;
              they do not establish that the projects are currently live
              products.
            </p>
            <TextLink href={sources.report} external>
              Read the full report
            </TextLink>
          </div>
        </article>
        <aside className="aside-panel">
          <Eyebrow>Start with curiosity</Eyebrow>
          <h2>Find people to build with.</h2>
          <p>
            Explore our programs and connect with other developers taking their
            next step.
          </p>
          <ButtonLink href="/programs" secondary arrow>
            Explore programs
          </ButtonLink>
        </aside>
      </section>
    </>
  );
}
