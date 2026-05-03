
-- Roles enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "view own role" ON public.user_roles;
CREATE POLICY "view own role" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "admin manages roles" ON public.user_roles;
CREATE POLICY "admin manages roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Admin stats function
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  SELECT jsonb_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'new_users_today', (SELECT count(*) FROM public.profiles WHERE created_at::date = current_date),
    'new_users_7d', (SELECT count(*) FROM public.profiles WHERE created_at > now() - interval '7 days'),
    'active_today', (SELECT count(DISTINCT user_id) FROM public.habit_logs WHERE created_at::date = current_date),
    'habits_logged_today', (SELECT count(*) FROM public.habit_logs WHERE created_at::date = current_date),
    'posts_total', (SELECT count(*) FROM public.posts),
    'posts_today', (SELECT count(*) FROM public.posts WHERE created_at::date = current_date),
    'contracts_active', (SELECT count(*) FROM public.contracts WHERE status = 'active'),
    'fails_today', (SELECT count(*) FROM public.fail_log WHERE created_at::date = current_date),
    'top_habits', (SELECT coalesce(jsonb_agg(jsonb_build_object('name', name, 'logs', n)), '[]'::jsonb)
                   FROM (SELECT h.name, count(hl.id) n FROM public.habits h
                         JOIN public.habit_logs hl ON hl.habit_id = h.id
                         WHERE hl.created_at > now() - interval '7 days'
                         GROUP BY h.name ORDER BY n DESC LIMIT 5) s)
  ) INTO result;
  RETURN result;
END $$;

REVOKE EXECUTE ON FUNCTION public.admin_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated;
