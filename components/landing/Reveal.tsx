"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealProps = {
  children: ReactNode;
  /** Extra stagger delay in ms for grouped entrances. Keep small. */
  delay?: number;
  className?: string;
};

/**
 * Subtle section entrance (opacity + translateY, IO-triggered, once).
 * Hidden state is applied by JS only — content stays readable if JS fails,
 * and reduced-motion users get the final state immediately.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "visible">("idle");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setState("visible");
      return;
    }
    setState("hidden");
    const el = ref.current;
    if (!el) {
      setState("visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motion =
    state === "visible"
      ? "pp-reveal is-visible"
      : state === "hidden"
        ? "pp-reveal"
        : undefined;

  return (
    <div
      ref={ref}
      className={[className, motion].filter(Boolean).join(" ") || undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
