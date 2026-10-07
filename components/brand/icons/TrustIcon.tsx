import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Trust — bounded, honest evidence: shield with check. */
export function TrustIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <path d="M12 3.5 5 6v6c0 4.5 3 7.5 7 8.5 4-1 7-4 7-8.5V6l-7-2.5Z" />
      <path d="m9 11.5 2.2 2.2L15.5 9.5" />
    </BrandIconBase>
  );
}
