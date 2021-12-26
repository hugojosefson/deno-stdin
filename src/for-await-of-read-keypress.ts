import { readKeypress, stopReading } from "./read-keypress.ts";
const encoder = new TextEncoder();
const spinner = ["-", "\\", "|", "/"];
let counter = 0;
const FPS = 25;
const delay = 1000 / FPS;
let done = false;
async function iterate() {
  Deno.setRaw(Deno.stdout.rid, true);
  await Deno.stdout.write(
    encoder.encode("\r" + spinner[counter++ % spinner.length]),
  );
  Deno.setRaw(Deno.stdout.rid, false);
  if (!done) {
    setTimeout(iterate, delay);
  }
}
setTimeout(iterate, delay);

console.log("for await (const byte of readKeypress()) {");
for await (const byte of readKeypress()) {
  console.log("  console.log({ byte });");
  console.log({ byte });
  if (byte === 3 || byte === 27) {
    done = true;
    stopReading();
  }
}
console.log("for await (const byte of readKeypress()) {}. DONE.");
