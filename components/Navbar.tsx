"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "timeline", label: "Timeline" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" }
];

export default function Navbar() {
  const [active, setActive] = useState("hero");

  const handleScroll = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-32 bg-gradient-to-b from-[#040818] via-[#0a1436]/80 to-transparent" />
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
          <span className="inline-flex h-2 w-2 rounded-full bg-cyan-300 shadow-glow" />
          Chris Samuel Salcedo
        </div>
        <nav className="glass hidden items-center gap-6 rounded-full px-5 py-3 text-sm font-medium text-white/80 md:flex">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-label={`Scroll to ${section.label}`}
                onClick={handleScroll(section.id)}
                className="relative py-1 transition-colors duration-300 hover:text-cyan-100"
              >
                <motion.span
                  animate={{ color: isActive ? "#a5f3fc" : "rgba(255,255,255,0.8)" }}
                  transition={{ duration: 0.3 }}
                >
                  {section.label}
                </motion.span>
                {isActive && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-cyan-300/80 shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
