import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Pattern — connected perspectives resolving into signal: nodes. */
export function PatternIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="8" r="2.5" />
      <circle cx="10" cy="18" r="2.5" />
      <path d="M8.3 7 15.7 7.8M7 8.3l2 7.2M16.4 10l-4.6 5.7" />
    </BrandIconBase>
  );
}
