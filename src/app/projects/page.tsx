import type { Metadata } from "next";
import {
  ButtonLink,
  CommunityImage,
  Eyebrow,
  PageIntro,
  TextLink,
} from "@/components/ui";
import { sources } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects & Impact",
  description:
    "Explore the collaborative work and published outcomes from Umojaverse’s developer community.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        label="Projects"
        title={
          <>
            Shared ideas.
            <br />
            <span className="accent-text">Real progress.</span>
          </>
        }
      >
        Behind every program are people trying something new. Explore the work,
        the learning, and what came next.
      </PageIntro>
      <section className="container content-section">
        <article className="story-feature">
          <div className="story-feature-copy">
            <Eyebrow>Community in action · Ethiopia</Eyebrow>
            <h2>Good questions bring us together.</h2>
            <p>
              A glimpse inside Arbitrum Pulse: developers exploring new tools,
              exchanging ideas, and learning from one another.
            </p>
            <ButtonLink href="/programs/arbitrum-pulse-ethiopia" arrow>
              Explore Arbitrum Pulse
            </ButtonLink>
          </div>
          <CommunityImage
            priority
            variant="workshop"
            caption="A conversation from the community."
          />
        </article>
        <div className="impact-block">
          <div className="section-heading">
            <div>
              <Eyebrow number="01">
                Arbitrum Builders Initiative · Kenya
              </Eyebrow>
              <h2>A program in perspective.</h2>
            </div>
            <span className="section-note">
              2024 program · January 2025 report
            </span>
          </div>
          <div className="impact-stats">
            <div>
              <strong>05</strong>
              <span>Universities reached</span>
            </div>
            <div>
              <strong>23</strong>
              <span>Project submissions</span>
            </div>
            <div>
              <strong>11</strong>
              <span>Projects awarded</span>
            </div>
          </div>
          <div className="impact-source">
            <p className="source-note">
              Outcomes from the published program report.
            </p>
            <TextLink href={sources.report} external>
              Read the report
            </TextLink>
          </div>
          <TextLink href="/projects/builders-initiative">
            Read the Kenya program story
          </TextLink>
        </div>
        <div className="simple-callout dark-callout">
          <div>
            <Eyebrow>Keep building</Eyebrow>
            <h2>Working on something useful?</h2>
            <p>
              Bring your idea to the conversation. Find people to take it
              further.
            </p>
          </div>
          <ButtonLink href="/join" arrow>
            Meet the community
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
