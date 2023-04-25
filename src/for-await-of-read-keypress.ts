import logger from "./logger.ts";
import { readKeypress, stopReading } from "./read-keypress.ts";
import { Spinner } from "./spinner.ts";

const ASCII_CTRL_C = 3;
const ASCII_ESC = 27;

logger.info("Press Ctrl-C or Esc to stop reading keys.");

const spinner = new Spinner(Deno.stderr);
await spinner.start();

for await (const byte of readKeypress(Deno.stdin)) {
  logger.info({ byte });
  if (byte === ASCII_CTRL_C || byte === ASCII_ESC) {
    await spinner.stop();
    stopReading();
    await spinner.done;
    break;
  }
}
logger.info("END OF PROGRAM");
