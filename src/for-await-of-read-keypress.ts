import { readKeypress, stopReading } from "./read-keypress.ts";

const ASCII_CTRL_C = 3;
const ASCII_ESC = 27;

const encoder = new TextEncoder();
const spinner = ["-", "\\", "|", "/"];
let counter = 0;
const FPS = 25;
const delay = 1000 / FPS;
let done = false;
async function iterate() {
  Deno.stdin.setRaw(true);
  await Deno.stdout.write(
    encoder.encode("\r" + spinner[counter++ % spinner.length]),
  );
  Deno.stdin.setRaw(false);
  if (!done) {
    setTimeout(iterate, delay);
  }
}
setTimeout(iterate, delay);

console.log("Press Ctrl-C or Esc to stop reading keys.");

console.log("for await (const byte of readKeypress()) {");
for await (const byte of readKeypress()) {
  console.log("  console.log({ byte });");
  console.log({ byte });
  if (byte === ASCII_CTRL_C || byte === ASCII_ESC) {
    done = true;
    stopReading();
  }
}
console.log("for await (const byte of readKeypress()) {}. DONE.");
console.log("END OF PROGRAM");
