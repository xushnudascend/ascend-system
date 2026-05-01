
-- ============ NEW TABLES ============

CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  discipline_score int NOT NULL DEFAULT 0,
  focus_score int NOT NULL DEFAULT 0,
  social_score int NOT NULL DEFAULT 0,
  fitness_score int NOT NULL DEFAULT 0,
  money_score int NOT NULL DEFAULT 0,
  dopamine_score int NOT NULL DEFAULT 0,
  profile_type text,
  strengths text,
  weaknesses text,
  roadmap text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own assessments" ON public.assessments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.life_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  body int NOT NULL DEFAULT 50,
  mind int NOT NULL DEFAULT 50,
  money int NOT NULL DEFAULT 50,
  discipline int NOT NULL DEFAULT 50,
  social int NOT NULL DEFAULT 50,
  purpose int NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);
ALTER TABLE public.life_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own life scores" ON public.life_scores FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.war_room (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  mission text NOT NULL,
  enemy text,
  high_roi text,
  avoid text,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);
ALTER TABLE public.war_room ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own war room" ON public.war_room FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  split text NOT NULL,
  exercise text NOT NULL,
  sets int NOT NULL DEFAULT 3,
  reps int NOT NULL DEFAULT 10,
  weight_kg numeric DEFAULT 0,
  rpe int,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.nutrition_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  goal text NOT NULL DEFAULT 'maintain',
  calories int NOT NULL DEFAULT 0,
  protein_g int NOT NULL DEFAULT 0,
  carbs_g int NOT NULL DEFAULT 0,
  fat_g int NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own nutrition" ON public.nutrition_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.sleep_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  bedtime time,
  wake_time time,
  hours numeric,
  quality int,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sleep" ON public.sleep_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.daily_action_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  action_type text NOT NULL,
  count int NOT NULL DEFAULT 0,
  UNIQUE(user_id, log_date, action_type)
);
ALTER TABLE public.daily_action_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own limits" ON public.daily_action_limits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.wins_wall (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  category text DEFAULT 'general',
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wins_wall ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wins public read" ON public.wins_wall FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "own wins insert" ON public.wins_wall FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own wins delete" ON public.wins_wall FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  program_id text NOT NULL,
  current_day int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, program_id)
);
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own transformations" ON public.transformations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ SECURITY FIXES ============
REVOKE EXECUTE ON FUNCTION public.is_conv_participant(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_life_scores_user_date ON public.life_scores(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON public.workouts(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_nutrition_user_date ON public.nutrition_logs(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_user_date ON public.sleep_logs(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_time_logs_user_date ON public.time_logs(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_wins_created ON public.wins_wall(created_at DESC);
