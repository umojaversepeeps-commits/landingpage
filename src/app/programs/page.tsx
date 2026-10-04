import type { Metadata } from "next";
import { ButtonLink, CommunityImage, Eyebrow, PageIntro } from "@/components/ui";
import {
  ProgramBrowser,
  type ProgramView,
} from "@/components/program-browser";
import { getPrograms } from "@/lib/content";
import { programStatus } from "@/lib/content-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programs & Events",
  description:
    "Explore Umojaverse workshops, campus tours, and community programs. Learn and build with other developers.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const views: ProgramView[] = programs.map((program) => ({
    ...program,
    status: programStatus(program),
  }));

  return (
    <>
      <PageIntro
        label="Programs"
        title={
          <>
            Less watching.
            <br />
            <span className="accent-text">More making.</span>
          </>
        }
      >
        Workshops, campus conversations, and focused time to build. Find your
        next step through the work we do together.
      </PageIntro>
      <section className="container content-section">
        <div className="programs-feature">
          <CommunityImage
            variant="discussion"
            priority
            caption="Questions worth sharing."
          />
          <div className="programs-principle">
            <Eyebrow>The way we learn</Eyebrow>
            <h2>
              Try it.
              <br />
              Talk it through.
              <br />
              Build on it.
            </h2>
            <p>
              Practical learning, useful feedback, and people who keep you
              going.
            </p>
          </div>
        </div>
        <div className="catalog-heading">
          <h2>Explore our programs</h2>
          <span className="quiet-label">Active, upcoming & past</span>
        </div>
        <ProgramBrowser programs={views} />
        <div className="simple-callout">
          <div>
            <h2>Be part of the next chapter.</h2>
            <p>
              Connect with the community for future workshops and gatherings.
            </p>
          </div>
          <ButtonLink href="/join" arrow>
            Stay connected
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
