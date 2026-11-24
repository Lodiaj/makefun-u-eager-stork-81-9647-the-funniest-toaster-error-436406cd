import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry: one line, the funniest error message a kitchen toaster
// could show its owner — deadpan, in the voice of a real appliance.
const LINE =
  "ERROR 404: BREAD NOT FOUND. Please insert bread and stop staring at me like I did this.";

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

const line = LINE;
if (line.length === 0) fail("the line is empty");
if (line.length > 120)
  fail(`the line is ${line.length} characters, over the 120 limit`);
if (line.includes("\n") || line.includes("\r"))
  fail("the line must be a single line");
if (line.trim().length === 0) fail("the line must not be only whitespace");
if (!/^[\x20-\x7E]+$/.test(line))
  fail("the line must be printable ASCII");
const words = line.split(/\s+/).filter(Boolean);
if (words.length < 3) fail("the line needs at least 3 words");
// The gate's shape: it must read like a real error message on a real
// appliance, so it must name an error and the thing that went wrong.
if (!/error/i.test(line)) fail("the line must read like an error message");
const toasterWords = ["bread", "toast", "toaster", "crumb", "bagel"];
const lowered = line.toLowerCase();
if (!toasterWords.some((w) => lowered.includes(w)))
  fail("the line must be about a toaster");

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line, "utf8");
// Byte length, not just character length: the gate counts the file,
// and a multi-byte character would make the two disagree.
if (new TextEncoder().encode(line).length > 120)
  fail("the line is over 120 bytes");
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== line) fail("round-trip check failed: entry.txt differs");
console.log(
  `entry.txt OK: ${line.length} characters, ${words.length} words, written to /output/entry.txt`,
);
