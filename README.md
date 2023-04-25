# Deno stdin experiments

Trying different ways of reading
[Deno.stdin](https://deno.land/api?s=Deno.stdin). I hope to be able to switch in
and out of `Deno.stdin.setRaw()`, while waiting for input, without locking up or
encountering errors.

That could be useful for making a
[port of ink for Deno](https://github.com/hugojosefson/ink) work correctly.

## Conclusion

```sh
deno run https://raw.githubusercontent.com/hugojosefson/deno-stdin/main/src/for-await-of-read-keypress.ts --silent
```

Source code in:
[src/for-await-of-read-keypress.ts](src/for-await-of-read-keypress.ts)

Apparently, setting raw mode on `Deno.stdin`, and reading/writing is fine, as
long as you await the `Promise` returned from
[Deno.Writer.write](https://deno.land/api?s=Deno.Writer#write).

Don't just write in the background haphazardly, and then try to
`Deno.stdin.setRaw()` while that's happening. Instead, in a loop where you await
each `Deno.Writer.write`, check a `let done: boolean` flag for whether to stop
writing and resetting the raw mode to `false`.
