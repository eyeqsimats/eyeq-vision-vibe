# Admin API Endpoints Reference

## Base URL
```
http://localhost:5000/api/admin
```

## Authentication
All endpoints require:
```
Header: Authorization: Bearer {firebaseIdToken}
```

And the user must have `role: 'admin'` in the database.

---

## Endpoints

### 1. Get Admin Statistics
**GET** `/admin/stats`

Returns dashboard statistics.

**Response:**
```json
{
  "totalMembers": 3,
  "totalProjects": 5,
  "totalFeedback": 2,
  "dailyActiveUsers": 1
}
```

---

### 2. Get All Users
**GET** `/admin/users`

Returns all users with formatted data.

**Response:**
```json
[
  {
    "uid": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "photoURL": "https://...",
    "stats": {
      "currentStreak": 5,
      "longestStreak": 10
    },
    "achievementCount": 2
  }
]
```

---

### 3. Get All Members with Activity Counts (NEW)
**GET** `/admin/members`

Returns all members with project, contribution, and feedback counts.

**Response:**
```json
[
  {
    "uid": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "projectCount": 2,
    "contributionCount": 5,
    "feedbackCount": 1,
    "totalActivity": 8,
    "role": "user",
    "stats": { ... }
  }
]
```

---

### 4. Get Member Details (NEW)
**GET** `/admin/members/:uid`

Returns detailed profile for a specific member.

**Parameters:**
- `uid` (string): User ID

**Response:**
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "projectCount": 2,
  "contributionCount": 5,
  "feedbackCount": 1,
  "projects": [
    {
      "id": "project-id",
      "title": "My Project",
      "description": "...",
      "status": "approved",
      "createdAt": "2025-12-26T10:00:00Z"
    }
  ],
  "contributions": [
    {
      "id": "contrib-id",
      "description": "Logged daily contribution",
      "createdAt": "2025-12-26T09:00:00Z"
    }
  ],
  "feedback": [
    {
      "id": "feedback-id",
      "message": "Great app!",
      "type": "general"
    }
  ]
}
```

---

### 5. Get All Projects
**GET** `/admin/projects`

Returns all projects with author information enriched.

**Response:**
```json
[
  {
    "id": "project-id",
    "title": "My Project",
    "description": "Description",
    "status": "pending",
    "authorUid": "user-id",
    "authorName": "John Doe",
    "authorEmail": "john@example.com",
    "authorPhoto": "https://...",
    "repoLink": "https://github.com/...",
    "demoLink": "https://demo.com",
    "linkedInPostLink": "https://linkedin.com/...",
    "createdAt": "2025-12-26T10:00:00Z"
  }
]
```

---

### 6. Get All Contributions (NEW)
**GET** `/admin/contributions`

Returns all member contributions with enriched user data.

**Response:**
```json
[
  {
    "id": "contrib-id",
    "useruid": "user-id",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "description": "Completed feature X",
    "createdat": "2025-12-26T09:00:00Z"
  }
]
```

---

### 7. Get Activity Feed (NEW)
**GET** `/admin/activity`

Returns unified activity feed of all member activities (projects, contributions, feedback).

**Response:**
```json
[
  {
    "id": "activity-id",
    "type": "project",
    "title": "My Project",
    "authoruid": "user-id",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "timestamp": "2025-12-26T10:00:00Z"
  },
  {
    "id": "activity-id",
    "type": "contribution",
    "description": "Logged contribution",
    "useruid": "user-id",
    "userName": "Jane Doe",
    "userEmail": "jane@example.com",
    "timestamp": "2025-12-26T09:30:00Z"
  },
  {
    "id": "activity-id",
    "type": "feedback",
    "message": "Great app!",
    "useruid": "user-id",
    "userName": "Bob Smith",
    "userEmail": "bob@example.com",
    "timestamp": "2025-12-26T09:00:00Z"
  }
]
```

---

### 8. Get All Feedback
**GET** `/admin/feedback`

Returns all feedback with enriched user data.

**Response:**
```json
[
  {
    "id": "feedback-id",
    "type": "query",
    "message": "How do I...?",
    "rating": 4,
    "resolved": false,
    "useruid": "user-id",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "reply": "Here's how...",
    "createdat": "2025-12-26T10:00:00Z"
  }
]
```

---

### 9. Update Project Status
**PUT** `/admin/projects/:id/status`

Updates project status to approved or rejected.

**Parameters:**
- `id` (string): Project ID

**Body:**
```json
{
  "status": "approved"
}
```

---

### 10. Approve Project with Comment (NEW)
**PUT** `/admin/projects/:id/approve`

Approves or rejects project with optional comment.

**Parameters:**
- `id` (string): Project ID

**Body:**
```json
{
  "status": "approved",
  "comment": "Great project! Please add more documentation."
}
```

**Response:**
```json
{
  "id": "project-id",
  "title": "My Project",
  "status": "approved",
  "approvalcomment": "Great project! Please add more documentation.",
  "approvedat": "2025-12-26T10:05:00Z",
  ...
}
```

---

### 11. Update User
**PUT** `/admin/users/:uid`

Updates user profile and stats.

**Parameters:**
- `uid` (string): User ID

**Body:**
```json
{
  "name": "John Doe Updated",
  "bio": "New bio",
  "skills": ["JavaScript", "React"],
  "currentStreak": 10,
  "longestStreak": 15
}
```

---

### 12. Update User Achievements
**PUT** `/admin/users/:uid/achievements`

Updates user achievement count.

**Parameters:**
- `uid` (string): User ID

**Body:**
```json
{
  "achievementCount": 5
}
```

---

### 13. Update User (Edit All Fields)
**PUT** `/admin/users/:uid`

Comprehensive user update.

**Parameters:**
- `uid` (string): User ID

**Body:**
```json
{
  "name": "New Name",
  "bio": "New bio",
  "skills": ["Skill1", "Skill2"],
  "currentStreak": 10,
  "longestStreak": 20
}
```

---

### 14. Delete User (NEW)
**DELETE** `/admin/users/:uid`

Deletes a user and all their associated projects.

**Parameters:**
- `uid` (string): User ID

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

### 15. Update Project Details
**PUT** `/admin/projects/:id`

Updates project information.

**Parameters:**
- `id` (string): Project ID

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "repoLink": "https://github.com/...",
  "demoLink": "https://demo.com",
  "linkedInPostLink": "https://linkedin.com/..."
}
```

---

### 16. Reply to Feedback
**PUT** `/api/feedback/:id/reply`

Sends a reply to feedback.

**Parameters:**
- `id` (string): Feedback ID

**Body:**
```json
{
  "reply": "Thank you for your feedback!"
}
```

---

### 17. Update Feedback Status
**PUT** `/api/feedback/:id/status`

Updates feedback status and resolution.

**Parameters:**
- `id` (string): Feedback ID

**Body:**
```json
{
  "status": "approved",
  "resolved": true
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden (Not Admin)
```json
{
  "message": "User is not an admin"
}
```

### 404 Not Found
```json
{
  "message": "User/Project/Feedback not found"
}
```

### 500 Server Error
```json
{
  "message": "Error description"
}
```

---

## Testing the Endpoints

### Using cURL
```bash
# Get all members
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/members

# Get member details
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/members/user-id

# Approve project
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved","comment":"Great!"}' \
  http://localhost:5000/api/admin/projects/project-id/approve

# Delete user
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/users/user-id
```

### Using Frontend
The AdminDashboard.tsx automatically uses these endpoints with the axios client that includes auth headers.

---

## Data Enrichment

These endpoints automatically enrich data with related information:

- **Projects** → Author name, email, photo
- **Feedback** → User name, email
- **Contributions** → User name, email
- **Members** → Activity counts (projects, contributions, feedback)
- **Activity Feed** → User names and emails for all activities

---

## Rate Limiting

No rate limiting is currently configured. For production:
- Implement rate limiting per user
- Cache frequently accessed data
- Optimize queries with pagination

---

*API Documentation - December 2025*
