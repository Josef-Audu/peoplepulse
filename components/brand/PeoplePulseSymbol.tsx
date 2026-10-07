export type SymbolTone = "dark-bg" | "light-bg" | "mono";

export type PeoplePulseSymbolProps = {
  /** Rendered pixel size (square). Defaults to 40. */
  size?: number;
  /**
   * dark-bg: white signal core (for dark surfaces; matches supplied artwork).
   * light-bg: ink signal core (for light surfaces; matches style-guide usage).
   * mono: whole mark in currentColor (single-color contexts).
   */
  tone?: SymbolTone;
  /** Accessible label. Pass "" when decorative/redundant next to brand text. */
  label?: string;
  className?: string;
};

/**
 * Official PeoplePulse symbol as inline vector — measured geometry from the
 * supplied artwork (docs/peoplepulse_logo_white_variant.png), not a
 * reinterpretation. Groups carry data-layer attributes so the hero
 * infographic and preloader can stage "evidence forming" animation.
 */
export function PeoplePulseSymbol({
  size = 40,
  tone = "light-bg",
  label = "PeoplePulse symbol",
  className,
}: PeoplePulseSymbolProps) {
  const mono = tone === "mono";
  const core = tone === "dark-bg" ? "#FFFFFF" : tone === "light-bg" ? "#17212B" : "currentColor";
  const c = (color: string) => (mono ? "currentColor" : color);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      role="img"
      aria-label={label === "" ? undefined : label}
      aria-hidden={label === "" ? true : undefined}
      className={className}
      style={{ width: size, height: size }}
    >
      <g data-layer="individuals-left" fill={c("#2563EB")}>
        <circle cx="495.5" cy="242.6" r="49" />
        <circle cx="318.8" cy="397.3" r="44" />
        <circle cx="339.6" cy="663.2" r="45" />
        <circle cx="430.3" cy="745.1" r="42" />
        <circle cx="506.8" cy="821" r="48" />
      </g>
      <circle data-layer="individuals-left" cx="236.5" cy="479.8" r="44" fill={c("#443BF1")} />
      <g data-layer="signal-blue" stroke={c("#2563EB")}>
        <line x1="284.6" y1="567.9" x2="307.6" y2="551.9" strokeWidth="54" strokeLinecap="round" />
        <circle cx="284.6" cy="567.9" r="40" fill={c("#2563EB")} stroke="none" />
        <circle cx="307.6" cy="551.9" r="40" fill={c("#2563EB")} stroke="none" />
      </g>
      <g data-layer="signal-core" fill={core} stroke={core}>
        <line x1="516.8" y1="394.3" x2="582" y2="456.3" strokeWidth="64" strokeLinecap="round" />
        <circle cx="516.8" cy="394.3" r="47" stroke="none" />
        <circle cx="582" cy="456.3" r="47" stroke="none" />
        <line x1="435.9" y1="456.4" x2="496.1" y2="523.2" strokeWidth="64" strokeLinecap="round" />
        <circle cx="435.9" cy="456.4" r="47" stroke="none" />
        <circle cx="496.1" cy="523.2" r="47" stroke="none" />
        <circle data-layer="individuals-core" cx="404.3" cy="316" r="43" stroke="none" />
        <circle data-layer="individuals-core" cx="427.9" cy="594.6" r="42" stroke="none" />
        <circle data-layer="individuals-core" cx="503.2" cy="671.6" r="40" stroke="none" />
      </g>
      <g data-layer="individuals-right" fill={c("#0E9F8A")}>
        <circle cx="584" cy="316.7" r="42" fill={c("#069A96")} />
        <circle cx="670.2" cy="391.9" r="48" fill={c("#089A7E")} />
        <circle cx="768" cy="480" r="56" fill={c("#0EA17F")} />
        <circle cx="763.7" cy="610.5" r="46" fill={c("#0AA56F")} />
        <circle cx="666" cy="682.1" r="44" fill={c("#07A081")} />
        <circle cx="583.9" cy="744.8" r="39" fill={c("#05989D")} />
      </g>
      <g data-layer="signal-teal" stroke={c("#09A092")}>
        <line x1="617.8" y1="588.6" x2="640.8" y2="572.8" strokeWidth="53" strokeLinecap="round" />
        <circle cx="617.8" cy="588.6" r="39" fill={c("#09A092")} stroke="none" />
        <circle cx="640.8" cy="572.8" r="39" fill={c("#09A092")} stroke="none" />
      </g>
    </svg>
  );
}
