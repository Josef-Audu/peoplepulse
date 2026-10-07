import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Explore — asking why: magnifier over the responses. */
export function ExploreIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </BrandIconBase>
  );
}
