
-- Mentor chat history
CREATE TABLE IF NOT EXISTS public.mentor_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mentor_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own mentor chats select" ON public.mentor_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own mentor chats insert" ON public.mentor_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own mentor chats delete" ON public.mentor_chats FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_chats_user_time ON public.mentor_chats(user_id, created_at);

-- Character chat history (per character)
CREATE TABLE IF NOT EXISTS public.character_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  character_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.character_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own char chats select" ON public.character_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own char chats insert" ON public.character_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own char chats delete" ON public.character_chats FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_char_chats_user_char_time ON public.character_chats(user_id, character_id, created_at);

-- Personalized plans (output of 15-question deep quiz)
CREATE TABLE IF NOT EXISTS public.personalized_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  profile_type text,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  strengths text,
  weaknesses text,
  daily_routine jsonb NOT NULL DEFAULT '[]'::jsonb,
  weekly_plan jsonb NOT NULL DEFAULT '[]'::jsonb,
  thirty_day_roadmap jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_habits jsonb NOT NULL DEFAULT '[]'::jsonb,
  warnings text,
  summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.personalized_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own plans select" ON public.personalized_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own plans insert" ON public.personalized_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own plans update" ON public.personalized_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_plans_user_time ON public.personalized_plans(user_id, created_at DESC);

-- Link root_causes to a specific fail and capture habit fix
ALTER TABLE public.root_causes ADD COLUMN IF NOT EXISTS fail_id uuid;
ALTER TABLE public.root_causes ADD COLUMN IF NOT EXISTS habit_fix text;
CREATE INDEX IF NOT EXISTS idx_root_causes_fail ON public.root_causes(fail_id);
