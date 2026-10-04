"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState, useTransition } from "react";
import { uploadMedia } from "@/app/admin/actions";

export function ImageField({
  name,
  label,
  defaultValue = "",
  folder = "general",
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  folder?: string;
  help?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  function upload(file: File) {
    if (file.size > 4 * 1024 * 1024) {
      setError("Images must be 4MB or smaller.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    const body = new FormData();
    body.set("file", file);
    body.set("folder", folder);
    startTransition(async () => {
      const result = await uploadMedia(body);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        setValue(result.url);
        setError(null);
      }
      if (fileInput.current) fileInput.current.value = "";
    });
  }

  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="https://…"
      />
      <div className="field-row">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          disabled={pending}
          aria-label={`Upload ${label}`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
          }}
        />
        {pending && <span className="quiet-label">Uploading…</span>}
      </div>
      <p className="field-help">Upload an image up to 4MB.</p>
      {help && <p className="field-help">{help}</p>}
      {error && <p className="field-error">{error}</p>}
      {value && <img className="field-preview" src={value} alt="" />}
    </div>
  );
}
