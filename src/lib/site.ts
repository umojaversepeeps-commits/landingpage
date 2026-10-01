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

export type Program = {
  slug: string;
  title: string;
  category: "Campus tour" | "Bootcamp" | "Build sprint";
  status: "Past event";
  location: string;
  period: string;
  description: string;
  overview: string;
  highlights: string[];
  source: string;
  sourceLabel: string;
};

export const programs: Program[] = [
  {
    slug: "arbitrum-builders-initiative",
    title: "Arbitrum Builders Initiative",
    category: "Campus tour",
    status: "Past event",
    location: "Kenya · Campus & online",
    period: "2024 program",
    description:
      "Practical blockchain workshops, campus ideathons, and a virtual hackerhouse. A shared starting point for developers turning curiosity into working ideas.",
    overview:
      "The initiative connected students across five Kenyan universities through workshops and ideathons, followed by a virtual hackerhouse. Participants explored blockchain fundamentals and Arbitrum, developed ideas, and worked with mentors to take them further.",
    highlights: [
      "Learn blockchain fundamentals through practical workshops.",
      "Find collaborators and develop an idea during campus ideathons.",
      "Continue building with technical guidance in a virtual hackerhouse.",
    ],
    source: sources.report,
    sourceLabel: "Read the program report",
  },
  {
    slug: "kabarak-campus-workshop",
    title: "Umojaverse at Kabarak",
    category: "Campus tour",
    status: "Past event",
    location: "Kabarak University · Kenya",
    period: "5 October 2024",
    description:
      "An introduction to blockchain and Arbitrum, followed by a collaborative ideathon where students explored problems and pitched possible solutions.",
    overview:
      "The Kabarak campus visit brought students together for presentations, discussion, and an ideathon. Teams put their learning into practice by proposing blockchain solutions and sharing their ideas with the wider group.",
    highlights: [
      "An accessible introduction to blockchain and Arbitrum.",
      "Team-based exploration of ideas and practical problems.",
      "A chance to present ideas and connect with other student builders.",
    ],
    source: sources.kabarak,
    sourceLabel: "Read Kabarak’s event recap",
  },
  {
    slug: "arbitrum-pulse-ethiopia",
    title: "Arbitrum Pulse Bootcamp",
    category: "Bootcamp",
    status: "Past event",
    location: "Addis Ababa · Ethiopia",
    period: "Past edition",
    description:
      "An introduction to the Arbitrum ecosystem, with practical workshops, conversations, and collaborative exploration of local blockchain applications.",
    overview:
      "The Ethiopia edition of Arbitrum Pulse brought developers and blockchain-curious participants together in Addis Ababa. The event listing describes workshops covering Arbitrum, Stylus, and Orbit, alongside discussions and collaborative activities.",
    highlights: [
      "Explore the Arbitrum ecosystem and its developer tools.",
      "Meet other builders and discuss locally relevant applications.",
      "Learn through workshops, conversations, and collaborative activities.",
    ],
    source: sources.ethiopia,
    sourceLabel: "View the original event listing",
  },
];
