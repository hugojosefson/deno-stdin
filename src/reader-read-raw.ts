const buffer: Uint8Array = new Uint8Array(1024);
Deno.stdin.setRaw(true);
const numberOfBytes: number = <number> await Deno.stdin.read(buffer);
Deno.stdin.setRaw(false);
const bytes: Uint8Array = buffer.subarray(0, numberOfBytes);
console.log(`Reader.read -> ${numberOfBytes} bytes: ${bytes}`);
