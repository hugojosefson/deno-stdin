import logger from "./logger.ts";
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

logger.info("Press Ctrl-C or Esc to stop reading keys.");

logger.debug("for await (const byte of readKeypress()) {");
for await (const byte of readKeypress()) {
  logger.debug("  logger.debug({ byte });");
  logger.info({ byte });
  if (byte === ASCII_CTRL_C || byte === ASCII_ESC) {
    done = true;
    stopReading();
  }
}
logger.debug("for await (const byte of readKeypress()) {}. DONE.");
logger.info("END OF PROGRAM");
