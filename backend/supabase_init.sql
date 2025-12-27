-- Supabase initialization SQL
-- Run this in your Supabase project's SQL editor

-- STEP 1: Drop existing tables (if recreating)
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.feedback CASCADE;
DROP TABLE IF EXISTS public.contributions CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- STEP 2: Create tables with lowercase column names

-- Users table
CREATE TABLE public.users (
  uid text PRIMARY KEY,
  email text,
  name text,
  role text DEFAULT 'user',
  bio text,
  skills jsonb,
  sociallinks jsonb,
  stats jsonb,
  joineddate timestamptz DEFAULT now(),
  photourl text,
  registernumber text,
  mobilenumber text
);

-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  authoruid text REFERENCES public.users(uid) ON DELETE SET NULL,
  status text DEFAULT 'pending',
  repolink text,
  demolink text,
  linkedinpostlink text,
  metadata jsonb,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz
);

-- Contributions
CREATE TABLE public.contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projectid uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  useruid text REFERENCES public.users(uid) ON DELETE SET NULL,
  text text NOT NULL,
  "user" jsonb,
  createdat timestamptz DEFAULT now()
);

-- Feedback
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  useruid text REFERENCES public.users(uid) ON DELETE SET NULL,
  type text,
  message text,
  rating int,
  createdat timestamptz DEFAULT now()
);

-- Announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text,
  createdat timestamptz DEFAULT now()
);

-- Achievements
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  useruid text REFERENCES public.users(uid) ON DELETE CASCADE,
  title text,
  description text,
  awardedat timestamptz DEFAULT now()
);

-- STEP 3: Create indexes for performance
CREATE INDEX idx_projects_status ON public.projects (status);
CREATE INDEX idx_projects_authoruid ON public.projects (authoruid);
CREATE INDEX idx_users_email ON public.users (email);
CREATE INDEX idx_contributions_projectid ON public.contributions (projectid);

-- End of file
