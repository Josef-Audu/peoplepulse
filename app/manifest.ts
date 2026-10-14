import type { MetadataRoute } from "next";

/** PeoplePulse installable PWA manifest (Next App Router metadata route). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PeoplePulse",
    short_name: "PeoplePulse",
    description: "Human evidence for better decisions.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#2563EB",
    background_color: "#F8FAF9",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
