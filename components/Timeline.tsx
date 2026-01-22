"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { timeline } from "@/data/timeline";

export default function Timeline() {
  return (
    <section id="timeline" className="section-wrap scroll-mt-24">
      <SectionHeading
        eyebrow="Experience"
        title="Roles, leadership, and education"
        description="A timeline of the impact-driven roles and academic foundation behind my product work."
      />
      <div className="relative space-y-6">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-cyan-300/60 via-cyan-300/20 to-transparent md:left-6" />
        {timeline.map((item) => (
          <motion.div
            key={item.id}
            className="relative ml-10 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-xl md:ml-14"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="absolute -left-8 top-6 flex h-4 w-4 items-center justify-center rounded-full border border-cyan-200/50 bg-cyan-300/30 shadow-glow md:-left-10">
              <span className="h-2 w-2 rounded-full bg-cyan-200" />
            </span>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-cyan-200/80">{item.type.toUpperCase()}</p>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/70">
                  {item.organization} · {item.location}
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">{item.date}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

