import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Decision — the commitment the evidence serves: target. */
export function DecisionIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </BrandIconBase>
  );
}
