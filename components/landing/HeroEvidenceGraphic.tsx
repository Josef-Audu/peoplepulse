import { PeoplePulseSymbol } from "@/components/brand/PeoplePulseSymbol";

type Dot = { x: number; y: number; r: number; fill: string; delay: number };

/**
 * Layered participant cloud: individual perspectives entering from the left
 * and drifting toward the shared signal. Brighter tints carry the brand hues
 * on the dark editorial surface (same treatment as the supplied dark artwork).
 */
const DOTS: Dot[] = [
  { x: 18, y: 22, r: 5, fill: "#60A5FA", delay: 0 },
  { x: 18, y: 58, r: 5, fill: "#60A5FA", delay: 80 },
  { x: 18, y: 94, r: 5, fill: "#60A5FA", delay: 160 },
  { x: 18, y: 130, r: 5, fill: "#2DD4BF", delay: 240 },
  { x: 52, y: 34, r: 5, fill: "#60A5FA", delay: 60 },
  { x: 52, y: 70, r: 5, fill: "#93C5FD", delay: 140 },
  { x: 52, y: 106, r: 5, fill: "#2DD4BF", delay: 220 },
  { x: 52, y: 136, r: 5, fill: "#2DD4BF", delay: 300 },
  { x: 86, y: 50, r: 5, fill: "#93C5FD", delay: 120 },
  { x: 86, y: 86, r: 5, fill: "#2DD4BF", delay: 200 },
  { x: 86, y: 118, r: 5, fill: "#2DD4BF", delay: 280 },
  { x: 118, y: 68, r: 5, fill: "#93C5FD", delay: 180 },
  { x: 118, y: 100, r: 5, fill: "#2DD4BF", delay: 260 },
];

/** Faint ties from individuals toward the signal — restrained, no glow. */
const TIES = [
  "M24 24 150 74",
  "M24 60 150 78",
  "M24 96 150 82",
  "M58 36 150 76",
  "M58 108 150 84",
  "M92 52 150 76",
  "M92 116 150 86",
];

/**
 * Hero evidence graphic: information becoming clearer.
 * Layer 1 — individual participant dots enter (0.0s).
 * Layer 2 — dots drift toward the shared signal (0.3s).
 * Layer 3 — the official PeoplePulse signal motif resolves (0.7s).
 * Layer 4 — pattern bars appear (1.1s).
 * Layer 5 — the evidence result becomes visible (1.4s).
 * Afterwards the graphic remains static: motion represents evidence forming,
 * never decoration. All content is present without animation
 * (reduced-motion renders the final state).
 */
export function HeroEvidenceGraphic() {
  return (
    <div className="pp-hero overflow-hidden rounded-2xl bg-ink p-6 text-slate-200 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        People → Signal → Pattern → Evidence
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        Individual perspectives becoming collective signal. Each dot is a participant; density
        becomes pattern.
      </p>

      <div className="mt-5 grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
        {/* Layers 1+2: individuals converging */}
        <svg
          viewBox="0 0 170 154"
          role="img"
          aria-label="Individual participant dots converging toward a shared signal"
          className="pp-layer-dots block h-auto w-full"
        >
          <g stroke="#334155" strokeWidth="1.2" opacity="0.7">
            {TIES.map((d) => (
              <path key={d} d={d} fill="none" className="pp-tie" />
            ))}
          </g>
          {DOTS.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill={dot.fill}
              className="pp-dot"
              style={{ animationDelay: `${dot.delay}ms` }}
            />
          ))}
        </svg>

        {/* Layer 3: official signal motif */}
        <div className="pp-layer-signal mx-auto">
          <PeoplePulseSymbol size={118} tone="dark-bg" label="PeoplePulse signal motif" />
        </div>

        {/* Layers 4+5: pattern resolving into evidence */}
        <div className="pp-layer-evidence min-w-0">
          <div className="space-y-2" aria-hidden="true">
            <div className="pp-bar h-2.5 rounded-full bg-pulse" style={{ width: "88%", animationDelay: "1100ms" }} />
            <div className="pp-bar h-2.5 rounded-full bg-signal-teal" style={{ width: "64%", animationDelay: "1200ms" }} />
            <div className="pp-bar h-2.5 rounded-full bg-slate-500" style={{ width: "42%", animationDelay: "1300ms" }} />
          </div>
          <p className="pp-result mt-4 text-4xl font-extrabold tracking-tight text-white">
            64%
          </p>
          <p className="pp-result mt-1 text-sm text-slate-300" style={{ animationDelay: "1500ms" }}>
            would consider using it
          </p>
          <p className="pp-result mt-3 text-xs leading-relaxed text-slate-400" style={{ animationDelay: "1600ms" }}>
            1,284 participants · University students 18–25
          </p>
          <p className="pp-result mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ animationDelay: "1700ms" }}>
            <span className="rounded-full border border-teal-300/30 bg-teal-300/10 px-2.5 py-0.5 text-teal-200">
              Early signal
            </span>
            <span className="rounded-full border border-slate-500/40 px-2.5 py-0.5 text-slate-400">
              Self-selected sample
            </span>
          </p>
        </div>
      </div>

      <p aria-hidden="true" className="mt-4 flex justify-between text-[11px] uppercase tracking-[0.06em] text-slate-400">
        <span>People</span>
        <span>Signal</span>
        <span>Pattern</span>
        <span>Evidence</span>
      </p>
    </div>
  );
}
