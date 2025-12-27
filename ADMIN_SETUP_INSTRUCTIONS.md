# Admin Dashboard Setup Instructions

## Overview
The admin dashboard now has a full approval workflow for projects, feedbacks, and queries submitted by users.

## Database Migration Required

**IMPORTANT**: You must run the SQL migration to add new columns to your Supabase database before the admin dashboard will work correctly.

### Step 1: Run SQL Migration in Supabase

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Create a new query and paste the contents of `/backend/add_approval_columns.sql`
4. Click **Run** to execute the migration

This will add the following columns and features:
- **feedback table**: `resolved`, `reply`, `repliedat`, `status`, `username`, `useremail`
- **users table**: `achievementcount`
- Indexes for better query performance
- Default values for existing records

### Step 2: Verify Database Structure

After running the migration, verify the tables have the new columns:

```sql
-- Check feedback table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'feedback';

-- Check users table structure
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users';
```

## Features

### 1. **Project Approval Workflow**
- All submitted projects start with `status: 'pending'`
- Admin can approve or reject projects from the Projects tab
- Only approved projects are visible to regular users on the public projects page
- Projects can be edited by admin before approval

### 2. **Feedback & Query Management**
- Users can submit feedback and queries
- Feedback/queries start with `status: 'pending'` and `resolved: false`
- Admin can:
  - Reply to feedback/queries
  - Mark as approved/rejected
  - When admin replies, the feedback is automatically marked as `resolved: true` and `status: 'approved'`

### 3. **User Management**
- View all users with their stats (streak, achievements, etc.)
- Edit user profiles and manually adjust stats
- Award achievements to users
- Delete users (with confirmation)

### 4. **Dashboard Stats**
- Total members count
- Total projects count
- Daily active users (users who logged in today)
- Pending review count (projects awaiting approval)

## API Endpoints

### New Endpoints Added

#### Reply to Feedback
```
PUT /api/feedback/:id/reply
Body: { "reply": "Your response text" }
```

#### Update Feedback Status
```
PUT /api/feedback/:id/status
Body: { "status": "approved" | "rejected" | "pending" }
```

#### Existing Endpoints Enhanced
- `GET /api/admin/feedback` - Now returns enriched data with userName and userEmail
- `POST /api/feedback` - Now captures username and useremail automatically

## Testing the Workflow

### Test as a Regular User:
1. Login as a regular user (non-admin)
2. Submit a project from the member dashboard
3. Submit feedback/query
4. Projects and feedback should appear as "pending"

### Test as Admin:
1. Login as admin user
2. Navigate to Admin Dashboard
3. Check the "Projects" tab - you should see pending projects
4. Click approve/reject buttons
5. Check the "Member Queries" tab - you should see feedback/queries
6. Reply to queries - they'll be marked as resolved
7. Check the "Users" tab - you should see all registered users with their data

## Troubleshooting

### Admin Dashboard Shows Empty Data

**Problem**: Admin dashboard tabs show "No data" or empty lists

**Solutions**:
1. **Check Database Connection**: Verify Supabase credentials in `backend/.env`
2. **Run SQL Migration**: Make sure you ran `/backend/add_approval_columns.sql`
3. **Check Browser Console**: Look for API errors in the browser developer tools
4. **Check Backend Logs**: Run backend with `npm start` and watch for errors
5. **Verify User Role**: Make sure your user has `role: 'admin'` in the database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### User Data Not Showing

**Problem**: Users tab shows empty or missing information

**Possible Causes**:
1. No users in database
2. Users table missing required columns
3. API endpoint error

**Solution**:
```sql
-- Verify users exist
SELECT * FROM users LIMIT 5;

-- Ensure all required columns exist
SELECT column_name FROM information_schema.columns WHERE table_name = 'users';
```

### Projects Not Appearing

**Possible Causes**:
1. All projects are filtered by status
2. No projects in database
3. Column name mismatch (repolink vs repoLink)

**Solution**:
- Click "ALL" filter button in Projects tab
- Check database: `SELECT * FROM projects LIMIT 5;`

### Feedback/Queries Not Loading

**Solution**:
1. Ensure SQL migration was run (adds username, useremail columns)
2. Submit test feedback from member dashboard
3. Check database: `SELECT * FROM feedback;`
4. Verify feedback has `type` field set

## Data Model

### Feedback/Query Structure
```javascript
{
  id: uuid,
  useruid: string,
  username: string,      // NEW
  useremail: string,     // NEW
  type: 'general' | 'query' | 'bug',
  message: string,
  rating: number,
  resolved: boolean,     // NEW
  reply: string,         // NEW
  repliedat: timestamp,  // NEW
  status: 'pending' | 'approved' | 'rejected',  // NEW
  createdat: timestamp
}
```

### Project Structure
```javascript
{
  id: uuid,
  title: string,
  description: string,
  authoruid: string,
  status: 'pending' | 'approved' | 'rejected',
  repolink: string,
  demolink: string,
  linkedinpostlink: string,
  createdat: timestamp
}
```

## Auto-Refresh

The admin dashboard automatically refreshes all data every 10 seconds to keep stats up-to-date. You can also manually refresh using the "🔄 Refresh" button in the header.
