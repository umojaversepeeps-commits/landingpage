import type { Metadata } from "next";
import { EnquiryForm } from "@/components/enquiry-form";
import { PageIntro, TextLink } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Create opportunities for African developers through workshops, campus collaboration, and mentorship with Umojaverse.",
};

export default function PartnersPage() {
  return (
    <>
      <PageIntro
        label="Work with us"
        title={
          <>
            Good people.
            <br />
            <span className="accent-text">Greater possibilities.</span>
          </>
        }
        actions={<TextLink href="#enquiry">Let’s talk</TextLink>}
      >
        Share your expertise, connect your campus, or support a builder’s next
        step. Let’s make more possible together.
      </PageIntro>
      <section className="container content-section">
        <div className="partnership-paths">
          {[
            {
              title: "Share your expertise.",
              body: "Create practical workshops that help developers learn something they can put to use.",
              label: "Education & workshops",
            },
            {
              title: "Connect your campus.",
              body: "Bring your university or student community together around new skills and shared ideas.",
              label: "Campus collaboration",
            },
            {
              title: "Back the next step.",
              body: "Offer mentorship, thoughtful feedback, and opportunities for emerging builders.",
              label: "Mentorship & support",
            },
          ].map((item, i) => (
            <article key={item.title}>
              <span className="row-number">0{i + 1} /</span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <span className="quiet-label">{item.label}</span>
            </article>
          ))}
        </div>
        <div className="partners-layout" id="enquiry">
          <div className="partner-invitation">
            <h2>
              Small introductions.
              <br />
              Meaningful beginnings.
            </h2>
            <p>
              Tell us what you have in mind and who it could help. We’ll start
              there.
            </p>
            <span className="brand-geometry" aria-hidden="true">
              <span />
              <span />
            </span>
            <TextLink href={site.x} external>
              Find us on X
            </TextLink>
          </div>
          <EnquiryForm contactEmail={site.email} xUrl={site.x} />
        </div>
      </section>
    </>
  );
}
