import { Deferred } from "./deferred.ts";

const ANSI_CURSOR_LEFT = "\x1b[1D";

function repeat(str: string, count: number): string[] {
  return Array(count).fill(str);
}

function checkSteps(steps: readonly string[]): void {
  if (!Array.isArray(steps)) {
    throw new Error("Steps must be an array");
  }
  if (steps.length === 0) {
    throw new Error("Steps must not be empty");
  }
  if (steps.some((step) => typeof step !== "string")) {
    throw new Error("Steps must be an array of strings");
  }
  const stepLength = steps[0].length;
  if (stepLength === 0) {
    throw new Error("Steps must be at least one character each");
  }
  if (steps.some((step) => step.length !== stepLength)) {
    throw new Error("Steps must be the same length");
  }
}

interface SpinnerDrawables {
  frames: Uint8Array[];
  clearFrame: Uint8Array;
}

const encoder = new TextEncoder();
const encode = encoder.encode.bind(encoder);

function stepString(
  preStep: string,
  prePerChar: string,
  postPerChar: string,
  postStep: string,
): (step: string) => string {
  return function joinStepString(step: string): string {
    return [
      preStep,
      ...repeat(prePerChar, step.length),
      ...step.split(""),
      ...repeat(postPerChar, step.length),
      postStep,
    ].join("");
  };
}

function createSpinnerDrawables(
  steps: readonly string[],
  preStep = "",
  prePerChar = "",
  postPerChar = ANSI_CURSOR_LEFT,
  postStep = "",
): SpinnerDrawables {
  checkSteps(steps);
  const joinStepString: (step: string) => string = stepString(
    preStep,
    prePerChar,
    postPerChar,
    postStep,
  );

  const frames = steps
    .map(joinStepString)
    .map(encode);

  const stepLength = steps[0].length;
  const clearString = repeat(" ", stepLength).join("");
  const clearStepString = joinStepString(clearString);
  const clearFrame = encode(clearStepString);

  return {
    frames,
    clearFrame,
  } as SpinnerDrawables;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const stepsDefault = ["-", "\\", "|", "/"] as const;
export const stepsBrailleCounter: string[] = Array.from(
  { length: 0x28FF - 0x2800 + 1 },
  (_, i) => String.fromCodePoint(0x2800 + i),
);

export interface SpinnerOptions {
  delay?: number;
  writer?: Deno.Writer;
  steps?: readonly string[];
}

const defaultSpinnerOptions: Required<SpinnerOptions> = {
  delay: 500,
  writer: Deno.stderr,
  steps: stepsDefault,
};

export class Spinner {
  private counter = 0;
  private shouldStop = false;
  private readonly doneDeferred = new Deferred<void>();
  private readonly delay: number;
  private readonly writer: Deno.Writer;
  private readonly frames: Uint8Array[];
  private readonly clearFrame: Uint8Array;

  constructor(options: SpinnerOptions = defaultSpinnerOptions) {
    this.delay = options.delay ?? defaultSpinnerOptions.delay;
    this.writer = options.writer ?? defaultSpinnerOptions.writer;

    const steps = options.steps ?? defaultSpinnerOptions.steps;
    const { frames, clearFrame } = createSpinnerDrawables(steps);
    this.frames = frames;
    this.clearFrame = clearFrame;
  }

  private async spinStep() {
    try {
      if (this.shouldStop) {
        return;
      }
      await this.writer.write(this.frames[this.counter]);
      this.counter = (this.counter + 1) % this.frames.length;
    } finally {
      if (this.shouldStop) {
        await this.writer.write(this.clearFrame);
        this.doneDeferred.resolve();
      } else {
        await sleep(this.delay);
        void this.spinStep();
      }
    }
  }

  start() {
    void this.spinStep();
  }

  stop() {
    this.shouldStop = true;
  }

  get done() {
    return this.doneDeferred.promise;
  }
}
