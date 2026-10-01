"use client";

import { useRef, useState } from "react";
import { Arrow } from "./ui";

type Enquiry = {
  name: string;
  email: string;
  organization: string;
  interest: string;
  message: string;
};

export function EnquiryForm({
  contactEmail,
  xUrl,
}: {
  contactEmail: string;
  xUrl: string;
}) {
  const [draft, setDraft] = useState<Enquiry | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const summary = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const text = draft
    ? `Hello Umojaverse,\n\n${draft.message}\n\nInterested in: ${draft.interest}\nName: ${draft.name}\nEmail: ${draft.email}${draft.organization ? `\nOrganization: ${draft.organization}` : ""}`
    : "";

  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    for (const [fieldName, minLength] of [
      ["name", 2],
      ["message", 20],
    ] as const) {
      const field = event.currentTarget.elements.namedItem(fieldName) as
        HTMLInputElement | HTMLTextAreaElement;
      if (field.value.trim().length < minLength) {
        field.setCustomValidity(
          `Please enter at least ${minLength} characters, excluding surrounding spaces.`,
        );
        field.reportValidity();
        return;
      }
      field.setCustomValidity("");
    }
    const data = new FormData(event.currentTarget);
    setDraft({
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      organization: String(data.get("organization")).trim(),
      interest: String(data.get("interest")),
      message: String(data.get("message")).trim(),
    });
    setCopyState("idle");
    requestAnimationFrame(() => summary.current?.focus());
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="enquiry-panel">
      <div className="form-heading">
        <h2>Start a conversation.</h2>
        <p>
          Tell us a little about your idea. We’ll help you prepare a message to
          share with the team.
        </p>
      </div>
      <form
        onSubmit={prepare}
        onInput={(event) => {
          const field = event.target;
          if (
            field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement
          )
            field.setCustomValidity("");
        }}
        hidden={!!draft}
      >
        <div className="form-row">
          <div className="field">
            <label htmlFor="name">
              Your name <span aria-hidden="true">*</span>
            </label>
            <input
              ref={firstField}
              id="name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Your full name"
            />
          </div>
          <div className="field">
            <label htmlFor="email">
              Email address <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@organization.com"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="organization">
            Organization <span className="optional">Optional</span>
          </label>
          <input
            id="organization"
            name="organization"
            autoComplete="organization"
            maxLength={160}
            placeholder="Your organization or community"
          />
        </div>
        <div className="field">
          <label htmlFor="interest">I’m interested in</label>
          <select
            id="interest"
            name="interest"
            defaultValue="Workshops & developer education"
          >
            <option>Workshops & developer education</option>
            <option>Campus collaboration</option>
            <option>Mentorship & builder support</option>
            <option>Something else</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="message">
            What do you have in mind? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            minLength={20}
            maxLength={3000}
            rows={5}
            placeholder="A little about your idea, who it could help, and how you’d like to collaborate…"
          />
          <span className="field-hint">
            At least 20 characters. A short introduction is enough.
          </span>
        </div>
        <p className="form-privacy">
          Your details stay in this page until you choose to share your message.
          Nothing is submitted automatically.
        </p>
        <button className="button button-primary" type="submit">
          Prepare enquiry <Arrow />
        </button>
      </form>
      {draft && (
        <div className="draft-result" ref={summary} tabIndex={-1}>
          <div className="draft-status">
            <span className="accent-square" />
            Your message is ready to share
          </div>
          <p>
            Review your enquiry below, then{" "}
            {contactEmail
              ? "open it in your email app"
              : "copy it and contact Umojaverse on X"}
            . Your enquiry has not been sent.
          </p>
          <textarea
            aria-label="Your prepared enquiry"
            readOnly
            value={text}
            rows={10}
          />
          <div className="draft-actions">
            {contactEmail ? (
              <a
                className="button button-primary"
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Umojaverse partnership: ${draft.interest}`)}&body=${encodeURIComponent(text)}`}
              >
                Open email draft <Arrow diagonal />
              </a>
            ) : (
              <button
                type="button"
                className="button button-primary"
                onClick={copy}
              >
                {copyState === "copied" ? "Message copied" : "Copy message"}
                <Arrow />
              </button>
            )}
            {!contactEmail && (
              <a
                href={xUrl}
                className="button button-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact us on X <Arrow diagonal />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
          <p className="copy-feedback" role="status">
            {copyState === "copied"
              ? "Copied. You can now paste your message into your conversation."
              : copyState === "error"
                ? "Select and copy the message above to share it."
                : ""}
          </p>
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setDraft(null);
              requestAnimationFrame(() => firstField.current?.focus());
            }}
          >
            Edit my enquiry <Arrow />
          </button>
        </div>
      )}
    </div>
  );
}
