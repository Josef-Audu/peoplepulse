import type { SVGProps } from "react";

export type BrandIconProps = SVGProps<SVGSVGElement> & {
  /** Rendered pixel size (square). Defaults to 20. */
  size?: number;
  /** Accessible label. Icons sit beside text labels, so default is decorative. */
  label?: string;
};

/**
 * Shared wrapper for the PeoplePulse line-icon system (style-guide
 * iconography, recreated as vectors): 24x24 grid, 1.8px stroke, round
 * caps/joins, currentColor. Decorative by default next to visible labels.
 */
export function BrandIconBase({
  size = 20,
  label,
  children,
  ...rest
}: BrandIconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ width: size, height: size, flexShrink: 0 }}
      {...rest}
    >
      {children}
    </svg>
  );
}
