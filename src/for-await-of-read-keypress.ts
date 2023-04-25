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
function stopSpinning(): void {
  done = true;
}

async function spinStep() {
  if (done) {
    return;
  }
  await Deno.stdout.write(
    encoder.encode("\r" + spinner[counter++ % spinner.length] + "\r"),
  );
  if (!done) {
    setTimeout(spinStep, delay);
  }
}
setTimeout(spinStep, delay);

logger.info("Press Ctrl-C or Esc to stop reading keys.");

for await (const byte of readKeypress()) {
  logger.info({ byte });
  if (byte === ASCII_CTRL_C || byte === ASCII_ESC) {
    stopSpinning();
    stopReading();
  }
}
logger.info("END OF PROGRAM");
