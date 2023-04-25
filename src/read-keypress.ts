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

  while (!done) {
    const buffer = new Uint8Array(bufferLength);

    stdin.setRaw(true);
    const length = <number> await stdin.read(buffer);
    stdin.setRaw(false);

    const subarray: Uint8Array = buffer.subarray(0, length);
    for (const uint8 of subarray) {
      yield uint8;
    }
  }
}
