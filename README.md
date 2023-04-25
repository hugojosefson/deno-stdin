# Deno stdin experiments

Trying different ways of reading
[Deno.stdin](https://deno.land/api?s=Deno.stdin). I hope to be able to switch in
and out of `Deno.stdin.setRaw()`, while waiting for input, without locking up or
encountering errors.

That could be useful for making a
[port of ink for Deno](https://github.com/hugojosefson/ink) work correctly.

## Conclusion

```sh
deno run src/for-await-of-read-keypress.ts
```

Apparently, setting raw mode on `Deno.stdin` or `Deno.stdout`, and
reading/writing is fine, as long as you await the `Promise` returned from
[Deno.Writer.write](https://doc.deno.land/deno/stable/~/Deno.Writer#write).

Don't just write in the background haphazardly, and then try to
[Deno.setRaw()](https://doc.deno.land/deno/unstable/~/Deno.setRaw) while that's
happening. Work with `Deno.stdout` in one loop where you await each
`Deno.writer.write` and check a `let done: boolean` for whether to stop writing
and resetting the raw mode to `false`.
