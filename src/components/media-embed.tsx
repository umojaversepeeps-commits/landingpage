/* eslint-disable @next/next/no-img-element */
import { isDirectMedia, parseVideoEmbed } from "@/lib/embed";

/** Responsive YouTube / Vimeo embed with a watch link fallback. */
export function VideoEmbed({
  url,
  title = "Embedded video",
  caption,
}: {
  url?: string | null;
  title?: string;
  caption?: string;
}) {
  const embed = parseVideoEmbed(url);
  const direct = url && isDirectMedia(url) ? url : null;

  if (!embed && !direct) return null;

  return (
    <figure className="media-embed">
      <div className="media-frame">
        {direct ? (
          <video controls preload="metadata" src={direct}>
            <track kind="captions" />
          </video>
        ) : (
          <iframe
            src={embed!.embedUrl}
            title={title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
      <figcaption>
        <span>{caption || title}</span>
        {embed && (
          <a
            className="caption-note"
            href={embed.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on {embed.provider === "youtube" ? "YouTube" : "Vimeo"}
          </a>
        )}
      </figcaption>
    </figure>
  );
}

/** Cover image that supports any external URL (Supabase storage, etc.). */
export function CoverImage({
  src,
  alt,
  caption,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  caption?: string;
  priority?: boolean;
}) {
  if (!src) return null;
  return (
    <figure className="cover-figure">
      <div className="cover-image">
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} />
        <span className="image-corner" />
      </div>
      {caption && (
        <figcaption>
          <span>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
