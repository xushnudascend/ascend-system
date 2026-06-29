CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  key text PRIMARY KEY,
  response jsonb,
  status int NOT NULL DEFAULT 200,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.idempotency_keys TO service_role;
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;
-- No policies for anon/authenticated: only service_role (edge functions) accesses it.
CREATE INDEX IF NOT EXISTS idempotency_keys_created_at_idx ON public.idempotency_keys(created_at);