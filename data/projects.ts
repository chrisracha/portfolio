export type Project = {
  id: string;
  name: string;
  year: string;
  description: string;
  role: string;
  stack: string[];
  highlights: string[];
  links: {
    demo: string;
    github: string;
  };
  image: string;
  accent: string;
};

export const projects: Project[] = [
  {
    id: "suking-tindahan",
    name: "Suking Tindahan",
    year: "2025",
    description: "Mood-based Filipino film recommendation app that reduces decision fatigue with smart filtering and curated discovery.",
    role: "Backend + API Engineer",
    stack: ["Next.js", "TypeScript", "Tailwind", "TMDb API", "Node.js"],
    highlights: ["Emotion-driven recommendations", "Custom REST endpoints", "Deep filters by rating, runtime, decade"],
    links: {
      demo: "https://suking-tindahan.vercel.app",
      github: "https://github.com/chrisracha/suking-tindahan"
    },
    image: "https://raw.githubusercontent.com/chrisracha/suking-tindahan/refs/heads/main/public/images/suking-tindahan.PNG",
    accent: "from-cyan-400/40 to-blue-600/30"
  },
  {
    id: "csrs-customizer",
    name: "CSRS Customizer",
    year: "2025",
    description: "Chrome extension that enhances the UP Mindanao CSRS UI with custom themes and automatic GWA computation.",
    role: "Frontend Engineer",
    stack: ["JavaScript", "HTML", "CSS", "Chrome Extensions"],
    highlights: ["UI personalization controls", "Inline GWA calculator", "Accessibility-friendly layout"],
    links: {
      demo: "https://youtu.be/QA9br-gT9oE",
      github: "https://github.com/chrisracha/csrs-customizer"
    },
    image: "https://raw.githubusercontent.com/chrisracha/csrs-customizer/refs/heads/main/screenshot.png",
    accent: "from-indigo-500/40 to-blue-500/30"
  },
  {
    id: "elearningapp",
    name: "eLearningApp",
    year: "2025",
    description: "A full-featured online learning platform with course management, enrollment, and interactive learning flows.",
    role: "Full Stack Engineer",
    stack: [".NET", "Blazor", "C#", "SQL Server", "HTML/CSS"],
    highlights: ["Course + enrollment management", "Role-based experiences", "Responsive learning UI"],
    links: {
      demo: "https://elearning-chrssml.azurewebsites.net/",
      github: "https://github.com/chrisracha/elearningapp"
    },
    image: "https://github.com/user-attachments/assets/ac9844f0-5469-495c-8ec8-a0217eb3cd2d",
    accent: "from-blue-500/40 to-purple-500/30"
  },
  {
    id: "dmpcs-dashboard",
    name: "DMPCS Dashboard",
    year: "2024",
    description: "A responsive analytics dashboard for the Department of Mathematics and Computer Science with interactive charts.",
    role: "Frontend Engineer  · UI/UX",
    stack: ["PHP", "MySQL", "Chart.js", "HTML/CSS"],
    highlights: ["Interactive data visualizations", "Mobile-first layout", "Stakeholder-ready reporting"],
    links: {
      demo: "https://chrisracha.github.io/dmpcs-dashboard",
      github: "https://github.com/chrisracha/dmpcs-dashboard"
    },
    image: "https://raw.githubusercontent.com/chrisracha/dmpcs-dashboard/refs/heads/with-backend/images/dmpcs-snapshot.png",
    accent: "from-indigo-400/40 to-cyan-400/30"
  },
  {
    id: "valoverse",
    name: "Valoverse",
    year: "2023",
    description: "A Valorant fan site with agent profiles, stats, and user-generated content using PHP + MySQL.",
    role: "Full Stack Engineer  · UI/UX",
    stack: ["PHP", "MySQL", "HTML/CSS", "JavaScript"],
    highlights: ["Agent database + CRUD", "User submissions", "Performance-optimized pages"],
    links: {
      demo: "https://chrisracha.github.io/valoverse",
      github: "https://github.com/chrisracha/valoverse"
    },
    image: "https://raw.githubusercontent.com/chrisracha/valoverse/refs/heads/main/images/valoverse-snapshot.png",
    accent: "from-sky-400/40 to-indigo-500/30"
  },
  {
    id: "osa-website",
    name: "OSA Website",
    year: "2022",
    description: "UP Mindanao OSA website project showcasing responsive layouts and information architecture for student services.",
    role: "Frontend Engineer  · UI/UX",
    stack: ["HTML", "CSS", "JavaScript"],
    highlights: ["Information architecture planning", "Responsive UI build", "Content-focused layout"],
    links: {
      demo: "https://chrisracha.github.io/osa-website",
      github: "https://github.com/chrisracha/osa-website"
    },
    image: "https://github.com/chrisracha/osa-website/raw/main/snapshot.png",
    accent: "from-cyan-500/40 to-indigo-400/30"
  }
];

