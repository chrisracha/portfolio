"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { projects } from "@/data/projects";

const stackIcons: Record<string, JSX.Element> = {
  "Next.js": (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20V2Zm1.4 3.3 5.3 13h-2.2l-1.2-3.3H9.2l-1.2 3.3H5.8l5.3-13h2.3Zm-3.4 8.6h4.4l-2.2-6.1-2.2 6.1Z"
      />
    </svg>
  ),
  React: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 10.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm0-6.7c2.4 0 4.6 2.5 5.7 5.9 3.2.9 5.3 2.4 5.3 3.6s-2.1 2.7-5.3 3.6c-1.1 3.4-3.3 5.9-5.7 5.9s-4.6-2.5-5.7-5.9C3.1 15.7 1 14.2 1 13s2.1-2.7 5.3-3.6C7.4 6 9.6 3.5 12 3.5Zm0 1.6c-1.5 0-3.2 2-4.1 4.9 1.4.3 2.9.5 4.1.5s2.7-.2 4.1-.5c-.9-2.9-2.6-4.9-4.1-4.9Zm-5 6.8c-2.4.7-3.9 1.7-3.9 2.1s1.5 1.4 3.9 2.1c-.2-1-.4-2-.4-2.1s.2-1.1.4-2.1Zm10 0c.2 1 .4 2 .4 2.1s-.2 1.1-.4 2.1c2.4-.7 3.9-1.7 3.9-2.1s-1.5-1.4-3.9-2.1Zm-9.1 5c.9 2.9 2.6 4.9 4.1 4.9s3.2-2 4.1-4.9c-1.4-.3-2.9-.5-4.1-.5s-2.7.2-4.1.5Z"
      />
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2 3h20v18H2V3Zm11.3 5.4H8.8v2h1.8v6h2v-6h1.7v-2Zm6.3 3.2c-.3-1.5-1.5-2.3-3.1-2.3-1.9 0-3.1 1-3.1 2.6 0 1.8 1.4 2.2 2.6 2.5 1 .2 1.8.4 1.8 1 0 .5-.4.8-1.1.8-.7 0-1.2-.4-1.3-1.1l-1.9.3c.3 1.7 1.8 2.6 3.4 2.6 1.9 0 3.1-1 3.1-2.6 0-1.9-1.5-2.3-2.7-2.5-1-.2-1.7-.4-1.7-1 0-.4.4-.7 1-.7.6 0 1 .3 1.1.9l1.9-.5Z"
      />
    </svg>
  ),
  Tailwind: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5c-2.7 0-4.5 1.4-5.4 4.1 1-1.4 2.1-1.9 3.4-1.6.7.2 1.2.6 1.8 1.2.9.9 1.8 1.8 4 1.8 2.7 0 4.5-1.4 5.4-4.1-1 1.4-2.1 1.9-3.4 1.6-.7-.2-1.2-.6-1.8-1.2-.9-.9-1.8-1.8-4-1.8Zm-5.4 9.9C7.5 12.3 9.3 11 12 11c2.2 0 3.1.9 4 1.8.6.6 1.1 1 1.8 1.2 1.3.3 2.4-.2 3.4-1.6-.9 2.7-2.7 4.1-5.4 4.1-2.2 0-3.1-.9-4-1.8-.6-.6-1.1-1-1.8-1.2-1.3-.3-2.4.2-3.4 1.6Z"
      />
    </svg>
  ),
  "Node.js": (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 7 3.9v7.8l-7 3.9-7-3.9V8.1l7-3.9Zm0 3.3c-2.3 0-3.8 1.2-3.8 3.3 0 1.6.9 2.5 2.5 2.9l1.1.3c.8.2 1.1.5 1.1 1.1 0 .6-.5 1-1.4 1-1 0-1.5-.5-1.7-1.4l-1.9.3c.2 1.7 1.6 2.6 3.5 2.6 2.2 0 3.6-1.1 3.6-3.1 0-1.7-1-2.6-2.6-3l-1.2-.3c-.7-.2-1-.5-1-1 0-.5.4-.9 1.2-.9.7 0 1.2.3 1.4 1l1.8-.5c-.3-1.3-1.4-2.1-3.6-2.1Z"
      />
    </svg>
  )
};

export default function Projects() {
  return (
    <section id="projects" className="section-wrap scroll-mt-24">
      <SectionHeading
        eyebrow="Featured Work"
        title="Projects that blend premium UI with real-world engineering"
      />
      <div className="space-y-10">
        {projects.map((project, index) => {
          const reverse = index % 2 !== 0;
          return (
            <motion.article
              key={project.id}
              className={`glass group grid gap-8 rounded-3xl p-6 shadow-card lg:grid-cols-[1.1fr_0.9fr] ${
                reverse ? "lg:grid-cols-[0.9fr_1.1fr]" : ""
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className={`${reverse ? "lg:order-2" : ""} space-y-5`}>
                <div
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${project.accent} p-3`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent)]" />
                  <img
                    src={project.image}
                    alt={`${project.name} preview`}
                    className="relative z-10 h-56 w-full rounded-xl object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-white/70">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
                    >
                      <span className="h-2 w-2 rounded-full bg-cyan-200/60" aria-hidden="true" />
                      <span>{tech}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">{project.year}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{project.name}</h3>
                  <p className="mt-3 text-sm text-white/70">{project.description}</p>
                </div>
                <p className="text-sm text-white/60">
                  <span className="text-cyan-200/80">Role:</span> {project.role} · UI/UX
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-button"
                    aria-label={`Open ${project.name} live demo`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M14 3h7v7h-2V6.4l-9.6 9.6-1.4-1.4L17.6 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"
                      />
                    </svg>
                    Live Demo
                  </a>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-button dark"
                    aria-label={`Open ${project.name} GitHub repository`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.4-1-.9-1.2-.9-1.2-.8-.5.1-.5.1-.5 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.2-4.7-5.3 0-1.2.4-2.1 1-2.9-.1-.2-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.8 1 1.7 1 2.9 0 4.1-2.4 5-4.7 5.3.4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
                      />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

