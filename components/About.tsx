"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { socials } from "@/data/socials";

export default function About() {
  return (
    <section id="about" className="section-wrap scroll-mt-24">
      <SectionHeading
        eyebrow="About Me"
        title="Graphic design clarity with UI/UX engineering execution"
        description="I build UI systems that feel premium, ship fast, and scale across teams."
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          className="space-y-5 text-sm text-white/70"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p>
            I am a graphic design, UI/UX, and frontend engineer who loves translating complex requirements into elegant,
            high-performance experiences. My recent work focuses on design-driven interfaces, responsive systems, and
            accessibility-first UI.
          </p>
          <p>
            Strengths include UI systems, performance optimization, API integrations, and collaborating closely with
            cross-functional teams to deliver consistent, branded user journeys.
          </p>
          <p>
            I am looking for frontend or product engineering roles that value design thinking, scalability, and clean
            architecture. Outside of work, I enjoy building design prototypes and exploring cinematic storytelling.
          </p>
          <div className="flex flex-wrap gap-3">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:border-cyan-200/50 hover:text-cyan-200"
                aria-label={social.label}
              >
                {social.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass rounded-3xl p-6 shadow-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white">Quick Facts</h3>
          <div className="mt-4 space-y-4 text-sm text-white/70">
            <div className="flex items-start justify-between">
              <span>Location</span>
              <span className="text-white">Davao City, PH</span>
            </div>
            <div className="flex items-start justify-between">
              <span>Focus</span>
              <span className="text-white">Graphic Design + UI/UX</span>
            </div>
            <div className="flex items-start justify-between">
              <span>Availability</span>
              <span className="text-white">Open to part-time</span>
            </div>
            <div className="flex items-start justify-between">
              <span>Preferred Stack</span>
              <span className="text-white">Next.js + Tailwind</span>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-cyan-200/40 bg-cyan-300/10 p-4 text-xs text-cyan-100/90">
            Designing premium UI systems with a fast, iterative, and collaborative workflow.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

