-- Quick fix: Add missing columns to existing tables
-- Run this in Supabase SQL Editor if you haven't recreated the tables yet

-- Add missing columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repolink text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS demolink text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS linkedinpostlink text;

-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS photourl text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS registernumber text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS mobilenumber text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sociallinks jsonb;

-- Add missing columns to feedback table
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS rating int;

-- Update announcements table structure
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS message text;

-- Add user column to contributions
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS "user" jsonb;
ALTER TABLE public.contributions ADD COLUMN IF NOT EXISTS text text;
