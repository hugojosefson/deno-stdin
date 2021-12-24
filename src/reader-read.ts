const buf: Uint8Array = new Uint8Array(1024);
const numberOfBytes: number = <number> await Deno.stdin.read(buf);
