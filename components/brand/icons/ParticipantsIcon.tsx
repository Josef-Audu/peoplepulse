import { BrandIconBase, type BrandIconProps } from "./BrandIconBase";

/** Participants — two people: the individuals behind the evidence. */
export function ParticipantsIcon(props: BrandIconProps) {
  return (
    <BrandIconBase {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
      <circle cx="16.8" cy="9" r="2.6" />
      <path d="M16 14.2c2.3.3 3.9 1.9 4.4 4.3" />
    </BrandIconBase>
  );
}
