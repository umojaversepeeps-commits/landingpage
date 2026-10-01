import {
  Arrow,
  ButtonLink,
  CommunityImage,
  Eyebrow,
  PartnerCallout,
  TextLink,
} from "@/components/ui";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="home-hero container">
        <div className="hero-topline">
        </div>
        <div className="home-heading">
          <h1>
            Africa’s builders.
            <br />
            <span>Better together.</span>
          </h1>
          <div className="hero-aside">
            <p>
              Learn Web3. Find your collaborators. Build something that
              matters—with a community beside you.
            </p>
            <ButtonLink href="/join" arrow>
              Find your people
            </ButtonLink>
          </div>
        </div>
        <div className="home-visual">
          <CommunityImage
            priority
            caption="Learning and creating together."
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 66vw, 800px"
          />
          <div className="home-visual-note">
            <span className="brand-geometry" aria-hidden="true">
              <span />
              <span />
            </span>
            <div>
              <span className="quiet-label">The Umojaverse way</span>
              <p>
                Learn openly.
                <br />
                Build with purpose.
                <br />
                Grow together.
              </p>
            </div>
            <TextLink href="/about">Meet Umojaverse</TextLink>
          </div>
        </div>
      </section>
      <section className="container home-explore">
        <div className="section-heading">
          <div>
            <Eyebrow number="01">Find your starting point</Eyebrow>
            <h2>Curiosity into practice.</h2>
          </div>
          <TextLink href="/programs">All programs</TextLink>
        </div>
        <div className="home-features">
          <Link
            href="/programs/arbitrum-builders-initiative"
            className="editorial-link"
          >
            <span className="quiet-label">Explore a program · 2024</span>
            <h3>Arbitrum Builders Initiative</h3>
            <p>
              Campus workshops, shared ideas, and time to build. Discover where
              it started.
            </p>
            <span className="editorial-link-bottom">
              Inside the initiative <Arrow />
            </span>
          </Link>
          <Link href="/projects/builders-initiative" className="editorial-link">
            <span className="quiet-label">Community in action</span>
            <h3>From first ideas to working prototypes.</h3>
            <p>
              Follow the journey from a campus conversation to a collaborative
              build sprint.
            </p>
            <span className="editorial-link-bottom">
              Read the story <Arrow />
            </span>
          </Link>
        </div>
      </section>
      <PartnerCallout />
    </>
  );
}
