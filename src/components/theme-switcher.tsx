"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getServerThemePreference,
  getThemePreference,
  setThemePreference,
  subscribeToTheme,
  type ThemePreference,
} from "@/lib/theme";

function ThemeIcon({ theme }: { theme: ThemePreference }) {
  return (
    <svg
      className={`theme-icon theme-icon--${theme}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {theme === "light" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </>
      ) : theme === "dark" ? (
        <path d="M20.6 14.1A9 9 0 0 1 9.9 3.4a9 9 0 1 0 10.7 10.7Z" />
      ) : (
        <>
          <rect x="3" y="4" width="18" height="13" rx="1.5" />
          <path d="M8 21h8m-4-4v4" />
        </>
      )}
    </svg>
  );
}

export function ThemeSwitcher({ onOpen }: { onOpen: () => void }) {
  const preference = useSyncExternalStore(
    subscribeToTheme,
    getThemePreference,
    getServerThemePreference,
  );
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const choices = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    choices.current
      ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      ?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      className="theme-switcher"
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="theme-trigger"
        aria-label="Choose color theme"
        aria-expanded={open}
        aria-controls="theme-options"
        title="Choose color theme"
        onClick={() => {
          if (!open) onOpen();
          setOpen(!open);
        }}
      >
        <ThemeIcon theme="light" />
        <ThemeIcon theme="dark" />
        <ThemeIcon theme="system" />
      </button>
      <div
        id="theme-options"
        className="theme-options"
        role="group"
        aria-label="Color theme"
        hidden={!open}
        ref={choices}
      >
        <p>Appearance</p>
        {(["light", "dark", "system"] as const).map((theme) => (
          <button
            key={theme}
            type="button"
            aria-pressed={preference === theme}
            onClick={() => {
              setThemePreference(theme);
              setOpen(false);
              trigger.current?.focus();
            }}
          >
            <ThemeIcon theme={theme} />
            <span>
              {theme === "system"
                ? "System"
                : theme === "dark"
                  ? "Dark"
                  : "Light"}
            </span>
            <span className="theme-selected" aria-hidden="true">
              ✓
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
