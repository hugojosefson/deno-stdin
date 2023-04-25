let done = false;

export function stopReading(): void {
  done = true;
}

type RawSetter = { setRaw(mode: boolean, options?: Deno.SetRawOptions): void };

/**
 * Adapted from https://deno.land/x/keypress@0.0.7/mod.ts
 * Copyright (c) 2020 Dmitriy Tatarintsev
 * MIT License
 */
export async function* readKeypress(
  stdin: Deno.Reader & { rid: number } & RawSetter = Deno.stdin,
  bufferLength = 1024,
): AsyncIterableIterator<number> {
  if (!Deno.isatty(stdin.rid)) {
    throw new Error("Keypress can be read only under TTY.");
  }

  logger.debug("while (true) {");
  while (!done) {
    logger.debug("  const buffer = new Uint8Array(bufferLength);");
    const buffer = new Uint8Array(bufferLength);
    logger.debug("  const buffer = new Uint8Array(bufferLength); DONE.");

    logger.debug("  Deno.stdin.setRaw(true);");
    stdin.setRaw(true);
    logger.debug("  Deno.stdin.setRaw(true); DONE.");

    logger.debug("  const length = <number> await reader.read(buffer);");
    const length = <number> await stdin.read(buffer);
    logger.debug("  const length = <number> await reader.read(buffer); DONE.");

    logger.debug("  Deno.stdin.setRaw(false);");
    stdin.setRaw(false);
    logger.debug("  Deno.stdin.setRaw(false); DONE.");

    logger.debug("  const subarray: Uint8Array = buffer.subarray(0, length);");
    const subarray: Uint8Array = buffer.subarray(0, length);
    logger.debug(
      "  const subarray: Uint8Array = buffer.subarray(0, length); DONE.",
    );

    logger.debug("  for (const uint8 of subarray) {");
    for (const uint8 of subarray) {
      logger.debug("    yield uint8;");
      yield uint8;
      logger.debug("    yield uint8; DONE.");
    }
    logger.debug("  for (const uint8 of subarray) {}. DONE.");
  }
  logger.info("Finished reading keypresses.");
}
