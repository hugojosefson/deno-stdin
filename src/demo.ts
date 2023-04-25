import logger from "./logger.ts";
import { KeypressReader } from "./keypress-reader.ts";
import { Spinner, stepsBrailleCounter } from "./spinner.ts";

const ASCII_CTRL_C = 3;
const ASCII_ESC = 27;

logger.info("Press Ctrl-C or Esc to stop reading keys.");

const spinner = new Spinner({
  writer: Deno.stderr,
  steps: stepsBrailleCounter,
});
const keypressReader = new KeypressReader();
spinner.start();

for await (const byte of keypressReader.generator) {
  logger.info({ byte });
  if (byte === ASCII_CTRL_C || byte === ASCII_ESC) {
    spinner.stop();
    keypressReader.stop();
    await spinner.done;
    await keypressReader.done;
    break;
  }
}
logger.info("END OF PROGRAM");
