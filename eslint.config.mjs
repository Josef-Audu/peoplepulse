import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// ESLint CLI flat config (migrated from deprecated `next lint`, Phase 0B).
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["node_modules/**", ".next/**", ".netlify/**", "out/**", "prototype/**", "scripts/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
