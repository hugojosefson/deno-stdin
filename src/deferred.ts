interface IDeferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (reason: unknown) => void;
  readonly isResolved: boolean;
  readonly isRejected: boolean;
  readonly isDone: boolean;
}

export class Deferred<T> implements IDeferred<T> {
  readonly promise: Promise<T>;
  private _resolve!: (value: T) => void;
  private _reject!: (reason: unknown) => void;
  private _isResolved = false;
  private _isRejected = false;
  get isResolved() {
    return this._isResolved;
  }
  get isRejected() {
    return this._isRejected;
  }
  get isDone() {
    return this._isResolved || this._isRejected;
  }
  get resolve() {
    return this._resolve;
  }
  get reject() {
    return this._reject;
  }

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this._resolve = (value: T) => {
        this._isResolved = true;
        resolve(value);
      };
      this._reject = (reason: unknown) => {
        this._isRejected = true;
        reject(reason);
      };
    });
  }
}
