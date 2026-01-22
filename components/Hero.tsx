"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="hero" className="section-wrap scroll-mt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200/80">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-glow" />
              Open to work
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-white/70">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-200" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 3a7 7 0 0 1 7 7c0 4.5-5.2 9.6-6.4 10.8a.9.9 0 0 1-1.2 0C10.2 19.6 5 14.5 5 10a7 7 0 0 1 7-7Zm0 3.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"
                />
              </svg>
              Davao City, PH
            </span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
              Chris Samuel Salcedo <span className="text-cyan-200">—</span> Graphic Design · UI/UX · Frontend
            </h1>
            <p className="max-w-xl text-base text-white/70 md:text-lg">
              I design and build premium, performance-focused web experiences for modern products. Specialized in
              scalable UI systems, accessibility, and frontend performance.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="pill-button">
              View Projects
            </a>
            <a href="#contact" className="pill-button dark">
              Contact
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-300/70" />
              UI Systems + Design Engineering
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-300/70" />
              Performance + API Integrations
            </div>
          </div>
        </div>

        <div className="relative min-h-[380px] p-4 lg:min-h-[480px] lg:p-8">
          <motion.div
            className="glass absolute left-6 top-4 w-48 rounded-2xl p-4 shadow-card"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <p className="text-xs text-white/70">Current focus</p>
            <p className="mt-2 text-sm font-semibold text-white">Graphic design + UI systems</p>
            <div className="mt-3 h-1 w-full rounded-full bg-white/10">
              <div className="h-1 w-2/3 rounded-full bg-cyan-300 shadow-glow" />
            </div>
          </motion.div>

          <motion.div
            className="glass absolute right-2 top-16 w-56 rounded-2xl p-4 shadow-card"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            <p className="text-xs text-white/70">Latest delivery</p>
            <p className="mt-2 text-sm font-semibold text-white">Blazor eLearning MVP</p>
            <p className="mt-2 text-xs text-cyan-200/80">Shipped in 8 weeks</p>
          </motion.div>

          <motion.div
            className="glass absolute bottom-6 left-12 w-60 rounded-2xl p-4 shadow-card"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <p className="text-xs text-white/70">Toolkit</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Next.js", "TypeScript", "Tailwind", "Figma"].map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 -z-10 rounded-[32px] border border-cyan-200/20 bg-gradient-to-br from-indigo-900/60 via-blue-900/40 to-transparent shadow-card"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
      </div>
    </section>
  );
}

