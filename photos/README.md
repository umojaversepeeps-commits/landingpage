# Umojaverse photo sources

Original Google Drive collections supplied by the owner:

- `arbitrum-pulse/`: https://drive.google.com/drive/folders/1HVpd353eCFPX03cG4GNJ7vjgIAd_5eds?usp=sharing
- `community/`: https://drive.google.com/drive/folders/1p_EuYRvLQ3Tv2KaML4FUilUVn3t1Hm9S

The first collection is identified by the owner as Arbitrum Pulse. The second collection is uncategorized; do not infer an event or location without evidence.

Review the originals before selecting photos. Preserve these source files and export optimized website copies to `public/images/`, with accurate alternative text and crops suited to desktop and mobile layouts.

## Selected local photos

Reviewed all five JPEGs in `/home/core/Downloads/Past Events-20260919T111524Z-1-005/Past Events/ARBITRUM-Ethiopia/` and selected these three. Original files in Downloads are unchanged.

| Original            | Website asset                              | Placement                            | Reason                                                              |
| ------------------- | ------------------------------------------ | ------------------------------------ | ------------------------------------------------------------------- |
| `ARBITRUM (20).jpg` | `arbitrum-pulse-ethiopia-group.webp`       | Home, About, Ethiopia program detail | Balanced group composition with room for a wide crop.               |
| `ARBITRUM (49).jpg` | `arbitrum-pulse-ethiopia-discussion.webp`  | Programs, Projects                   | A clear audience participation moment, showing the event in action. |
| `ARBITRUM (23).jpg` | `arbitrum-pulse-ethiopia-connections.webp` | Join                                 | A welcoming portrait of two participants beside the event banner.   |

Exports in `public/images/` are WebP, 2400 px wide for the group image and 1600 px for the other two. They retain natural color and use individual focal positions for responsive crops. Next.js serves appropriately sized versions to each device.

The group photo uses its full aspect ratio on mobile to avoid cropping participants out. Captions attribute all three photos to Arbitrum Pulse in Ethiopia. They are not presented as photos from the Kenya Builders Initiative.

## Photos from `select/`

The owner supplied six additional originals in `select/` at the repository root. They are the photos the site uses now; the three Arbitrum Pulse exports above are kept as unused alternatives.

| Original               | Website asset                          | Placement                       | Aspect |
| ---------------------- | -------------------------------------- | ------------------------------- | ------ |
| `select/AAA_8189.jpg`  | `community-group-banner.webp`          | Home hero (`group`)             | 3:2    |
| `select/IMG_8546 (1).jpg` | `community-audience-panorama.webp`   | About (`audience`, panorama)    | 2.17:1 |
| `select/IMG_5644.jpg`  | `community-seated-gathering.webp`      | Program detail (`gathering`)    | 3:2    |
| `select/AAA_8344.jpg`  | `community-table-discussion.webp`      | Programs (`discussion`)         | 3:2    |
| `select/AAA_8180.jpg`  | `community-builder-tables.webp`        | Projects (`workshop`)           | 3:2    |
| `select/IMG_5898.jpg`  | `community-cheerful-group.webp`        | Join (`connections`)            | 3:2    |

Exports are WebP at 2400 px wide for the three full-width placements and 1600 px for the rest, quality 80, natural color, each with its own focal position in `src/lib/photos.ts`.

The originals carry EXIF capture dates (24–30 May 2025) but no event name or location, so the site does not name an event for them: their caption note reads `Umojaverse community`. If an event is confirmed later, update `event` in `src/lib/photos.ts`.

Originals in `select/` are unchanged; the crops used on the site come from `object-position`, not separate files.

`ARBITRUM (13).jpg` is a near-duplicate group photo; `ARBITRUM (1).jpg` has a busier composition. The selected photos give the pages more visual variety.

The earlier Stitch screenshot crops remain as unused references; no live page uses them. `src/lib/photos.ts` defines the active assets, dimensions, alternative text, and focal positions.
