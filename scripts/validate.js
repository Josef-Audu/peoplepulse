// Equivalent validation for the zero-dependency prototype (no TS/lint stack yet).
// Checks: entry point exists, required product elements present, no external deps,
// responsive meta present, mock data clearly labeled. Exit non-zero on failure.
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const INDEX = path.join(ROOT, "prototype", "index.html");
const PKG = path.join(ROOT, "package.json");
const SERVE = path.join(ROOT, "scripts", "serve.js");

let failures = 0;
const check = (name, ok) => {
  console.log(`${ok ? "PASS" : "FAIL"} : ${name}`);
  if (!ok) failures += 1;
};

const exists = (p) => fs.existsSync(p);
check("package.json exists", exists(PKG));
check("scripts/serve.js exists", exists(SERVE));
check("prototype/index.html exists", exists(INDEX));

if (!exists(INDEX)) {
  console.log("Cannot continue without prototype/index.html");
  process.exit(1);
}

const html = fs.readFileSync(INDEX, "utf-8");
const pkg = JSON.parse(fs.readFileSync(PKG, "utf-8"));

check("dev script defined", typeof pkg.scripts?.dev === "string" && pkg.scripts.dev.includes("serve.js"));
check("responsive viewport meta", html.includes('name="viewport"'));
check("what PeoplePulse is", /what other people think|human evidence platform/i.test(html));
check("live/public opinion signal", /live pulse|live signal/i.test(html));
check("Evidence Card present", html.includes("evidence-card") && /1,?284/.test(html));
check("bounded evidence language", /of .*respondents/i.test(html) && /self-selected sample/i.test(html));
check("visualization present", html.includes("bar-track") || html.includes("results-bar"));
check("evidence context", /collection period|recruitment|limitation/i.test(html));
check("primary action", html.includes("btn-primary"));
check("mock data labeled", html.includes("PROTOTYPE_DATA") && /prototype-only mock data/i.test(html));
check("responsive CSS", html.includes("@media"));
check(
  "no external script/stylesheet deps",
  !/<script\s+src="https?:/i.test(html) && !/<link[^>]+href="https?:/i.test(html) && !/@import\s+url\(['"]?https?:/i.test(html)
);
check("palette tokens", ["#2563EB", "#17212B", "#F8FAF9", "#0F766E"].every((h) => html.includes(h)));
check("convergence concept", /converg|People → Signal|People -&gt; Signal/i.test(html));

if (failures > 0) {
  console.log(`${failures} check(s) failed.`);
  process.exit(1);
}
console.log("All prototype validation checks passed.");
