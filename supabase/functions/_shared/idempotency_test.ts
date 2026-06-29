import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { memoryStore, withIdempotency } from "./idempotency.ts";

const cors = { "Access-Control-Allow-Origin": "*" };
const mkReq = (key?: string, method = "POST") =>
  new Request("http://x.test/fn", {
    method,
    headers: key ? { "Idempotency-Key": key, "Content-Type": "application/json" } : {},
    body: method === "POST" ? JSON.stringify({ a: 1 }) : undefined,
  });
const mkRun = (counter: { n: number }, delay = 0) => async () => {
  if (delay) await new Promise((r) => setTimeout(r, delay));
  counter.n += 1;
  return new Response(JSON.stringify({ run: counter.n }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

Deno.test("sequential duplicate with same key runs handler only once", async () => {
  const store = memoryStore();
  const c = { n: 0 };
  const run = mkRun(c);
  const r1 = await withIdempotency(mkReq("seq-1"), cors, run, store);
  const r2 = await withIdempotency(mkReq("seq-1"), cors, run, store);
  assertEquals(c.n, 1);
  assertEquals((await r1.json()).run, 1);
  assertEquals((await r2.json()).run, 1);
  assertEquals(r2.headers.get("Idempotent-Replay"), "true");
});

Deno.test("parallel duplicates with same key execute handler exactly once", async () => {
  const store = memoryStore();
  const c = { n: 0 };
  const run = mkRun(c, 50); // simulate slow handler so requests overlap
  const results = await Promise.all([
    withIdempotency(mkReq("par-1"), cors, run, store),
    withIdempotency(mkReq("par-1"), cors, run, store),
    withIdempotency(mkReq("par-1"), cors, run, store),
    withIdempotency(mkReq("par-1"), cors, run, store),
  ]);
  assertEquals(c.n, 1);
  const bodies = await Promise.all(results.map((r) => r.json()));
  for (const b of bodies) assertEquals(b.run, 1);
});

Deno.test("different keys run independently", async () => {
  const store = memoryStore();
  const c = { n: 0 };
  const run = mkRun(c);
  await withIdempotency(mkReq("k-a"), cors, run, store);
  await withIdempotency(mkReq("k-b"), cors, run, store);
  await withIdempotency(mkReq("k-a"), cors, run, store); // replays
  assertEquals(c.n, 2);
});

Deno.test("missing Idempotency-Key always executes", async () => {
  const store = memoryStore();
  const c = { n: 0 };
  const run = mkRun(c);
  await withIdempotency(mkReq(), cors, run, store);
  await withIdempotency(mkReq(), cors, run, store);
  assertEquals(c.n, 2);
});

Deno.test("non-POST methods bypass idempotency", async () => {
  const store = memoryStore();
  const c = { n: 0 };
  const run = mkRun(c);
  await withIdempotency(mkReq("g-1", "GET"), cors, run, store);
  await withIdempotency(mkReq("g-1", "GET"), cors, run, store);
  assertEquals(c.n, 2);
});