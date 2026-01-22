type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 space-y-4 text-center">
      <span className="inline-flex items-center rounded-full border border-cyan-200/40 bg-cyan-300/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200/80">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      {description ? <p className="mx-auto max-w-2xl text-sm text-white/70">{description}</p> : null}
    </div>
  );
}

