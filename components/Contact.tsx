"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="section-wrap scroll-mt-24">
      <SectionHeading
        eyebrow="Contact"
        title="Let’s build something premium together"
        description="Open to collaborations, frontend roles, and design-engineering projects."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <motion.div
          className="glass rounded-3xl p-6 shadow-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white">Reach out directly</h3>
          <p className="mt-3 text-sm text-white/70">
            I respond quickly to thoughtful messages about product design, frontend engineering, and UI systems.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="mailto:cosalcedo@up.edu.ph" className="pill-button" aria-label="Email Chris">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.5l8 5 8-5V7H4Zm16 10V9.3l-7.4 4.6a1 1 0 0 1-1.2 0L4 9.3V17h16Z"
                />
              </svg>
              <span className="sr-only">Email</span>
            </a>
            <a
              href="https://linkedin.com/in/csosalcedo"
              className="pill-button dark"
              aria-label="LinkedIn profile"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3.2 6.2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM6 18h2.4v-7H6v7Zm4.2-7h2.3v1c.5-.8 1.5-1.2 2.7-1.2 2.1 0 3.6 1.3 3.6 4V18h-2.4v-3.4c0-1.4-.5-2.3-1.8-2.3-1 0-1.7.7-1.9 1.5-.1.2-.1.5-.1.8V18h-2.4v-7Z"
                />
              </svg>
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://github.com/chrisracha"
              className="pill-button dark"
              aria-label="GitHub profile"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.4-1-.9-1.2-.9-1.2-.8-.5.1-.5.1-.5 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .9.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.2-4.7-5.3 0-1.2.4-2.1 1-2.9-.1-.2-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.8 1 1.7 1 2.9 0 4.1-2.4 5-4.7 5.3.4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
                />
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://example.com/resume.pdf"
              className="pill-button dark"
              aria-label="Download resume"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 3a1 1 0 0 1 1 1v8.6l2.3-2.3 1.4 1.4-4.7 4.7-4.7-4.7 1.4-1.4 2.3 2.3V4a1 1 0 0 1 1-1Zm-7 14h14v2H5v-2Z"
                />
              </svg>
              <span className="sr-only">Resume</span>
            </a>
          </div>
        </motion.div>

        <motion.form
          className="glass rounded-3xl p-6 shadow-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white">Quick message</h3>
          <div className="mt-5 space-y-4 text-sm">
            <input
              aria-label="Your name"
              placeholder="Your name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-200/60 focus:outline-none"
            />
            <input
              aria-label="Your email"
              type="email"
              placeholder="Email address"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-200/60 focus:outline-none"
            />
            <textarea
              aria-label="Your message"
              placeholder="Tell me about your project..."
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-200/60 focus:outline-none"
            />
          </div>
          <button type="submit" className="pill-button mt-5">
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
}

