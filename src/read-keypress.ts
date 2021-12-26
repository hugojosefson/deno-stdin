let done = false;

export function stopReading(): void {
  done = true;
}

/**
 * Adapted from https://deno.land/x/keypress@0.0.7/mod.ts
 * Copyright (c) 2020 Dmitriy Tatarintsev
 * MIT License
 */
export async function* readKeypress(
  reader: Deno.Reader & { rid: number } = Deno.stdin,
  bufferLength = 1024,
): AsyncIterableIterator<number> {
  if (!Deno.isatty(reader.rid)) {
    throw new Error("Keypress can be read only under TTY.");
  }

  console.log("while (true) {");
  while (!done) {
    console.log("  const buffer = new Uint8Array(bufferLength);");
    const buffer = new Uint8Array(bufferLength);
    console.log("  const buffer = new Uint8Array(bufferLength); DONE.");

    console.log("  Deno.setRaw(reader.rid, true);");
    Deno.setRaw(reader.rid, true);
    console.log("  Deno.setRaw(reader.rid, true); DONE.");

    console.log("  const length = <number> await reader.read(buffer);");
    const length = <number> await reader.read(buffer);
    console.log("  const length = <number> await reader.read(buffer); DONE.");

    console.log("  Deno.setRaw(reader.rid, false);");
    Deno.setRaw(reader.rid, false);
    console.log("  Deno.setRaw(reader.rid, false); DONE.");

    console.log("  const subarray: Uint8Array = buffer.subarray(0, length);");
    const subarray: Uint8Array = buffer.subarray(0, length);
    console.log(
      "  const subarray: Uint8Array = buffer.subarray(0, length); DONE.",
    );

    console.log("  for (const uint8 of subarray) {");
    for (const uint8 of subarray) {
      console.log("    yield uint8;");
      yield uint8;
      console.log("    yield uint8; DONE.");
    }
    console.log("  for (const uint8 of subarray) {}. DONE.");
  }
}
