import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Insight — ascending bars with a trend: pattern becoming visible. */
export function InsightIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <path d="M4 20h16" />
      <path d="M7 20v-5M12 20V9M17 20V5" />
      <path d="M6 9.5 12 5l4 2.5 3-3" />
      <path d="M17.5 4.5H20V7" />
    </BrandIconBase>
  );
}
