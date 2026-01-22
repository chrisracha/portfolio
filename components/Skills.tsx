"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { skills } from "@/data/skills";

const groupIconMap: Record<string, JSX.Element> = {
  frontend: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 6h16v10H4V6Zm0-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm4 14h8v2H8v-2Z"
      />
    </svg>
  ),
  backend: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h16v4H4V4Zm0 6h16v10H4V10Zm4 2v6h2v-6H8Zm6 0v6h2v-6h-2Z"
      />
    </svg>
  ),
  databases: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M12 3c-4.4 0-8 1.3-8 3s3.6 3 8 3 8-1.3 8-3-3.6-3-8-3Zm0 8c-4.4 0-8-1.3-8-3v4c0 1.7 3.6 3 8 3s8-1.3 8-3V8c0 1.7-3.6 3-8 3Zm0 6c-4.4 0-8-1.3-8-3v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4c0 1.7-3.6 3-8 3Z" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 7.5a4.5 4.5 0 0 1-6.1 4.2l-6.9 6.9a2 2 0 0 1-2.8 0l-1.1-1.1a2 2 0 0 1 0-2.8l6.9-6.9A4.5 4.5 0 0 1 17.5 3a4.4 4.4 0 0 1-.7 2.4l-2.1 2.1 1.8 1.8 2.1-2.1A4.4 4.4 0 0 1 21 7.5Z"
      />
    </svg>
  ),
  testing: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M7 3h10l1 4h3v2H3V7h3l1-4Zm2 0-1 4h8l-1-4H9Zm-4 8h14v10H5V11Zm3 3v4h2v-4H8Zm6 0v4h2v-4h-2Z" />
    </svg>
  ),
  exploring: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5.5v13L12 22l8-3.5v-13L12 2Zm0 2.1 6 2.6v10.6l-6 2.6-6-2.6V6.7l6-2.6Zm-1 3.4h2v6h-2v-6Zm0 7.5h2v2h-2v-2Z"
      />
    </svg>
  )
};

const itemIconMap: Record<string, JSX.Element> = {
  code: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M8.7 16.7 4 12l4.7-4.7 1.4 1.4L6.8 12l3.3 3.3-1.4 1.4Zm6.6 0-1.4-1.4L17.2 12l-3.3-3.3 1.4-1.4L20 12l-4.7 4.7Z" />
    </svg>
  ),
  framework: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M4 6h16v12H4V6Zm2 2v8h12V8H6Zm2 2h8v4H8v-4Z" />
    </svg>
  ),
  style: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M4 4h16v2H4V4Zm0 6h16v2H4v-2Zm0 6h10v2H4v-2Z" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M12 3c-4.4 0-8 1.3-8 3s3.6 3 8 3 8-1.3 8-3-3.6-3-8-3Zm0 6c-4.4 0-8-1.3-8-3v4c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0 1.7-3.6 3-8 3Zm0 6c-4.4 0-8-1.3-8-3v4c0 1.7 3.6 3 8 3s8-1.3 8-3v-4c0 1.7-3.6 3-8 3Z" />
    </svg>
  ),
  tool: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M19.4 13.5a6.9 6.9 0 0 1-7.9-8.9l-3.3 3.3 4.9 4.9-6.8 6.8-2.1-2.1 6.8-6.8-4.9-4.9L9.4 2a8.9 8.9 0 0 0 9.9 11.5l2.2 2.2-2.1 2.1-2-2.2Z" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M4 5h7l1 2h8v12H4V5Zm2 2v10h12V9h-7l-1-2H6Zm2 2h4v2H8V9Zm0 4h6v2H8v-2Z" />
    </svg>
  ),
  testing: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M7 3h10l1 4h3v2H3V7h3l1-4Zm2 0-1 4h8l-1-4H9Zm-4 8h14v10H5V11Zm3 3v4h2v-4H8Zm6 0v4h2v-4h-2Z" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path fill="currentColor" d="M7 18h10a4 4 0 0 0 .3-8A5.5 5.5 0 0 0 7 7.5a4.5 4.5 0 0 0 0 9Z" />
    </svg>
  )
};

const specificIconMap: Record<string, JSX.Element> = {
  Git: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 3 11l9 9 9-9-9-9Zm0 3.2 6 6-1.6 1.6a2 2 0 0 0-2.4-.4l-3-3a2 2 0 1 0-1.8 1.1l3 3a2 2 0 1 0 3.7 1.3l1.6-1.6-6 6-6-6 6-6Z"
      />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.4-1-.9-1.2-.9-1.2-.8-.5.1-.5.1-.5 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.2-4.7-5.3 0-1.2.4-2.1 1-2.9-.1-.2-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.8 1 1.7 1 2.9 0 4.1-2.4 5-4.7 5.3.4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
      />
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 6h3v3H7V6Zm4 0h3v3h-3V6Zm-4 4h3v3H7v-3Zm4 0h3v3h-3v-3Zm4 0h3v3h-3v-3Zm4 1h2a4 4 0 0 1-4 6H8a4 4 0 0 1-4-4v-1h15Z"
      />
    </svg>
  ),
  Linux: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2c-3.3 0-5.2 3.1-5.2 6.1 0 1.6.3 2.6.9 3.9l-2.7 3.4c-.6.7-.3 1.8.6 2.2l1.8.7c.6.2 1.2 0 1.6-.5l1.1-1.4 1.1 1.4c.4.5 1 .7 1.6.5l1.8-.7c.9-.4 1.2-1.5.6-2.2l-2.7-3.4c.6-1.3.9-2.3.9-3.9C17.2 5.1 15.3 2 12 2Zm-2 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
      />
    </svg>
  )
};

export default function Skills() {
  return (
    <section id="skills" className="section-wrap scroll-mt-24">
      <SectionHeading
        eyebrow="Tech Stack"
        title="Modern tools for fast, reliable, and beautiful web experiences"
        description="A balanced stack across frontend, backend, and product delivery with performance and accessibility at the core."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((group) => (
          <motion.div
            key={group.id}
            className="glass rounded-2xl p-6 shadow-card transition hover:-translate-y-1 hover:border-cyan-200/40"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              {groupIconMap[group.id]}
              <h3 className="text-lg font-semibold text-white">{group.label}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {specificIconMap[item.label] ?? itemIconMap[item.icon]}
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

