"use client";

import { useState } from "react";
import Link from "next/link";
import {
  programStatusLabels,
  type Program,
  type ProgramStatus,
} from "@/lib/content-types";
import { site } from "@/lib/site";
import { Arrow, TextLink } from "./ui";

export type ProgramView = Program & { status: ProgramStatus };

const filters = ["All programs", "Active", "Upcoming", "Past events"] as const;
type Filter = (typeof filters)[number];

const filterStatus: Partial<Record<Filter, ProgramStatus>> = {
  Active: "active",
  Upcoming: "upcoming",
  "Past events": "past",
};

const emptyCopy: Record<Filter, { title: string; body: string }> = {
  "All programs": {
    title: "The next chapter is on its way.",
    body: "Follow Umojaverse for new workshops, community sessions, and opportunities to build together.",
  },
  Active: {
    title: "Nothing running right now.",
    body: "Programs appear here while they are in progress. Check what is coming up next.",
  },
  Upcoming: {
    title: "The next chapter is on its way.",
    body: "New workshops and gatherings will show up here as soon as they are announced.",
  },
  "Past events": {
    title: "No past programs yet.",
    body: "Once a program wraps up, you will find its recap here.",
  },
};

export function ProgramBrowser({ programs }: { programs: ProgramView[] }) {
  const [filter, setFilter] = useState<Filter>("All programs");
  const status = filterStatus[filter];
  const visible = status
    ? programs.filter((program) => program.status === status)
    : programs;
  const empty = emptyCopy[filter];

  return (
    <div>
      <div className="filter-bar" role="group" aria-label="Filter programs">
        {filters.map((item) => (
          <button
            key={item}
            aria-pressed={item === filter}
            onClick={() => setFilter(item)}
            className={item === filter ? "filter-button selected" : "filter-button"}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="results-count" aria-live="polite">
        {visible.length
          ? `${visible.length} ${visible.length === 1 ? "program" : "programs"} to explore`
          : "Nothing here yet"}
      </p>
      <div className="program-list">
        {visible.map((program, index) => (
          <article className="program-row" key={program.slug}>
            <span className="row-number">0{index + 1}</span>
            <div>
              <div className="row-kicker">
                <span className="tag">{program.category}</span>
                <span className={`status-badge status-${program.status}`}>
                  {programStatusLabels[program.status]}
                </span>
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
          <h2>{empty.title}</h2>
          <p>{empty.body}</p>
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
            onClick={() => setFilter("Past events")}
          >
            Explore past programs <Arrow />
          </button>
        </div>
      )}
    </div>
  );
}
