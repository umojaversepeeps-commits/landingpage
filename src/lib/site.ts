import type { Post, Program } from "./content-types";

export const site = {
  name: "Umojaverse",
  description:
    "A community of African developers learning Web3, building useful products, and connecting through workshops and events.",
  x: "https://x.com/UmojaverseDevs",
  community:
    process.env.NEXT_PUBLIC_COMMUNITY_URL || "https://x.com/UmojaverseDevs",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/programs", label: "Programs" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/partners", label: "Partners" },
];

export const sources = {
  report:
    "https://forum.arbitrum.foundation/t/final-report-arbitrum-builders-initiative-on-questbook/28070",
  kabarak:
    "https://kabarak.ac.ke/sset-news/umojaverse-kabu-tour-engaging-students-in-blockchain-innovation",
  ethiopia: "https://luma.com/dj9rsc3h",
};

/**
 * Offline fallback content. The site reads live content from Supabase when it
 * is configured; otherwise these seed entries keep every page rendering.
 */
export const seedPrograms: Program[] = [
  {
    slug: "arbitrum-builders-initiative",
    title: "Arbitrum Builders Initiative",
    category: "Campus tour",
    location: "Kenya · Campus & online",
    period: "2024 program",
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    description:
      "Practical blockchain workshops, campus ideathons, and a virtual hackerhouse. A shared starting point for developers turning curiosity into working ideas.",
    overview:
      "The initiative connected students across five Kenyan universities through workshops and ideathons, followed by a virtual hackerhouse. Participants explored blockchain fundamentals and Arbitrum, developed ideas, and worked with mentors to take them further.",
    body: "",
    highlights: [
      "Learn blockchain fundamentals through practical workshops.",
      "Find collaborators and develop an idea during campus ideathons.",
      "Continue building with technical guidance in a virtual hackerhouse.",
    ],
    coverImageUrl: null,
    videoUrl: null,
    source: sources.report,
    sourceLabel: "Read the program report",
    published: true,
  },
  {
    slug: "kabarak-campus-workshop",
    title: "Umojaverse at Kabarak",
    category: "Campus tour",
    location: "Kabarak University · Kenya",
    period: "5 October 2024",
    startDate: "2024-10-05",
    endDate: "2024-10-05",
    description:
      "An introduction to blockchain and Arbitrum, followed by a collaborative ideathon where students explored problems and pitched possible solutions.",
    overview:
      "The Kabarak campus visit brought students together for presentations, discussion, and an ideathon. Teams put their learning into practice by proposing blockchain solutions and sharing their ideas with the wider group.",
    body: "",
    highlights: [
      "An accessible introduction to blockchain and Arbitrum.",
      "Team-based exploration of ideas and practical problems.",
      "A chance to present ideas and connect with other student builders.",
    ],
    coverImageUrl: null,
    videoUrl: null,
    source: sources.kabarak,
    sourceLabel: "Read Kabarak’s event recap",
    published: true,
  },
];

export const seedPosts: Post[] = [
  {
    slug: "welcome-to-the-umojaverse-blog",
    title: "Welcome to the Umojaverse blog",
    excerpt:
      "Notes from our workshops and campus tours, stories from the people building with us, and practical guides for African developers getting into Web3.",
    body: [
      "This is where we share what we learn while building community across Africa.",
      "",
      "Expect recaps from workshops and campus tours, profiles of builders, and practical walkthroughs you can follow at your own pace.",
      "",
      "## What you can expect",
      "",
      "- **Program updates** — what we ran, what worked, and what we learned.",
      "- **Builder stories** — people turning curiosity into working products.",
      "- **Practical guides** — step-by-step notes you can build on.",
      "",
      "You can also embed video in any post by adding a YouTube or Vimeo link in the editor.",
    ].join("\n"),
    coverImageUrl: "/images/community-builder-tables.webp",
    videoUrl: null,
    author: "Umojaverse",
    tags: ["Community"],
    published: true,
    publishedAt: "2024-12-01T09:00:00.000Z",
  },
];
