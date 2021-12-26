const buffer: Uint8Array = new Uint8Array(1024);
const numberOfBytes: number = <number> await Deno.stdin.read(buffer);
const bytes: Uint8Array = buffer.subarray(0, numberOfBytes);
console.log(`Reader.read -> ${numberOfBytes} bytes: ${bytes}`);
