import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Pulse — a single short question round: speech mark. */
export function PulseIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <path d="M4 5.5h16v10.5H9.5L4 20.5v-15Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </BrandIconBase>
  );
}
