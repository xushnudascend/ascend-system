
-- Extend profiles with public-facing fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS goals TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;

-- Make profiles publicly readable for leaderboard & post authors
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Profiles are publicly viewable"
  ON public.profiles FOR SELECT
  USING (true);

-- Community posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are publicly viewable"
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts"
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at DESC);

-- Post likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are publicly viewable"
  ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like posts"
  ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Trigger to keep likes_count in sync
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_post_likes_count ON public.post_likes;
CREATE TRIGGER trg_post_likes_count
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();
