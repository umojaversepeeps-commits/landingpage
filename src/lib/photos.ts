// Originals are mapped in photos/README.md. Keep event attribution with each photo.
export const communityPhotos = {
  group: {
    src: "/images/community-group-banner.webp",
    width: 2400,
    height: 1602,
    alt: "Community members gathered together for a group photograph at a Umojaverse event",
    event: "Umojaverse community",
    position: "50% 42%",
  },
  audience: {
    src: "/images/community-audience-panorama.webp",
    width: 2400,
    height: 1106,
    alt: "Rows of attendees seated and listening during a Umojaverse session",
    event: "Umojaverse community",
    position: "50% 45%",
  },
  gathering: {
    src: "/images/community-seated-gathering.webp",
    width: 2400,
    height: 1600,
    alt: "Community members seated together in a room at a Umojaverse gathering",
    event: "Umojaverse community",
    position: "50% 40%",
  },
  discussion: {
    src: "/images/community-table-discussion.webp",
    width: 1600,
    height: 1068,
    alt: "Developers talking through ideas together around tables at a workshop",
    event: "Umojaverse community",
    position: "50% 45%",
  },
  workshop: {
    src: "/images/community-builder-tables.webp",
    width: 1600,
    height: 1068,
    alt: "Builders working on laptops around a shared table at a community session",
    event: "Umojaverse community",
    position: "50% 50%",
  },
  connections: {
    src: "/images/community-cheerful-group.webp",
    width: 1600,
    height: 1067,
    alt: "Community members smiling and celebrating together after a session",
    event: "Umojaverse community",
    position: "50% 45%",
  },
} as const;

export type CommunityPhoto = keyof typeof communityPhotos;
