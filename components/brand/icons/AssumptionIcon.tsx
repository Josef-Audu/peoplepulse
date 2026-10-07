import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Assumption — the starting guess every decision begins with: bulb. */
export function AssumptionIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <path d="M9.5 18h5" />
      <path d="M10.5 20.5h3" />
      <path d="M12 3.5a5.5 5.5 0 0 1 3.2 10c-.7.5-1.2 1-1.2 2H10c0-1-.5-1.5-1.2-2A5.5 5.5 0 0 1 12 3.5Z" />
    </BrandIconBase>
  );
}
