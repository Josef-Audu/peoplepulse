import Image from "next/image";

export type BrandMarkVariant = "app" | "dark" | "symbol";

const SOURCES: Record<BrandMarkVariant, { src: string; tile: boolean }> = {
  // Original: docs/peoplepulse_favicon.png (Pulse Blue squircle, white signal).
  // Usage: light surfaces — header, auth, dashboard, footer; favicon source.
  app: { src: "/brand/peoplepulse-app-icon.png", tile: true },
  // Original: docs/peoplepulse_darkmode_logo.png (Deep Ink squircle, glowing signal).
  // Usage: dark surfaces only. No alpha in the source file, so the tile is
  // clipped with a proportional radius to hide the baked black corners.
  dark: { src: "/brand/peoplepulse-dark.png", tile: true },
  // Original: docs/peoplepulse_logo_white_variant.png (transparent diamond
  // symbol, white core, blue/teal edges). Usage: dark surfaces or flexible
  // placements where tile chrome is unwanted. White core washes out on light
  // backgrounds — do not use on white/paper.
  symbol: { src: "/brand/peoplepulse-symbol-transparent.png", tile: false },
};

export type BrandMarkProps = {
  /** Which production raster asset to render. Defaults to "app". */
  variant?: BrandMarkVariant;
  /** Rendered pixel size (square). Defaults to 32. */
  size?: number;
  /** Accessible text. Defaults to "PeoplePulse". Pass "" when decorative. */
  alt?: string;
  /** Set true for above-the-fold marks (header). */
  priority?: boolean;
  className?: string;
};

/**
 * PeoplePulse brand mark rendered from the exact supplied raster assets in
 * `public/brand/` (byte-identical copies of the `docs/` sources — never
 * redrawn, recolored, or filtered). No SVG approximation: the logo is the
 * logo. Supporting dot/convergence patterns remain separate visual language.
 */
export function BrandMark({
  variant = "app",
  size = 32,
  alt = "PeoplePulse",
  priority = false,
  className,
}: BrandMarkProps) {
  const { src, tile } = SOURCES[variant];
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      sizes={`${size}px`}
      className={className}
      style={
        tile
          ? { width: size, height: size, borderRadius: Math.round(size * 0.24) }
          : { width: size, height: size }
      }
    />
  );
}
