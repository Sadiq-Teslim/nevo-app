# Nevo Frontend → Backend Contract

_Last updated: December 7, 2025_

The current Nevo React frontend stores almost everything in local storage and renders with mock data. This document enumerates the backend endpoints that must exist so the UI can become fully data-driven. It focuses on required payloads, expected responses, and how each endpoint is used across student, teacher, and parent experiences.

---

## Domain Overview

| Area | Purpose in UI | Backend Responsibilities |
| --- | --- | --- |
| Authentication | Signup/Login forms | Issue tokens, persist role-specific profiles, expose assessment status |
| Diagnostic Assessment | 6-question flow that assigns a learning profile | Store raw answers + computed profile, return personalization metadata |
| Lessons & XP | Student dashboards + Lesson view | Serve personalized lesson content, track progress, award XP/streaks |
| Connections/Invites | "Add Connections" modal for students & teachers | Send invitations linking students↔teachers↔parents, manage statuses |
| Teacher Tools | Upload lesson, manage class, see insights | Ingest lesson content, run AI personalization jobs, expose class progress |
| Parent Insights | Overview/progress/guidance tabs | Aggregate child progress, recent lessons, AI guidance recommendations |

All routes below should be protected with JWT/Bearer tokens except where noted.

---

## 1. Authentication & Session

### `POST /auth/signup`
Creates a new account for `student`, `teacher`, or `parent`.

**Request body**
```json
{
  "role": "student",
  "fullName": "Amara Johnson",
  "email": "amara@student.com",
  "password": "string",
  "studentProfile": {
    "age": 10,
    "school": "Queensfield Primary",
    "grade": "Grade 5"
  },
  "teacherProfile": null,
  "parentProfile": null
}
```
Role-specific objects are optional except for the chosen role.

**Response**
```json
{
  "user": {
    "id": "stu_123",
    "role": "student",
    "fullName": "Amara Johnson",
    "email": "amara@student.com",
    "assessmentCompleted": false
  },
  "token": "jwt"
}
```

### `POST /auth/login`
Authenticates a user and tells the frontend where to route.

**Request**: `{ "email": "teacher@school.com", "password": "secret" }`

**Response**
```json
{
  "user": {
    "id": "tch_001",
    "role": "teacher",
    "fullName": "Mrs. Ade",
    "assessmentCompleted": true,
    "defaultRoute": "/teacher/dashboard"
  },
  "token": "jwt",
  "refreshToken": "string"
}
```

### `POST /auth/refresh`
Refresh access tokens using the refresh token.

### `POST /auth/logout`
Optional endpoint to revoke refresh tokens.

---

## 2. Diagnostic Assessment
Supports the 6-question wizard (`/assessment`). Backend can optionally calculate the profile; if the frontend continues to calculate it, submit the derived profile as part of the payload.

### `POST /assessments`
Stores answers + resulting profile.

**Request**
```json
{
  "studentId": "stu_123",
  "answers": {
    "0": "videos",
    "1": "lose-focus",
    "2": "visual-steps",
    "3": "diagrams",
    "4": "distracted",
    "5": "drawing"
  },
  "computedProfile": "Visual",
  "completedAt": "2025-12-07T10:00:00Z"
}
```

**Response**
```json
{
  "assessmentId": "asm_987",
  "profile": "Visual",
  "personalization": {
    "title": "Visual Learner",
    "description": "You learn best through diagrams...",
    "recommendedBreakIntervalMinutes": 10
  }
}
```

### `GET /students/:studentId/assessment`
Returns latest assessment for dashboards/settings. Response mirrors the `assessmentData` object currently pulled from `localStorage`:
```json
{
  "profile": "Visual",
  "completedAt": "2025-12-07T10:00:00Z",
  "personalization": { ... }
}
```

---

## 3. Student Experience
Everything rendered in `StudentDashboard` and `LessonView` relies on the following resources.

### `GET /students/:studentId/summary`
Used for the welcome hero, XP, streaks, current lesson.
```json
{
  "fullName": "Amara Johnson",
  "xp": 215,
  "streakDays": 7,
  "learningProfile": {
    "code": "Visual",
    "title": "Visual Learner",
    "description": "You learn best through diagrams..."
  },
  "featuredLessonId": "les_001"
}
```

### `GET /students/:studentId/lessons?filter=today|all`
Supplies the cards rendered under "Today's Featured Lesson" and "All Lessons".
```json
[
  {
    "id": "les_001",
    "title": "Introduction to Fractions",
    "subject": "Mathematics",
    "status": "in-progress",
    "progressPercent": 65,
    "xpReward": 50,
    "durationMinutes": 15
  }
]
```

### `GET /lessons/:lessonId`
`LessonView` also needs profile-specific slides. Backend should personalize based on the student's stored profile or a `?profile=` query.
```json
{
  "id": "les_001",
  "title": "Introduction to Fractions",
  "subject": "Mathematics",
  "xpReward": 50,
  "profile": "visual",
  "slides": [
    {
      "type": "visual",
      "title": "Understanding Fractions Visually",
      "content": "A fraction represents parts of a whole object.",
      "visual": "🟦🟦🟦⬜"
    },
    {
      "type": "interactive",
      "title": "Visual Practice",
      "question": {
        "text": "What fraction of boxes are yellow?",
        "options": ["1/2","3/6","3/3","6/3"],
        "correct": 1,
        "explanation": "3 yellow out of 6"
      }
    }
  ]
}
```
Slide `type` should align with the UI's switch logic (`intro`, `content`, `visual`, `interactive`, `quiz`, `summary`).

### `PATCH /students/:studentId/lessons/:lessonId/progress`
Updates progress as the student advances.
```json
{
  "currentSlide": 3,
  "progressPercent": 60
}
```
Returns the updated lesson state.

### `POST /students/:studentId/lessons/:lessonId/complete`
Called when the student finishes a lesson.
```json
{
  "score": 4,
  "maxScore": 5,
  "xpEarned": 50,
  "timeSpentMinutes": 18
}
```
Response must include the student's new XP + streak so the dashboard can refresh.

### `GET /students/:studentId/progress`
Feeds the "Progress" tab (subject breakdown + achievements).
```json
{
  "subjects": [
    { "name": "Mathematics", "progressPercent": 75 },
    { "name": "English", "progressPercent": 60 }
  ],
  "achievements": [
    { "code": "streak_7", "title": "7 Day Streak", "description": "Keep it up!" }
  ]
}
```

### Connections & Invites
Used by `AddConnections` when students invite parents/teachers.

#### `GET /students/:studentId/connections`
Returns current accepted connections plus pending invites.

#### `POST /connections/invite`
Generic endpoint for students/teachers sending invites.
```json
{
  "inviterId": "stu_123",
  "inviterRole": "student",
  "inviteeEmail": "teacher@school.com",
  "inviteeRole": "teacher"
}
```
**Response**: `{ "inviteId": "inv_789", "status": "pending" }`

#### `PATCH /connections/:inviteId`
Accept/decline invites. Response returns updated connection object so the UI can remove it from "Pending".

---

## 4. Teacher Experience

### `GET /teachers/:teacherId/class`
Populates the "Class Overview" tab and stats.
```json
{
  "summary": {
    "totalStudents": 24,
    "avgProgressPercent": 73,
    "activeLessons": 15,
    "completionRatePercent": 73
  },
  "students": [
    {
      "id": "stu_123",
      "name": "Amara Johnson",
      "profile": "Visual Learner",
      "progressPercent": 78,
      "lessonsCompleted": 12,
      "totalLessons": 15,
      "lastActive": "2025-12-06T14:00:00Z"
    }
  ]
}
```

### `POST /teachers/:teacherId/lessons`
Drives the "Upload Lesson" form. Backend should accept raw lesson content, kick off AI personalization, and return a job reference.
```json
{
  "title": "Introduction to Fractions",
  "subject": "Mathematics",
  "content": "Teacher's original lesson text"
}
```
**Response**
```json
{
  "lessonId": "les_001",
  "personalizationJobId": "job_456",
  "status": "processing"
}
```
Optional `GET /personalization-jobs/:jobId` to poll status and fetch per-student variants once complete.

### `GET /teachers/:teacherId/insights`
Feeds the "Student Insights" cards.
```json
[
  {
    "studentId": "stu_123",
    "profile": "Visual Learner",
    "progressPercent": 78,
    "strengths": ["Consistent engagement", "Strong in visual content"],
    "recommendations": ["Add more interactive elements"]
  }
]
```

### `POST /teachers/:teacherId/invitations`
Used inside `AddConnections` when teachers invite students (same payload shape as `/connections/invite` but scoped to teacher).

---

## 5. Parent Experience

### `GET /parents/:parentId/children`
Lists linked children for the overview header.
```json
[
  {
    "childId": "stu_123",
    "name": "Amara Johnson",
    "profile": "Visual Learner",
    "overallProgressPercent": 78,
    "streakDays": 7,
    "xp": 215
  }
]
```

### `GET /parents/:parentId/children/:childId/summary`
Contains the card metrics + streak displayed on the overview tab.

### `GET /parents/:parentId/children/:childId/lessons?limit=3`
Feeds "Recent Lessons" with completion flags and scores.

### `GET /parents/:parentId/children/:childId/progress`
Returns subject progress percentages and achievements (same structure as the student progress tab).

### `GET /parents/:parentId/children/:childId/guidance`
Supplies AI guidance copy shown in the "AI Guidance" tab.
```json
{
  "profile": "Visual Learner",
  "recommendations": [
    "Use diagrams, charts, and visual aids when explaining concepts",
    "Encourage drawing or sketching ideas"
  ],
  "optimalLearningWindows": [
    { "start": "09:00", "end": "11:00" },
    { "start": "14:00", "end": "16:00" }
  ],
  "encouragementTips": [
    "Celebrate the 7-day streak",
    "Acknowledge effort, not just results"
  ]
}
```

---

## 6. Data Model Reference

- **User**: `id`, `role`, `fullName`, `email`, `assessmentCompleted`, role-specific profile fields.
- **Assessment**: `assessmentId`, `studentId`, `answers`, `profile`, `completedAt`, `personalization` metadata.
- **Lesson**: `lessonId`, `title`, `subject`, `status`, `progressPercent`, `xpReward`, `durationMinutes`, `slides` (array), `profileVariant`.
- **ProgressSummary**: `subjects[]`, `achievements[]`, `xp`, `streakDays`.
- **ConnectionInvite**: `inviteId`, `inviterId`, `inviterRole`, `inviteeEmail`, `inviteeRole`, `status`, `createdAt`, `acceptedAt`.

All timestamps should be ISO-8601 strings (UTC). Percentages are numeric (0-100). XP and streaks are integers.

---

## 7. Supabase Notes

The repo includes `src/supabase/functions/server/kv_store.tsx`, an autogenerated helper for a single `kv_store_db9fc2ab` table. It currently only supports generic key-value reads/writes and is not referenced by the React code. You can repurpose this table for simple feature flags or prototypes, but it does **not** replace the endpoints above.

---

## 8. Implementation Checklist

- [ ] Protect every route with role-aware authorization (students cannot hit teacher insights, etc.).
- [ ] Emit assessment status on login so the frontend knows whether to redirect to `/assessment`.
- [ ] Ensure lesson personalization supports the `slide.type` taxonomy already hard-coded in `LessonView.tsx`.
- [ ] Send updated XP/streak totals whenever lessons are completed so dashboards update without another fetch.
- [ ] Normalize invite handling so both students and teachers can reuse the same endpoint + status codes.
- [ ] Provide mock fixtures that match these response shapes to unblock frontend work before the production backend is ready.
