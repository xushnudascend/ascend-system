
-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'direct' CHECK (type IN ('direct','group')),
  name TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_messages_conv ON public.messages(conversation_id, created_at);

-- Helper function (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_conv_participant(_conv UUID, _user UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = _conv AND user_id = _user);
$$;

-- RLS policies
CREATE POLICY "view own conversations" ON public.conversations FOR SELECT USING (public.is_conv_participant(id, auth.uid()));
CREATE POLICY "create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "view own participants" ON public.conversation_participants FOR SELECT USING (public.is_conv_participant(conversation_id, auth.uid()));
CREATE POLICY "join conversations" ON public.conversation_participants FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_conv_participant(conversation_id, auth.uid()));

CREATE POLICY "view conv messages" ON public.messages FOR SELECT USING (public.is_conv_participant(conversation_id, auth.uid()));
CREATE POLICY "send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_conv_participant(conversation_id, auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Identity enforcement
CREATE TABLE public.user_identity (
  user_id UUID PRIMARY KEY,
  identity TEXT NOT NULL,
  votes INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_identity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own identity" ON public.user_identity FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Micro decisions
CREATE TABLE public.micro_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  answer BOOLEAN NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.micro_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own micro" ON public.micro_decisions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Experiments
CREATE TABLE public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INT NOT NULL DEFAULT 7,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','abandoned')),
  before_score INT,
  after_score INT,
  notes TEXT
);
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own experiments" ON public.experiments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
