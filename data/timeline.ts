export type TimelineItem = {
  id: string;
  type: "role" | "education" | "leadership";
  title: string;
  organization: string;
  location: string;
  date: string;
  bullets: string[];
};

export const timeline: TimelineItem[] = [
  {
    id: "rapid-signal",
    type: "role",
    title: "Software Engineer Intern",
    organization: "RapidSignal Electronics",
    location: "General Santos City",
    date: "Jun 2025 — Aug 2025",
    bullets: [
      "Built an eLearning Blazor WASM MVP using ASP.NET and reusable UI components.",
      "Delivered architecture wireframes and UML diagrams with Sparx Enterprise Architect.",
      "Designed SQL Server schemas with optimized queries and data integrity checks."
    ]
  },
  {
    id: "himati-web",
    type: "role",
    title: "Web Manager",
    organization: "HIMATI, Official Student Publication",
    location: "Davao City",
    date: "Sep 2024 — Jun 2025",
    bullets: [
      "Led ongoing development for the publication website and ensured delivery cadence.",
      "Translated Figma UI into responsive Next.js components with consistent branding.",
      "Collaborated with editorial teams to align digital experiences with print identity."
    ]
  },
  {
    id: "leadership",
    type: "leadership",
    title: "Deputy Design Lead",
    organization: "Google Developer Group Davao",
    location: "Davao City",
    date: "2025",
    bullets: ["Directed visual systems for events, social campaigns, and community workshops."]
  },
  {
    id: "education",
    type: "education",
    title: "BS Computer Science",
    organization: "University of the Philippines Mindanao",
    location: "Mintal, Davao City",
    date: "Sep 2022 — Jun 2026",
    bullets: ["Focus: UI systems, software engineering, and data-intensive applications."]
  }
];

