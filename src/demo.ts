import logger from "./logger.ts";
import { KeypressReader } from "./keypress-reader.ts";
import { Spinner, stepsBrailleCounter } from "./spinner.ts";

const ASCII_CTRL_C = 3;
const ASCII_ESC = 27;

logger.info("Press Ctrl-C or Esc to stop reading keys.");
await Deno.stdout.write(new TextEncoder().encode("Working..."));

const spinner = new Spinner({
  writer: Deno.stderr,
  steps: stepsBrailleCounter,
});

const keypressReader = new KeypressReader();
try {
  for await (const byte of keypressReader.generator) {
    logger.info({ byte });
    if (byte === ASCII_CTRL_C || byte === ASCII_ESC) {
      break;
    }
  }
} finally {
  await keypressReader.stop();
}

await spinner.stop();

logger.info("END OF PROGRAM");
