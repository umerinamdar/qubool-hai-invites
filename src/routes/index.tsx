import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import sealedBackdrop from "@/assets/sealed-backdrop.jpg";
import heroBackdrop from "@/assets/hero-backdrop.jpg";
import waxSeal from "@/assets/wax-seal.png";
import paperTexture from "@/assets/paper-texture.jpg";
import { Corners, Divider, Heading, StarRosette } from "@/components/ornaments";
import { ScratchCard } from "@/components/scratch-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — Nikah, 14 February 2027" },
      { name: "description", content: "You are warmly invited to the Nikah of Aarav & Anaya at The Grand Pavilion, 14 February 2027." },
      { property: "og:title", content: "Aarav & Anaya — Qubool Hai" },
      { property: "og:description", content: "Join us for the Nikah of Aarav & Anaya, 14 February 2027 at The Grand Pavilion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

// All times anchored to India Standard Time (+05:30)
const WEDDING = new Date("2027-02-14T19:00:00+05:30");
const EVENTS = [
  { name: "Mehendi", when: "2027-02-12T17:00:00+05:30", place: "The Courtyard, The Grand Pavilion", note: "Evening of henna & music" },
  { name: "Nikah", when: "2027-02-14T19:00:00+05:30", place: "The Grand Pavilion", note: "Ceremony followed by dinner" },
  { name: "Walima", when: "2027-02-15T20:00:00+05:30", place: "The Lantern Hall, The Grand Pavilion", note: "Reception & celebration" },
];
const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso));
const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(new Date(iso));

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - (now ?? target.getTime()));
  return [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;
}

function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);
}

function Invitation() {
  const [stage, setStage] = useState<"sealed" | "opening" | "open">("sealed");
  useReveal(stage !== "sealed");

  useEffect(() => {
    document.body.style.overflow = stage === "open" ? "" : "hidden";
  }, [stage]);

  const open = () => {
    if (stage !== "sealed") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStage("opening");
    setTimeout(() => setStage("open"), reduced ? 50 : 2200);
  };

  const paperVar = { "--paper-img": `url(${paperTexture})` } as CSSProperties;

  return (
    <main style={paperVar} className="min-h-screen bg-background">
      {stage !== "open" && <Envelope opening={stage === "opening"} onOpen={open} />}
      <Hero />
      <Countdown />
      <Events />
      <Venue />
      <Rsvp />
      <Footer />
    </main>
  );
}

function Envelope({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  const half = (side: "left" | "right"): CSSProperties => ({
    backgroundImage: `url(${sealedBackdrop})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
    transform: opening ? `translateX(${side === "left" ? "-55%" : "55%"})` : "none",
    transition: "transform 1.8s cubic-bezier(.7,0,.2,1) .35s",
  });
  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-500 ${opening ? "delay-[1700ms] opacity-0" : ""}`}>
      <div className="absolute inset-0" style={half("left")} />
      <div className="absolute inset-0" style={half("right")} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_100%)] opacity-70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <button
          onClick={onOpen}
          aria-label="Break the seal to open the invitation"
          className={`relative w-[38vmin] max-w-[260px] min-w-[150px] transition-all duration-700 ${opening ? "scale-125 opacity-0" : "seal-pulse"}`}
        >
          <img src={waxSeal} alt="" width={816} height={816} className="w-full drop-shadow-2xl" />
          <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.6rem,6vmin,2.8rem)] italic text-highlight [text-shadow:0_1px_0_var(--paper-dark),0_-1px_0_color-mix(in_oklab,var(--highlight)_40%,transparent)]">
            A<span className="mx-1 text-[0.6em] not-italic">&amp;</span>A
          </span>
        </button>
        <p className={`eyebrow mt-8 rounded-full bg-background/60 px-5 py-2 backdrop-blur-sm transition-opacity ${opening ? "opacity-0" : "rise"}`}>
          Tap the seal to open
        </p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-20">
      <img src={heroBackdrop} alt="" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--background)_55%,transparent)_0%,transparent_55%),linear-gradient(to_bottom,transparent_60%,var(--background))]" />
      <div className="lamp-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,color-mix(in_oklab,var(--highlight)_18%,transparent),transparent_25%),radial-gradient(circle_at_85%_25%,color-mix(in_oklab,var(--highlight)_18%,transparent),transparent_25%)]" />
      <div className="relative text-center">
        <p className="eyebrow rise">Bismillah · Together with their families</p>
        <h1 className="rise mt-8 font-display font-light leading-[0.9] [animation-delay:.3s]">
          <span className="foil-text block text-[clamp(3.5rem,14vw,9rem)]">Aarav</span>
          <span className="my-2 block font-display text-[clamp(1.5rem,5vw,3rem)] italic text-accent">&amp;</span>
          <span className="foil-text block text-[clamp(3.5rem,14vw,9rem)]">Anaya</span>
        </h1>
        <p className="rise mt-6 font-display text-xl italic text-foreground/85 [animation-delay:.6s] sm:text-2xl">Qubool Hai</p>
        <div className="rise gold-frame mx-auto mt-10 max-w-xs px-8 py-6 [animation-delay:.9s]">
          <StarRosette className="mx-auto h-5 w-5 text-accent" />
          <p className="mt-3 eyebrow">Sunday</p>
          <p className="mt-2 font-display text-3xl text-foreground">14 February 2027</p>
          <div className="mx-auto my-3 h-px w-12 bg-accent/60" />
          <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">The Grand Pavilion</p>
        </div>
      </div>
    </section>
  );
}

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="paper-ground relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="reveal relative mx-auto max-w-3xl px-6 py-14 sm:px-12 sm:py-20">
        <Corners />
        {children}
      </div>
      <Divider className="absolute -bottom-3.5 left-0 right-0 z-10" />
    </section>
  );
}

function Countdown() {
  const parts = useCountdown(WEDDING);
  return (
    <Section>
      <Heading eyebrow="Counting the moments" title="Until We Say Qubool" />
      <div className="grid grid-cols-4 gap-2 sm:gap-5">
        {parts.map(([label, v]) => (
          <div key={label} className="gold-frame px-1 py-5 text-center sm:py-8">
            <p className="font-display text-3xl tabular-nums text-highlight sm:text-5xl">{String(v).padStart(2, "0")}</p>
            <p className="mt-2 text-[0.55rem] tracking-[0.25em] text-muted-foreground uppercase sm:text-xs">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-14 text-center">
        <p className="eyebrow mb-5">A little secret</p>
        <ScratchCard>
          <div className="text-center">
            <p className="font-display text-4xl text-highlight">14 · 02 · 2027</p>
            <p className="mt-1 text-xs tracking-[0.25em] text-muted-foreground uppercase">Save the date</p>
          </div>
        </ScratchCard>
      </div>
    </Section>
  );
}

function Events() {
  return (
    <Section>
      <Heading eyebrow="The celebrations" title="Order of Events" />
      <div className="space-y-6">
        {EVENTS.map((e) => (
          <article key={e.name} className="gold-frame px-6 py-8 text-center sm:px-10">
            <StarRosette className="mx-auto h-6 w-6 text-accent" />
            <h3 className="mt-3 font-display text-3xl italic text-foreground sm:text-4xl">{e.name}</h3>
            <div className="mx-auto my-4 h-px w-20 bg-[image:var(--gold-foil)]" />
            <p className="text-sm tracking-[0.15em] text-foreground/90 uppercase">{fmtDate(e.when)}</p>
            <p className="mt-1 font-display text-xl text-accent">{fmtTime(e.when)} IST</p>
            <p className="mt-3 text-sm text-muted-foreground">{e.place}</p>
            <p className="mt-1 font-display italic text-muted-foreground">{e.note}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Venue() {
  return (
    <Section>
      <Heading eyebrow="Where" title="The Grand Pavilion" />
      <div className="text-center">
        <p className="font-display text-xl leading-relaxed text-foreground/90">
          Beneath carved arches and lantern light,
          <br className="hidden sm:block" /> we gather to begin our forever.
        </p>
        <p className="mt-6 text-sm tracking-[0.15em] text-muted-foreground uppercase">Address to be shared</p>
        <a
          href="https://maps.google.com/?q=The+Grand+Pavilion"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block border border-accent px-8 py-3 text-xs tracking-[0.3em] text-accent uppercase transition-colors hover:bg-accent hover:text-background"
        >
          Open in Maps
        </a>
      </div>
    </Section>
  );
}

function Rsvp() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  const field = "w-full border-0 border-b border-accent/40 bg-transparent px-1 py-3 font-display text-lg text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none";
  return (
    <Section id="rsvp">
      <Heading eyebrow="Kindly reply by 14 January 2027" title="Will You Join Us?" />
      {sent ? (
        <div className="text-center">
          <StarRosette className="mx-auto h-10 w-10 text-accent" />
          <p className="mt-4 font-display text-3xl italic text-foreground">Shukriya</p>
          <p className="mt-2 text-muted-foreground">Your reply has been received with joy.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mx-auto max-w-md space-y-6">
          <input required placeholder="Your full name" className={field} aria-label="Full name" />
          <select required defaultValue="" className={field} aria-label="Attendance">
            <option value="" disabled className="bg-surface">Will you attend?</option>
            <option className="bg-surface">Joyfully accepts</option>
            <option className="bg-surface">Regretfully declines</option>
          </select>
          <input type="number" min={1} max={10} placeholder="Number of guests" className={field} aria-label="Number of guests" />
          <textarea rows={2} placeholder="A blessing for the couple" className={field} aria-label="Message" />
          <button className="w-full bg-[image:var(--gold-foil)] py-4 text-xs font-medium tracking-[0.35em] text-background uppercase shadow-lg transition-transform hover:-translate-y-0.5">
            Send Reply
          </button>
        </form>
      )}
    </Section>
  );
}

function Footer() {
  return (
    <footer className="paper-ground px-6 pb-16 pt-20 text-center">
      <p className="foil-text font-display text-5xl font-light">A &amp; A</p>
      <p className="eyebrow mt-4">14 · 02 · 2027</p>
      <p className="mt-6 font-display italic text-muted-foreground">With love and duas from both families</p>
    </footer>
  );
}
