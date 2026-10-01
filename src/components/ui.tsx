import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { communityPhotos, type CommunityPhoto } from "@/lib/photos";

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      className="brand"
      aria-label="Umojaverse home"
      onClick={onClick}
    >
      <Image
        src="/images/logo-mark-transparent.png"
        alt=""
        width={36}
        height={36}
        priority
      />
      <Image
        className="brand-wordmark"
        src="/images/logo-wordmark-transparent.png"
        alt="Umojaverse"
        width={148}
        height={16}
        priority
      />
    </Link>
  );
}

export function ButtonLink({
  href,
  children,
  secondary = false,
  arrow = false,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  arrow?: boolean;
  external?: boolean;
  className?: string;
}) {
  const classes = `button ${secondary ? "button-secondary" : "button-primary"} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <Arrow diagonal={external} />}
    </>
  );
  return external ? (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const content = (
    <>
      {children}
      <Arrow diagonal={external} />
    </>
  );
  return external ? (
    <a
      className="text-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link className="text-link" href={href}>
      {content}
    </Link>
  );
}

export function Eyebrow({
  children,
  number,
}: {
  children: ReactNode;
  number?: string;
}) {
  return (
    <p className="eyebrow">
      {number ? (
        <>
          <span className="eyebrow-number">[{number}]</span>
          <span className="eyebrow-divider">/</span>
        </>
      ) : (
        <span className="accent-square" />
      )}
      {children}
    </p>
  );
}

export function PageIntro({
  label,
  title,
  children,
  actions,
}: {
  label: string;
  title: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="page-intro container">
      <Eyebrow>{label}</Eyebrow>
      <div className="intro-layout">
        <h1>{title}</h1>
        <div className="intro-aside">
          <p className="intro-copy">{children}</p>
          {actions && <div className="intro-actions">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

export function CommunityImage({
  priority = false,
  caption = "Learning and connecting in Ethiopia.",
  variant = "group",
  className = "",
  sizes = "(max-width: 760px) calc(100vw - 40px), (max-width: 1280px) 50vw, 600px",
}: {
  priority?: boolean;
  caption?: string;
  variant?: CommunityPhoto;
  className?: string;
  sizes?: string;
}) {
  const photo = communityPhotos[variant];
  return (
    <figure
      className={`community-figure community-figure--${variant} ${className}`}
    >
      <div className="community-image">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          style={{ objectPosition: photo.position }}
          sizes={sizes}
          priority={priority}
        />
        <span className="image-corner" />
      </div>
      <figcaption>
        <span>{caption}</span>
        <span className="caption-note">{photo.event}</span>
      </figcaption>
    </figure>
  );
}

export function PartnerCallout() {
  return (
    <section className="partner-section">
      <div className="container">
        <div className="partner-callout">
          <div>
            <Eyebrow>Better, together</Eyebrow>
            <h2>Make room for what’s next.</h2>
            <p>
              Bring your expertise. Help more African developers turn curiosity
              into something useful.
            </p>
          </div>
          <div className="callout-actions">
            <ButtonLink href="/partners" arrow>
              Get in touch
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
