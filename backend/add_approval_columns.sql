-- Add approval/status columns to feedback table for admin approval workflow
-- Run this in Supabase SQL Editor

-- Add columns to feedback table for approval workflow
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS resolved boolean DEFAULT false;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS reply text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS repliedat timestamptz;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Add userName and userEmail columns to denormalize user data for faster queries
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS useremail text;

-- Add achievement count column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS achievementcount int DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback (status);
CREATE INDEX IF NOT EXISTS idx_feedback_resolved ON public.feedback (resolved);
CREATE INDEX IF NOT EXISTS idx_feedback_useruid ON public.feedback (useruid);

-- Update existing feedback records to have 'pending' status if NULL
UPDATE public.feedback SET status = 'pending' WHERE status IS NULL;
UPDATE public.feedback SET resolved = false WHERE resolved IS NULL;

COMMENT ON COLUMN public.feedback.resolved IS 'Whether admin has replied to this feedback';
COMMENT ON COLUMN public.feedback.reply IS 'Admin reply to the feedback/query';
COMMENT ON COLUMN public.feedback.status IS 'Status: pending, approved, rejected';
