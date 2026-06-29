import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { authorize, type AuthDeps } from "./index.ts";

const SERVICE_KEY = "svc-secret-key";
const ADMIN_UID = "11111111-1111-1111-1111-111111111111";
const USER_UID = "22222222-2222-2222-2222-222222222222";

const deps = (over: Partial<AuthDeps> = {}): AuthDeps => ({
  serviceKey: SERVICE_KEY,
  getClaims: async (token) => {
    if (token === "admin-jwt") return { sub: ADMIN_UID };
    if (token === "user-jwt") return { sub: USER_UID };
    return null;
  },
  isAdmin: async (uid) => uid === ADMIN_UID,
  ...over,
});

const req = (h?: Record<string, string>) =>
  new Request("http://x/idempotency-metrics", { headers: h });

Deno.test("missing Authorization header → 401", async () => {
  const r = await authorize(req(), deps());
  assertEquals(r, { ok: false, status: 401, error: "Authorization required" });
});

Deno.test("malformed header (no Bearer) → 401", async () => {
  const r = await authorize(req({ Authorization: "Basic abc" }), deps());
  assertEquals((r as any).status, 401);
});

Deno.test("service role key → allowed", async () => {
  const r = await authorize(req({ Authorization: `Bearer ${SERVICE_KEY}` }), deps());
  assertEquals(r.ok, true);
});

Deno.test("invalid JWT (getClaims returns null) → 401", async () => {
  const r = await authorize(req({ Authorization: "Bearer bogus" }), deps());
  assertEquals(r, { ok: false, status: 401, error: "Invalid token" });
});

Deno.test("authenticated non-admin user → 403", async () => {
  const r = await authorize(req({ Authorization: "Bearer user-jwt" }), deps());
  assertEquals(r, { ok: false, status: 403, error: "Admin only" });
});

Deno.test("authenticated admin user → allowed", async () => {
  const r = await authorize(req({ Authorization: "Bearer admin-jwt" }), deps());
  assertEquals(r.ok, true);
});

Deno.test("service key takes precedence (does not call getClaims/isAdmin)", async () => {
  let claimsCalled = false, adminCalled = false;
  const r = await authorize(
    req({ Authorization: `Bearer ${SERVICE_KEY}` }),
    deps({
      getClaims: async () => { claimsCalled = true; return null; },
      isAdmin: async () => { adminCalled = true; return false; },
    }),
  );
  assertEquals(r.ok, true);
  assertEquals(claimsCalled, false);
  assertEquals(adminCalled, false);
});