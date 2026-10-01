import type { Metadata } from "next";
import {
  ButtonLink,
  CommunityImage,
  Eyebrow,
  PageIntro,
  TextLink,
} from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join the Community",
  description:
    "Bring your curiosity. Find people to learn and build with in the Umojaverse developer community.",
};

const questions = [
  {
    question: "Do I need Web3 experience?",
    answer:
      "You can start with curiosity. Our past programs have included introductions to blockchain as well as practical workshops. Check each program for its focus and requirements.",
  },
  {
    question: "Can I get involved remotely?",
    answer:
      "Stay connected online for announcements and conversations. Programs have included campus events and a virtual hackerhouse; the format is listed on each program page.",
  },
  {
    question: "How do I find the next event?",
    answer:
      "Follow @UmojaverseDevs on X and check our Programs page. New registration details will be shared when an event is announced.",
  },
];

export default function JoinPage() {
  return (
    <>
      <PageIntro
        label="Join the community"
        title={
          <>
            Bring your curiosity.
            <br />
            <span className="accent-text">Find your people.</span>
          </>
        }
      >
        Developers, designers, and people figuring it out. There’s something to
        learn—and someone to learn it with.
      </PageIntro>
      <section className="container content-section">
        <div className="join-feature">
          <CommunityImage
            priority
            variant="connections"
            caption="A conversation can be a beginning."
          />
          <div className="join-panel">
            <Eyebrow>Come say hello</Eyebrow>
            <h2>
              Your next step
              <br />
              starts here.
            </h2>
            <p>
              Find community conversations, program announcements, and
              opportunities to get involved.
            </p>
            <ButtonLink href={site.community} external arrow>
              {site.community === site.x
                ? "Connect on X"
                : "Join the community"}
            </ButtonLink>
            <TextLink href="/programs">Explore programs first</TextLink>
          </div>
        </div>
        <div className="values-section">
          <Eyebrow number="01">What brings us together</Eyebrow>
          <div className="values-grid">
            {[
              {
                title: "Room to learn.",
                body: "Ask questions, explore Web3, and turn new knowledge into practical skills.",
              },
              {
                title: "People to build with.",
                body: "Exchange ideas with developers and designers exploring their next step.",
              },
              {
                title: "Reasons to keep going.",
                body: "Find inspiration in what others are making and share your own progress.",
              },
            ].map((item, i) => (
              <article key={item.title}>
                <span className="row-number">0{i + 1} /</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="faq-section">
          <div>
            <Eyebrow number="02">A few things to know</Eyebrow>
            <h2>Before you jump in.</h2>
          </div>
          <div className="faq-list">
            {questions.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
