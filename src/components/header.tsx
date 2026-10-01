"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/lib/site";
import { Logo } from "./ui";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  function active(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const links = menu.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        if (event.shiftKey && document.activeElement === links[0]) {
          event.preventDefault();
          toggle.current?.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === links[links.length - 1]
        ) {
          event.preventDefault();
          toggle.current?.focus();
        } else if (document.activeElement === toggle.current) {
          event.preventDefault();
          links[event.shiftKey ? links.length - 1 : 0].focus();
        }
      }
    }
    const desktop = window.matchMedia("(min-width: 1100px)");
    function onResize() {
      if (desktop.matches) setOpen(false);
    }
    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo onClick={() => setOpen(false)} />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={active(item.href) ? "nav-link active" : "nav-link"}
              aria-current={active(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/join" className="button button-primary header-join">
            Join the community
          </Link>
          <ThemeSwitcher onOpen={() => setOpen(false)} />
          <button
            ref={toggle}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            <span className={open ? "menu-lines is-open" : "menu-lines"}>
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
      <div
        id="mobile-navigation"
        className="mobile-menu"
        hidden={!open}
        ref={menu}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-index">0{i + 1}</span>
              {item.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link
            className="button button-primary"
            href="/join"
            onClick={() => setOpen(false)}
          >
            Join the community
          </Link>
        </nav>
        <p>A place to learn. People to build with.</p>
      </div>
    </header>
  );
}
