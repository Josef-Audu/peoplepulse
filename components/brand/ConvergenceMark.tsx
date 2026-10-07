export type ConvergenceMarkProps = {
  /** Rendered pixel size (square). Defaults to 32. */
  size?: number;
  /** Accessible label for the standalone mark. Omit when aria-hidden context applies. */
  label?: string;
};

/**
 * PeoplePulse convergence mark, recreated as code from the inspected brand
 * references (style-guide primary logo + `design.html` convergence mark).
 *
 * Geometry lineage (34×34 grid): deep-ink rounded tile; five individual dots
 * in Pulse-Blue → Signal-Teal progression on the left converging toward one
 * solid white signal bar on the right — "many perspectives becoming one
 * signal." No raster assets, no cropped screenshots: proportions, spacing and
 * the blue/teal relationship follow the references, not a new invention.
 */
export function ConvergenceMark({ size = 32, label }: ConvergenceMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      role="img"
      aria-label={
        label ?? "PeoplePulse convergence mark: scattered dots converging into a single signal bar"
      }
    >
      <rect x="0" y="0" width="34" height="34" rx="8" fill="#17212B" />
      <circle cx="9" cy="8" r="2.2" fill="#93C5FD" />
      <circle cx="9" cy="17" r="2.2" fill="#60A5FA" />
      <circle cx="9" cy="26" r="2.2" fill="#2DD4BF" />
      <circle cx="16" cy="11" r="2.2" fill="#60A5FA" />
      <circle cx="16" cy="23" r="2.2" fill="#2DD4BF" />
      <rect x="22" y="7" width="4.5" height="20" rx="2.25" fill="#FFFFFF" />
    </svg>
  );
}
