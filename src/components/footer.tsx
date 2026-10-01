import Link from "next/link";
import { navigation, site } from "@/lib/site";
import { Arrow, Logo } from "./ui";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              A community to learn, build,
              and grow with.
            </p>
          </div>
          <div>
            <h2 className="footer-heading">Explore</h2>
            <nav aria-label="Footer navigation">
              {navigation.slice(1).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h2 className="footer-heading">Let’s connect</h2>
            <a
              className="footer-social"
              href={site.x}
              target="_blank"
              rel="noopener noreferrer"
            >
              @UmojaverseDevs <Arrow diagonal />
              <span className="sr-only"> on X (opens in a new tab)</span>
            </a>
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
            <Link className="footer-contact" href="/partners">
              Start a conversation <Arrow />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Umojaverse. All rights reserved.</p>
          <span>Built around people. Open to possibilities.</span>
        </div>
      </div>
    </footer>
  );
}
