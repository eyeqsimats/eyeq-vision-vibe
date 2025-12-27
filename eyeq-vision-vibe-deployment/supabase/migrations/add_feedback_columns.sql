-- Add columns to feedback table for approval workflow
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS resolved boolean DEFAULT false;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS reply text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS repliedat timestamptz;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Add userName and userEmail columns to denormalize user data
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS useremail text;

-- Add achievement count column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS achievementcount int DEFAULT 0;

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  useruid text REFERENCES public.users(uid) ON DELETE CASCADE,
  title text,
  description text,
  awardedat timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback (status);
CREATE INDEX IF NOT EXISTS idx_feedback_resolved ON public.feedback (resolved);
CREATE INDEX IF NOT EXISTS idx_feedback_useruid ON public.feedback (useruid);

-- Update existing feedback records
UPDATE public.feedback SET status = 'pending' WHERE status IS NULL;
UPDATE public.feedback SET resolved = false WHERE resolved IS NULL;