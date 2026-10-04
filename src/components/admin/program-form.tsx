"use client";

import { useActionState, useState } from "react";
import { saveProgram } from "@/app/admin/actions";
import {
  programStatus,
  programStatusLabels,
  type Program,
} from "@/lib/content-types";
import { ImageField } from "./image-field";

const categories = [
  "Campus tour",
  "Build sprint",
  "Workshop",
  "Bootcamp",
  "Meetup",
  "Community",
];

export function ProgramForm({ program }: { program?: Program }) {
  const [state, action, pending] = useActionState(saveProgram, undefined);
  const [startDate, setStartDate] = useState(program?.startDate ?? "");
  const [endDate, setEndDate] = useState(program?.endDate ?? "");
  const status = programStatus({
    startDate: startDate || null,
    endDate: endDate || null,
  });

  return (
    <form action={action} className="admin-form">
      {program?.id && <input type="hidden" name="id" value={program.id} />}

      <div className="field-grid">
        <div className="field field-span">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            defaultValue={program?.title ?? ""}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="slug">URL slug</label>
          <input
            id="slug"
            name="slug"
            defaultValue={program?.slug ?? ""}
            placeholder="auto-generated from the title"
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            list="program-categories"
            defaultValue={program?.category ?? "Campus tour"}
          />
          <datalist id="program-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
        <div className="field">
          <label htmlFor="startDate">Start date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="endDate">End date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            defaultValue={program?.location ?? ""}
            placeholder="Nairobi · Campus"
          />
        </div>
        <div className="field">
          <label htmlFor="period">Period label</label>
          <input
            id="period"
            name="period"
            defaultValue={program?.period ?? ""}
            placeholder="Optional, e.g. 5 October 2024"
          />
        </div>
      </div>

      <p className="field-help">
        Status updates automatically from the dates:{" "}
        <span className={`status-badge status-${status}`}>
          {programStatusLabels[status]}
        </span>
      </p>

      <div className="field">
        <label htmlFor="description">Short description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={program?.description ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor="overview">Overview</label>
        <textarea
          id="overview"
          name="overview"
          rows={4}
          defaultValue={program?.overview ?? ""}
        />
      </div>
      <div className="field">
        <label htmlFor="body">Full story (Markdown)</label>
        <textarea
          id="body"
          name="body"
          rows={10}
          defaultValue={program?.body ?? ""}
          placeholder={"## A heading\n\n- A point\n- Another point\n\n[Link](https://example.com)"}
        />
      </div>
      <div className="field">
        <label htmlFor="highlights">Highlights</label>
        <textarea
          id="highlights"
          name="highlights"
          rows={4}
          defaultValue={(program?.highlights ?? []).join("\n")}
          placeholder="One highlight per line"
        />
      </div>

      <ImageField
        name="coverImageUrl"
        label="Cover image"
        defaultValue={program?.coverImageUrl ?? ""}
        folder="programs"
        help="Paste an image URL or upload a file."
      />

      <div className="field">
        <label htmlFor="videoUrl">Video URL</label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={program?.videoUrl ?? ""}
          placeholder="https://youtube.com/watch?v=… or https://vimeo.com/…"
        />
        <p className="field-help">
          YouTube and Vimeo links render as a responsive embed.
        </p>
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor="source">Source link</label>
          <input
            id="source"
            name="source"
            type="url"
            defaultValue={program?.source ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="sourceLabel">Source label</label>
          <input
            id="sourceLabel"
            name="sourceLabel"
            defaultValue={program?.sourceLabel ?? ""}
          />
        </div>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          name="published"
          defaultChecked={program ? program.published : true}
        />
        Published (visible on the site)
      </label>

      {state?.error && <p className="field-error">{state.error}</p>}

      <div className="admin-actions">
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Saving…" : program ? "Save changes" : "Create program"}
        </button>
      </div>
    </form>
  );
}
