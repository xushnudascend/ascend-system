
-- Health & wellness daily log
CREATE TABLE public.health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours numeric,
  energy_level integer,
  stress_level integer,
  mood text,
  water_glasses integer DEFAULT 0,
  weight_kg numeric,
  steps integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own health" ON public.health_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Time leak detector
CREATE TABLE public.time_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  label text,
  minutes integer NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own time" ON public.time_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Output tracking (what you produced)
CREATE TABLE public.outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  category text,
  description text,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.outputs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own outputs" ON public.outputs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Excuse library
CREATE TABLE public.excuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  excuse_text text NOT NULL,
  category text,
  counter text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.excuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own excuses" ON public.excuses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Public fail log (Consequence System)
CREATE TABLE public.fail_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  what_failed text NOT NULL,
  xp_lost integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fail_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fail log public read" ON public.fail_log FOR SELECT USING (true);
CREATE POLICY "own fail insert" ON public.fail_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own fail delete" ON public.fail_log FOR DELETE USING (auth.uid() = user_id);

-- 1v1 Duels
CREATE TABLE public.duels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id uuid NOT NULL,
  opponent_id uuid NOT NULL,
  target text NOT NULL,
  duration_days integer NOT NULL DEFAULT 7,
  status text NOT NULL DEFAULT 'pending',
  winner_id uuid,
  challenger_score integer DEFAULT 0,
  opponent_score integer DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz
);
ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own duels" ON public.duels FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);
CREATE POLICY "create duels" ON public.duels FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "update own duels" ON public.duels FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Course progress
CREATE TABLE public.course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id text NOT NULL,
  lesson_index integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress" ON public.course_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_health_logs_user_date ON public.health_logs(user_id, log_date DESC);
CREATE INDEX idx_time_logs_user_date ON public.time_logs(user_id, log_date DESC);
CREATE INDEX idx_outputs_user_date ON public.outputs(user_id, log_date DESC);
CREATE INDEX idx_fail_log_created ON public.fail_log(created_at DESC);
