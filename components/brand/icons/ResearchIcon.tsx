import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Research — the Decision Brief document. */
export function ResearchIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <path d="M6 3.5h8L19 8.5V20.5H6v-17Z" />
      <path d="M13.5 3.5v5.5H19" />
      <path d="M9 12.5h6M9 15.5h6M9 18.5h3.5" />
    </BrandIconBase>
  );
}
