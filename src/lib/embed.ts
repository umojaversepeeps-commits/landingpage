// Parse YouTube / Vimeo links into responsive, privacy-friendly embed URLs.

export type VideoEmbed = {
  provider: "youtube" | "vimeo";
  embedUrl: string;
  watchUrl: string;
};

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") return url.pathname.slice(1) || null;
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    if (url.pathname === "/watch") return url.searchParams.get("v");
    const match = url.pathname.match(/^\/(embed|shorts|live)\/([^/?#]+)/);
    if (match) return match[2];
  }
  return null;
}

function vimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
  const match = url.pathname.match(/\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export function parseVideoEmbed(raw: string | null | undefined): VideoEmbed | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const yt = youtubeId(url);
  if (yt) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}`,
      watchUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(yt)}`,
    };
  }

  const vimeo = vimeoId(url);
  if (vimeo) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${encodeURIComponent(vimeo)}`,
      watchUrl: `https://vimeo.com/${encodeURIComponent(vimeo)}`,
    };
  }

  return null;
}

/**
 * Embed any URL into an iframe when it is a direct media file, and otherwise
 * fall back to a link. Used for non-YouTube/Vimeo media.
 */
export function isDirectMedia(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url.trim());
}
