import Link from "next/link";
import { PeoplePulseSymbol, type SymbolTone } from "@/components/brand/PeoplePulseSymbol";
import { cn } from "@/lib/utils";

export type PeoplePulseLogoVariant = "default" | "dark" | "symbol-only" | "compact";

export type PeoplePulseLogoProps = {
  variant?: PeoplePulseLogoVariant;
  /** Symbol pixel size. Defaults to 38 (default) / 28 (compact). */
  symbolSize?: number;
  className?: string;
};

/**
 * Production horizontal lockup: official vector symbol + "PeoplePulse" in
 * Inter ExtraBold. Never trace or approximate the wordmark — it is live text
 * in the approved typeface. Tone follows surface: ink-on-light default,
 * white-on-dark for dark surfaces.
 */
export function PeoplePulseLogo({ variant = "default", symbolSize, className }: PeoplePulseLogoProps) {
  const dark = variant === "dark";
  const size = symbolSize ?? (variant === "compact" ? 28 : 38);
  const tone: SymbolTone = dark ? "dark-bg" : "light-bg";
  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* Decorative: adjacent wordmark text already names the brand. */}
      <PeoplePulseSymbol size={size} tone={tone} label="" />
      {variant === "symbol-only" ? null : (
        <span className="ml-2.5 leading-none">
          <span
            className={cn(
              "block font-extrabold tracking-tight",
              variant === "compact" ? "text-[17px]" : "text-[22px]",
              dark ? "text-white" : "text-ink"
            )}
          >
            PeoplePulse
          </span>
          {variant === "compact" ? null : (
            <span
              className={cn(
                "mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em]",
                dark ? "text-slate-400" : "text-muted"
              )}
            >
              Human evidence, made visible
            </span>
          )}
        </span>
      )}
    </span>
  );
}

/** Header/product identity link. Replaces the former raster-tile Wordmark. */
export function PeoplePulseHomeLink({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="PeoplePulse home"
      className="flex min-h-[44px] items-center rounded-lg"
    >
      <PeoplePulseLogo variant={onDark ? "dark" : "default"} />
    </Link>
  );
}
