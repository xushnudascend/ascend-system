import { assert, assertEquals, assertAlmostEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { buildMetricsBody } from "./index.ts";

const baseMetrics = {
  requests: 0, store_hits: 0, inflight_hits: 0, misses: 0,
  handler_runs: 0, errors: 0, started_at: "2026-01-01T00:00:00.000Z",
};

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function assertShape(body: any) {
  // top-level keys
  assertEquals(Object.keys(body).sort(), ["instance", "now", "store"]);
  // types
  assert(typeof body.now === "string" && ISO.test(body.now), "now must be ISO");
  const i = body.instance;
  for (const k of ["requests","store_hits","inflight_hits","misses","handler_runs","errors","hit_rate"]) {
    assertEquals(typeof i[k], "number", `instance.${k} must be number`);
    assert(Number.isFinite(i[k]), `instance.${k} must be finite`);
    assert(i[k] >= 0, `instance.${k} must be >= 0`);
  }
  assert(typeof i.started_at === "string" && ISO.test(i.started_at), "started_at must be ISO");
  const s = body.store;
  for (const k of ["total_keys","keys_last_24h"]) {
    assertEquals(typeof s[k], "number");
    assert(Number.isInteger(s[k]) && s[k] >= 0);
  }
}

Deno.test("schema: zero-state response matches contract", () => {
  const body = buildMetricsBody(baseMetrics, { total_keys: 0, keys_last_24h: 0 });
  assertShape(body);
  assertEquals(body.instance.hit_rate, 0);
});

Deno.test("schema: populated response — hit_rate computed correctly", () => {
  const m = { ...baseMetrics, requests: 10, store_hits: 6, inflight_hits: 2, misses: 2, handler_runs: 2 };
  const body = buildMetricsBody(m, { total_keys: 100, keys_last_24h: 25 });
  assertShape(body);
  assertAlmostEquals(body.instance.hit_rate, 80);
  assertEquals(body.store.total_keys, 100);
  assertEquals(body.store.keys_last_24h, 25);
});

Deno.test("schema: divide-by-zero guard when requests=0", () => {
  const body = buildMetricsBody(baseMetrics, { total_keys: 0, keys_last_24h: 0 });
  assert(Number.isFinite(body.instance.hit_rate));
  assertEquals(body.instance.hit_rate, 0);
});

Deno.test("schema: nullish store counts default to 0", () => {
  // simulate Supabase head-count returning null
  const body = buildMetricsBody(baseMetrics, { total_keys: null as any, keys_last_24h: null as any });
  assertEquals(body.store.total_keys, 0);
  assertEquals(body.store.keys_last_24h, 0);
});

Deno.test("schema: hit_rate rounded to 2 decimals", () => {
  const m = { ...baseMetrics, requests: 3, store_hits: 1, inflight_hits: 0 };
  const body = buildMetricsBody(m, { total_keys: 0, keys_last_24h: 0 });
  // 1/3 = 33.333… → 33.33
  assertEquals(body.instance.hit_rate, 33.33);
});

Deno.test("schema: JSON-serializable round-trip preserves shape", () => {
  const body = buildMetricsBody(baseMetrics, { total_keys: 5, keys_last_24h: 1 });
  const parsed = JSON.parse(JSON.stringify(body));
  assertShape(parsed);
});