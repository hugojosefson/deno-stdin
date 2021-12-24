# Deno stdin experiments

Trying different ways of reading
[Deno.stdin](https://doc.deno.land/deno/stable/~/Deno.stdin). I hope to be able
to switch in and out of
[Deno.setRaw()](https://doc.deno.land/deno/unstable/~/Deno.setRaw), while
waiting for input, without locking up or encountering errors.

That could be useful for making a
[port of ink for Deno](https://github.com/hugojosefson/ink) work correctly.
