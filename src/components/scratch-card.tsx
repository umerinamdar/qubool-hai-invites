import { useEffect, useRef, useState } from "react";

/** Gold-foil scratch panel. Colours come from --scratch-foil / --highlight / --scratch-ink. */
export function ScratchCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const foil = css.getPropertyValue("--scratch-foil").trim();
    const hi = css.getPropertyValue("--highlight").trim();
    const ink = css.getPropertyValue("--scratch-ink").trim();
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr;
    c.height = height * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, foil);
    g.addColorStop(0.5, hi);
    g.addColorStop(1, foil);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.35;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = ink;
    ctx.font = "500 11px Jost, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2 + 4);
    ctx.globalAlpha = 1;

    let drawing = false;
    const scratch = (e: PointerEvent) => {
      if (!drawing) return;
      const r = c.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2);
      ctx.fill();
    };
    const check = () => {
      drawing = false;
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let clear = 0;
      for (let i = 3; i < d.length; i += 64) if (d[i] === 0) clear++;
      if (clear / (d.length / 64) > 0.45) setDone(true);
    };
    const down = (e: PointerEvent) => { drawing = true; c.setPointerCapture(e.pointerId); scratch(e); };
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", scratch);
    c.addEventListener("pointerup", check);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", scratch);
      c.removeEventListener("pointerup", check);
    };
  }, []);

  return (
    <div className="relative mx-auto h-36 w-full max-w-xs overflow-hidden rounded-sm border border-accent/50 bg-surface">
      <div className="flex h-full items-center justify-center">{children}</div>
      <canvas
        ref={ref}
        aria-label="Scratch to reveal the date"
        className={`absolute inset-0 h-full w-full cursor-pointer touch-none transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : ""}`}
      />
    </div>
  );
}
