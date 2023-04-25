import logger from "./logger.ts";
import { readKeypress, stopReading } from "./read-keypress.ts";
import { Spinner } from "./spinner.ts";

const ASCII_CTRL_C = 3;
const ASCII_ESC = 27;

logger.info("Press Ctrl-C or Esc to stop reading keys.");

const spinner = new Spinner();

for await (const byte of readKeypress()) {
  logger.info({ byte });
  if (byte === ASCII_CTRL_C || byte === ASCII_ESC) {
    spinner.stopSpinning();
    stopReading();
    await spinner.promise;
    break;
  }
}
logger.info("END OF PROGRAM");
