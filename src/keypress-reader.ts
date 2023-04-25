import { Deferred } from "./deferred.ts";

type RawSettable = {
  setRaw(mode: boolean, options?: Deno.SetRawOptions): void;
};
type Stdin = Deno.Reader & { rid: number } & RawSettable;

export class KeypressReader {
  private readonly doneDeferred = new Deferred<void>();
  private readonly stdin: Stdin;
  private readonly bufferLength: number;

  readonly generator: AsyncIterableIterator<number>;

  constructor(
    stdin: Stdin = Deno.stdin,
    bufferLength = 1024,
  ) {
    this.stdin = stdin;
    this.bufferLength = bufferLength;
    this.generator = this.generate();
  }

  stop() {
    this.stdin.setRaw(false);
    this.doneDeferred.resolve();
    return this.done;
  }

  get done() {
    return this.doneDeferred.promise;
  }

  /**
   * Adapted from https://deno.land/x/keypress@0.0.7/mod.ts
   * Copyright (c) 2020 Dmitriy Tatarintsev
   * MIT License
   */
  private async *generate(): AsyncIterableIterator<number> {
    if (!Deno.isatty(this.stdin.rid)) {
      const error = new Error("Keypress can be read only under TTY.");
      this.doneDeferred.reject(error);
      throw error;
    }

    while (true) {
      if (this.doneDeferred.isDone) {
        break;
      }
      const buffer = new Uint8Array(this.bufferLength);

      try {
        this.stdin.setRaw(true);
        const length = <number> await this.stdin.read(buffer);
        this.stdin.setRaw(false);

        const subarray: Uint8Array = buffer.subarray(0, length);
        for (const uint8 of subarray) {
          if (this.doneDeferred.isDone) {
            break;
          }
          yield uint8;
        }
      } finally {
        this.stdin.setRaw(false);
      }
    }
  }
}
