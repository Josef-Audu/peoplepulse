/**
 * Hero signal graphic: individual participant dots (left, Pulse-Blue →
 * Signal-Teal) converging through faint ties into a collective white signal
 * bar with a density pattern (right). Adapted from the approved
 * `design.html` signal card — static SVG, no animation, so reduced-motion
 * needs no special handling. Widths are fluid; nothing overflows small screens.
 */
export function SignalGraphic() {
  return (
    <div className="overflow-hidden rounded-2xl bg-ink p-6 text-slate-200 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        People → Signal → Pattern → Evidence
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        Individual perspectives becoming collective signal. Each dot is a participant; density
        becomes pattern.
      </p>
      <svg
        viewBox="0 0 400 170"
        width="100%"
        height="170"
        role="img"
        aria-label="Dots on the left converging into a single signal bar with a density pattern on the right"
        className="mt-4 block h-auto w-full"
      >
        <g fill="#60A5FA" opacity="0.95">
          <circle cx="22" cy="20" r="5" />
          <circle cx="22" cy="55" r="5" />
          <circle cx="22" cy="90" r="5" />
          <circle cx="22" cy="125" r="5" />
          <circle cx="22" cy="155" r="5" />
          <circle cx="60" cy="35" r="5" />
          <circle cx="60" cy="72" r="5" />
          <circle cx="60" cy="108" r="5" />
          <circle cx="60" cy="142" r="5" />
        </g>
        <g fill="#2DD4BF" opacity="0.9">
          <circle cx="100" cy="52" r="5" />
          <circle cx="100" cy="88" r="5" />
          <circle cx="100" cy="122" r="5" />
          <circle cx="142" cy="70" r="5" />
          <circle cx="142" cy="104" r="5" />
        </g>
        <g stroke="#334155" strokeWidth="1.2" opacity="0.8">
          <line x1="28" y1="22" x2="180" y2="80" />
          <line x1="28" y1="56" x2="180" y2="82" />
          <line x1="28" y1="90" x2="180" y2="85" />
          <line x1="28" y1="124" x2="180" y2="88" />
          <line x1="28" y1="154" x2="180" y2="90" />
          <line x1="66" y1="36" x2="180" y2="82" />
          <line x1="66" y1="72" x2="180" y2="84" />
          <line x1="66" y1="108" x2="180" y2="87" />
          <line x1="66" y1="142" x2="180" y2="89" />
        </g>
        <rect x="185" y="45" width="14" height="80" rx="7" fill="#FFFFFF" />
        <rect x="208" y="60" width="10" height="50" rx="5" fill="#93C5FD" />
        <rect x="226" y="70" width="8" height="30" rx="4" fill="#2DD4BF" />
        <g opacity="0.9">
          <rect x="255" y="55" width="120" height="8" rx="4" fill="#2563EB" />
          <rect x="255" y="70" width="92" height="8" rx="4" fill="#0F766E" />
          <rect x="255" y="85" width="60" height="8" rx="4" fill="#64748B" />
          <rect x="255" y="100" width="110" height="8" rx="4" fill="#2563EB" opacity="0.55" />
        </g>
        <text x="255" y="130" fill="#94A3B8" fontSize="11">
          64% · collective pattern
        </text>
      </svg>
      <p aria-hidden="true" className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.06em] text-slate-400">
        <span>People</span>
        <span>Signal</span>
        <span>Pattern</span>
        <span>Evidence</span>
      </p>
    </div>
  );
}
