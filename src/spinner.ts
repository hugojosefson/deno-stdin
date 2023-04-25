import { Deferred } from "./deferred.ts";

const encoder = new TextEncoder();
const FRAMES = ["-", "\\", "|", "/"]
  .map((frame) => "\r" + frame + "\r")
  .map((frame) => encoder.encode(frame));
const FRAME_CLEAR = encoder.encode("\r \r");

type SpinnerState =
  | "ready"
  | "starting"
  | "started"
  | "stopping"
  | "stopped"
  | "done";
const spinnerStates: SpinnerState[] = [
  "ready",
  "starting",
  "started",
  "stopping",
  "stopped",
  "done",
] as const;

function isValidStateTransition(from: SpinnerState, to: SpinnerState) {
  return spinnerStates.indexOf(to) > spinnerStates.indexOf(from);
}

export class Spinner {
  private counter = 0;
  private readonly fps = 25;
  readonly delay = 1000 / this.fps;
  private readonly doneDeferred = new Deferred<void>();
  private intervalId?: number;
  private state: SpinnerState;

  async moveToState(newState: SpinnerState) {
    if (!isValidStateTransition(this.state, newState)) {
      throw new Error(
        `Must move forward in spinner state. Cannot move from ${this.state} to ${newState}`,
      );
    }
    this.state = newState;

    if (newState === "starting") {
      this.state = "started";
      this.intervalId = setInterval(this.spinStep.bind(this), this.delay);
    }

    if (newState === "done") {
      if (!this.doneDeferred.isDone) {
        this.doneDeferred.resolve();
      }
    }
  }

  constructor(writer: Deno.Writer = Deno.stdout) {
    this.writer = writer;
    this.state = "ready";
  }

  private async spinStep() {
    try {
      if (this.state !== "started") {
        return;
      }
      await this.writer.write(FRAMES[this.counter]);
      this.counter = (this.counter + 1) % FRAMES.length;
    } finally {
      if (this.state === "stopping") {
        await this.moveToState("stopped");
      }
      if (this.state === "stopped") {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = undefined;
          await this.writer.write(FRAME_CLEAR);
          await this.moveToState("done");
        }
      }
    }
  }

  async start() {
    await this.moveToState("starting");
  }

  async stop() {
    await this.moveToState("stopping");
  }

  get done() {
    return this.doneDeferred.promise;
  }
}
