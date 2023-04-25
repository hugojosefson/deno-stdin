import { Deferred } from "./deferred.ts";

const encoder = new TextEncoder();
const frames = ["-", "\\", "|", "/"]
  .map((frame) => "\r" + frame + "\r")
  .map((frame) => encoder.encode(frame));

export class Spinner {
  private counter = 0;
  private readonly fps = 25;
  readonly delay = 1000 / this.fps;
  private readonly deferred = new Deferred<void>();

  constructor(writer: Deno.Writer = Deno.stdout) {
    this.writer = writer;
    setTimeout(this.spinStep.bind(this));
  }

  private async spinStep() {
    if (this.deferred.isDone) {
      return;
    }
    await this.writer.write(frames[this.counter]);
    this.counter = (this.counter + 1) % frames.length;
    if (!this.deferred.isDone) {
      setTimeout(this.spinStep.bind(this), this.delay);
    }
  }

  stopSpinning() {
    this.deferred.resolve();
  }

  get promise() {
    return this.deferred.promise;
  }
}
