/** Hand-drawn gold SVG ornaments — stroke uses currentColor (set via text-accent). */

export function StarRosette({ className = "" }: { className?: string }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
    const r = i % 2 === 0 ? 10 : 4.4;
    return `${12 + r * Math.cos(a)},${12 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <polygon points={pts} fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-accent ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 12" className="h-3 w-24 sm:w-36">
        <line x1="0" y1="6" x2="100" y2="6" stroke="currentColor" strokeWidth="0.6" />
        <path d="M104 6 L110 2 L116 6 L110 10 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="96" cy="6" r="1.4" fill="currentColor" />
      </svg>
      <StarRosette className="h-7 w-7" />
      <svg viewBox="0 0 120 12" className="h-3 w-24 -scale-x-100 sm:w-36">
        <line x1="0" y1="6" x2="100" y2="6" stroke="currentColor" strokeWidth="0.6" />
        <path d="M104 6 L110 2 L116 6 L110 10 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="96" cy="6" r="1.4" fill="currentColor" />
      </svg>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`pointer-events-none absolute h-12 w-12 text-accent sm:h-16 sm:w-16 ${className}`} aria-hidden="true">
      <path d="M2 78 V14 Q2 2 14 2 H78" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M8 78 V20 Q8 8 20 8 H78" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <path d="M14 14 L24 8 L34 14 L24 20 Z M14 14 L8 24 L14 34 L20 24 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <polygon points="20,20 23,26 29,26 24,30 26,36 20,32 14,36 16,30 11,26 17,26" transform="translate(4 4) scale(0.8)" fill="currentColor" opacity="0.8" />
      <circle cx="44" cy="8" r="1.3" fill="currentColor" />
      <circle cx="8" cy="44" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function Corners() {
  return (
    <>
      <Corner className="left-2 top-2" />
      <Corner className="right-2 top-2 -scale-x-100" />
      <Corner className="bottom-2 left-2 -scale-y-100" />
      <Corner className="bottom-2 right-2 -scale-100" />
    </>
  );
}

export function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="eyebrow">{eyebrow}</p>
      <div className="mx-auto mt-4 h-px w-16 bg-accent/60" />
      <h2 className="mt-4 font-display text-4xl font-light italic text-foreground sm:text-5xl">{title}</h2>
      <div className="mx-auto mt-4 flex w-40 items-center gap-2 text-accent">
        <span className="h-px flex-1 bg-accent/50" />
        <StarRosette className="h-3 w-3" />
        <span className="h-px flex-1 bg-accent/50" />
      </div>
    </div>
  );
}
