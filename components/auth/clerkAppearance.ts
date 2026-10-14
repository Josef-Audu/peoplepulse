/**
 * Shared Clerk appearance for PeoplePulse auth pages (prebuilt components).
 * Brand tokens only — Inter, Pulse Blue primary, Deep Ink text, soft radius.
 * Kept minimal on purpose; raw Clerk element internals are not restyled.
 */
export const clerkAuthAppearance = {
  variables: {
    colorPrimary: "#2563EB",
    colorText: "#17212B",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#17212B",
    colorTextSecondary: "#64748B",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "shadow-none",
  },
};
