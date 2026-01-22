export type SkillIcon =
  | "code"
  | "framework"
  | "style"
  | "database"
  | "tool"
  | "design"
  | "testing"
  | "cloud";

export type SkillItem = {
  label: string;
  icon: SkillIcon;
};

export type SkillGroup = {
  id: string;
  label: string;
  items: SkillItem[];
};

export const skills: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { label: "HTML5", icon: "code" },
      { label: "CSS3", icon: "style" },
      { label: "JavaScript", icon: "code" },
      { label: "TypeScript", icon: "code" },
      { label: "React", icon: "framework" },
      { label: "Next.js", icon: "framework" },
      { label: "Tailwind CSS", icon: "style" },
      { label: "Bootstrap", icon: "style" }
    ]
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      { label: "Node.js", icon: "framework" },
      { label: "Express.js", icon: "framework" },
      { label: "PHP", icon: "code" },
      { label: "Python", icon: "code" },
      { label: "Java", icon: "code" },
      { label: "C", icon: "code" },
      { label: "C++", icon: "code" }
    ]
  },
  {
    id: "databases",
    label: "Databases",
    items: [
      { label: "MySQL", icon: "database" },
      { label: "MongoDB", icon: "database" }
    ]
  },
  {
    id: "tools",
    label: "Tools + Design",
    items: [
      { label: "Git", icon: "tool" },
      { label: "GitHub", icon: "tool" },
      { label: "Docker", icon: "tool" },
      { label: "Linux", icon: "tool" },
      { label: "Figma", icon: "design" },
      { label: "Adobe Photoshop", icon: "design" },
      { label: "Adobe Illustrator", icon: "design" },
      { label: "Adobe InDesign", icon: "design" },
      { label: "Canva", icon: "design" }
    ]
  },
  {
    id: "testing",
    label: "Testing",
    items: [
      { label: "Playwright", icon: "testing" },
      { label: "Jest", icon: "testing" },
      { label: "Cypress", icon: "testing" }
    ]
  },
  {
    id: "exploring",
    label: "Currently Exploring",
    items: [
      { label: "C#", icon: "code" },
      { label: "ASP.NET", icon: "framework" },
      { label: "Blazor", icon: "framework" },
      { label: "Django", icon: "framework" },
      { label: "Microsoft Azure", icon: "cloud" }
    ]
  }
];

