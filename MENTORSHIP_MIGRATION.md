# Mentorship Feature Migration Guide

## Overview

The Mentorship feature has been fully implemented with:
- ✅ Database schema (Poll, PollOption, PollVote, MentorshipSession, SessionEnrollment)
- ✅ Backend API (controllers and routes)
- ✅ Frontend page and components
- ✅ Navigation integration

## Step 1: Run Database Migration

Run the Prisma migration to create the new tables:

```bash
npx --package=prisma@6.5.0 prisma migrate dev --name add_mentorship_models
```

Or if you have Prisma installed locally:

```bash
.\node_modules\.bin\prisma.cmd migrate dev --name add_mentorship_models
```

## Step 2: Verify Migration

After migration, you should see:
- ✅ `Poll` table created
- ✅ `PollOption` table created
- ✅ `PollVote` table created
- ✅ `MentorshipSession` table created
- ✅ `SessionEnrollment` table created
- ✅ User model updated with new relations

## Step 3: Restart Server

Restart your backend server:

```bash
npm run server
```

## Step 4: Test the Feature

1. **Navigate to Mentorship page**: `/mentorship`
2. **As Mentor/Alumni** (users with batchYear 2+ years ago):
   - Click "Create Poll" to create a poll
   - Click "Create Session" to create a mentorship session
3. **As Student/Junior**:
   - View active polls and vote
   - View upcoming sessions and enroll
   - Check "My Sessions" tab for enrolled sessions

## Features

### Polls
- Mentors can create polls with multiple options
- Students can vote (one vote per poll, can change vote)
- Polls expire at specified date/time
- Real-time vote counts and percentages

### Sessions
- Mentors can create mentorship sessions
- Specify topic, date/time, duration, max participants
- Add meeting link (Google Meet/Zoom)
- Students can enroll in sessions
- "Join Meeting" button appears when session is live
- Session status (upcoming, live, past)

### Role Detection
- Automatically detects if user is mentor/alumni based on `batchYear`
- Mentors: Users graduated 2+ years ago
- Students: All other users

## API Endpoints

### Polls
- `GET /api/mentorship/polls` - Get all active polls
- `POST /api/mentorship/polls` - Create poll (mentor only)
- `POST /api/mentorship/polls/:pollId/vote` - Vote on poll

### Sessions
- `GET /api/mentorship/sessions` - Get upcoming sessions
- `POST /api/mentorship/sessions` - Create session (mentor only)
- `POST /api/mentorship/sessions/:sessionId/enroll` - Enroll in session
- `GET /api/mentorship/sessions/my` - Get my enrolled sessions
- `GET /api/mentorship/sessions/mentor` - Get sessions I'm hosting (mentor only)

## Troubleshooting

### "Database tables not found"
- Make sure you ran the migration
- Check that `DATABASE_URL` is set in `.env`

### "Only mentors/alumni can create polls/sessions"
- This is expected behavior
- Only users with `batchYear` 2+ years ago can create polls/sessions
- Update user's `batchYear` in database if needed

### "Poll has expired" or "Cannot enroll in past sessions"
- Polls and sessions have expiry/scheduled dates
- Only active polls and upcoming sessions are available

## Next Steps

1. ✅ Run migration
2. ✅ Test as mentor (create poll/session)
3. ✅ Test as student (vote/enroll)
4. ✅ Verify all features work correctly

The feature is now ready to use! 🎉

