import type { Metadata } from "next";
import {
  ButtonLink,
  CommunityImage,
  Eyebrow,
  PageIntro,
  TextLink,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "A community connecting African developers through practical learning, collaboration, and shared opportunities.",
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        label="About"
        title={
          <>
            Different paths.
            <br />
            <span className="accent-text">Shared ambition.</span>
          </>
        }
      >
        A place for African developers to learn their craft, exchange ideas, and
        find people to build with.
      </PageIntro>
      <section className="container content-section">
        <CommunityImage
          priority
          variant="audience"
          className="panorama"
          caption="Good ideas need people around them."
          sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) calc(100vw - 64px), 1184px"
        />
        <div className="editorial-section mission-section">
          <div>
            <Eyebrow number="01">Why we’re here</Eyebrow>
            <h2>
              Talent is everywhere.
              <br />
              Opportunity should be, too.
            </h2>
          </div>
          <div className="prose">
            <p>
              Starting something new takes more than information. It takes
              people to learn with, space to ask questions, and a chance to put
              your ideas into practice.
            </p>
            <p>
              Umojaverse brings those pieces together through campus workshops,
              practical Web3 education, and collaborative building.
            </p>
            <TextLink href="/programs">See how we learn</TextLink>
          </div>
        </div>
        <div className="values-section">
          <Eyebrow number="02">What we believe</Eyebrow>
          <div className="values-grid">
            {[
              {
                title: "Learn in the open.",
                body: "Ask the first question. Share what you discover. Make room for different starting points.",
              },
              {
                title: "Make it useful.",
                body: "Start with a real problem. Experiment, gather feedback, and let the work teach you.",
              },
              {
                title: "Bring others along.",
                body: "Share an opportunity. Help someone move forward. Progress means more when it’s shared.",
              },
            ].map((value, i) => (
              <article key={value.title}>
                <span className="row-number">0{i + 1} /</span>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="simple-callout">
          <div>
            <Eyebrow>Your next chapter</Eyebrow>
            <h2>There’s room for your curiosity.</h2>
            <p>
              First steps or years of experience. Let’s learn something
              together.
            </p>
          </div>
          <ButtonLink href="/join" arrow>
            Join the community
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
