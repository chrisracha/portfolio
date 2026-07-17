"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { skills } from "@/data/skills";

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
              <h3 className="text-lg font-semibold text-white">{group.label}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                >
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

