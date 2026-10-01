"use client";

import { useState } from "react";
import { programs, site } from "@/lib/site";
import { Arrow, TextLink } from "./ui";
import Link from "next/link";

const filters = [
  "All programs",
  "Campus tours",
  "Upcoming",
] as const;
type Filter = (typeof filters)[number];

export function ProgramBrowser() {
  const [filter, setFilter] = useState<Filter>("All programs");
  const visible = programs.filter(
    (p) =>
      filter === "All programs" ||
      (filter === "Campus tours" && p.category === "Campus tour")
  );
  return (
    <div>
      <div className="filter-bar" role="group" aria-label="Filter programs">
        {filters.map((item) => (
          <button
            key={item}
            aria-pressed={item === filter}
            onClick={() => setFilter(item)}
            className={
              item === filter ? "filter-button selected" : "filter-button"
            }
          >
            {item}
          </button>
        ))}
      </div>
      <p className="results-count" aria-live="polite">
        {visible.length
          ? `${visible.length} ${visible.length === 1 ? "program" : "programs"} to explore`
          : "No upcoming events announced yet"}
      </p>
      <div className="program-list">
        {visible.map((program, index) => (
          <article className="program-row" key={program.slug}>
            <span className="row-number">0{index + 1}</span>
            <div>
              <div className="row-kicker">
                <span className="tag">{program.category}</span>
                <span className="quiet-label">{program.status}</span>
              </div>
              <h2>
                <Link href={`/programs/${program.slug}`}>{program.title}</Link>
              </h2>
              <p>{program.description}</p>
              <span className="event-location">{program.location}</span>
            </div>
            <div className="program-row-aside">
              <span className="program-period">{program.period}</span>
              <TextLink href={`/programs/${program.slug}`}>
                Explore program
              </TextLink>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <div className="empty-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <h2>The next chapter is on its way.</h2>
          <p>
            Follow Umojaverse for new workshops, community sessions, and
            opportunities to build together.
          </p>
          <a
            className="button button-primary"
            href={site.x}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on X <Arrow diagonal />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button
            className="text-link"
            onClick={() => setFilter("All programs")}
          >
            Explore past programs <Arrow />
          </button>
        </div>
      )}
    </div>
  );
}
