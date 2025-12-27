# Supabase Database Setup

## Quick Setup (Required for Login to Work)

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor** (left sidebar)
   - Click **New Query**

2. **Run the initialization SQL**
   - Copy the contents of `backend/supabase_init.sql`
   - Paste into the SQL editor
   - Click **Run** (or press Ctrl+Enter / Cmd+Enter)

3. **Verify tables were created**
   - Go to **Table Editor** (left sidebar)
   - You should see: `users`, `projects`, `contributions`, `feedback`, `announcements`, `achievements`

4. **Update backend .env with Service Role Key**
   - In Supabase dashboard → **Settings** → **API**
   - Copy the **service_role** key (NOT the anon/public key)
   - Update `backend/.env`:
     ```
     SUPABASE_SERVICE_KEY=eyJhbG...your_service_role_key_here
     ```

5. **Restart backend**
   ```bash
   cd backend
   npm run dev
   ```

6. **Test login**
   - Open browser to http://localhost:8080
   - Sign up or log in
   - Check backend console — should see successful sync

## Troubleshooting

- **500 error on /users/sync**: Supabase tables not created → run `backend/supabase_init.sql`
- **"Could not find table 'public.users'"**: Service role key missing or incorrect → update `SUPABASE_SERVICE_KEY` in `backend/.env`
- **404 on /users/:id**: User not in Supabase → sign up first, or check backend logs for sync errors
- **Firebase auth works but backend fails**: Check backend console logs for exact Supabase error message

## What Each Table Does

- **users**: Stores user profiles (uid, email, name, role, bio, stats)
- **projects**: Member-submitted projects (title, description, status)
- **contributions**: Contributions to projects
- **feedback**: User feedback submissions
- **announcements**: Admin announcements
- **achievements**: User achievements/badges
