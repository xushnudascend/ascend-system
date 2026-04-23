
-- contracts: user commitments
CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  target text NOT NULL,
  duration_days integer NOT NULL DEFAULT 7,
  stake_xp integer NOT NULL DEFAULT 50,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  completed_days integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own contracts" ON public.contracts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- daily_feedback
CREATE TABLE public.daily_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  input_summary text,
  analysis text,
  adaptation text,
  feedback text,
  score integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);
ALTER TABLE public.daily_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own daily feedback" ON public.daily_feedback FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- root_causes
CREATE TABLE public.root_causes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  failure text NOT NULL,
  cause text NOT NULL,
  category text DEFAULT 'general',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.root_causes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own root causes" ON public.root_causes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ai_recommendations
CREATE TABLE public.ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  next_step text NOT NULL,
  reason text,
  context jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ai recs" ON public.ai_recommendations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- plan_adaptations
CREATE TABLE public.plan_adaptations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  direction text NOT NULL, -- 'simplify' | 'harden'
  reason text,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.plan_adaptations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own adaptations" ON public.plan_adaptations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
