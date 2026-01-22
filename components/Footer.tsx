import { socials } from "@/data/socials";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-indigoDeep/80">
      <div className="section-wrap flex flex-col items-center justify-between gap-4 py-8 text-xs text-white/50 md:flex-row">
        <p>© 2026 Chris Samuel Salcedo. Built with Next.js + TailwindCSS.</p>
        <div className="flex items-center gap-4">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              aria-label={social.label}
              className="transition hover:text-cyan-200"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

