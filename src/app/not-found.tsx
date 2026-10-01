import { ButtonLink, Eyebrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container not-found">
      <Eyebrow>404 · A small detour</Eyebrow>
      <h1>This page isn’t here.</h1>
      <p>Let’s get you back to the community.</p>
      <ButtonLink href="/" arrow>
        Back to home
      </ButtonLink>
    </section>
  );
}
