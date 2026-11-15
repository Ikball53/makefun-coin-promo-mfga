// MFGA entry program: hands the launched coin in to the make.fun house.
// The coin itself is the entry; this program only delivers LAUNCH.json,
// which names the coin's mint and the signature that created it.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const launchPath = join(here, "LAUNCH.json");
const outDir = "/output";

if (!existsSync(launchPath)) {
  throw new Error(`LAUNCH.json not found next to main.ts at ${launchPath}`);
}
const raw = readFileSync(launchPath, "utf8");
const record = JSON.parse(raw) as { mint?: unknown; create_signature?: unknown };
if (typeof record.mint !== "string" || record.mint.length === 0) {
  throw new Error("LAUNCH.json has no mint");
}
// A Solana mint is a base58 address: 32 to 44 characters, no 0/O/I/l.
if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(record.mint)) {
  throw new Error(`LAUNCH.json mint does not look like a Solana address: ${record.mint}`);
}
if (typeof record.create_signature !== "string" || record.create_signature.length === 0) {
  throw new Error("LAUNCH.json has no create_signature");
}
if (!/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(record.create_signature)) {
  throw new Error("LAUNCH.json create_signature does not look like a base58 signature");
}
mkdirSync(outDir, { recursive: true });
copyFileSync(launchPath, join(outDir, "LAUNCH.json"));
console.log(`MFGA entry handed in: mint ${record.mint}`);
