# Buzz Feature Setup Guide

## Database Migration

After adding the Buzz models to the Prisma schema, you need to run a migration:

```bash
npx prisma migrate dev --name add_buzz_models
```

This will create the following tables:
- `Post` - Stores user posts
- `PostLike` - Stores post likes
- `Comment` - Stores post comments
- `Share` - Stores post shares
- `Story` - Stores user stories (expires after 24 hours)
- `Follow` - Stores user follow relationships

It will also add `branch` and `year` fields to the `User` model.

## Backend Setup

The backend is already configured with:
- Routes: `/api/buzz/*` (see `src/routes/buzzRoutes.js`)
- Controllers: All Buzz functionality (see `src/controllers/buzzController.js`)
- File uploads: Images are stored in `uploads/posts/` and `uploads/stories/`

## Frontend Setup

The frontend is already configured with:
- API calls in `client/src/services/api.js`
- Components in `client/src/components/buzz/`
- Main page at `client/src/pages/Buzz.jsx`
- Route added to `client/src/App.jsx` at `/buzz`
- Navbar link added in `client/src/components/layout/Header.jsx`

## Features Implemented

✅ Create posts (text + image)
✅ Like/Unlike posts
✅ Comment on posts
✅ Share posts
✅ View feed (latest first)
✅ User stats (posts, followers, following)
✅ Suggested students
✅ Top contributors
✅ Trending posts
✅ Stories (24-hour expiration)
✅ Follow/Unfollow users

## API Endpoints

All endpoints require authentication (Bearer token):

- `GET /api/buzz/posts` - Get all posts
- `POST /api/buzz/posts` - Create a post (multipart/form-data)
- `POST /api/buzz/posts/:postId/like` - Toggle like
- `POST /api/buzz/posts/:postId/comment` - Add comment
- `GET /api/buzz/posts/:postId/comments` - Get comments
- `POST /api/buzz/posts/:postId/share` - Share post
- `GET /api/buzz/stats` - Get user stats
- `GET /api/buzz/suggestions` - Get suggested students
- `GET /api/buzz/top-contributors` - Get top contributors
- `GET /api/buzz/trending` - Get trending posts
- `GET /api/buzz/stories` - Get active stories
- `POST /api/buzz/stories` - Create story (multipart/form-data)
- `POST /api/buzz/users/:followingId/follow` - Toggle follow

## Testing

1. Run the migration: `npx prisma migrate dev --name add_buzz_models`
2. Start the backend: `npm run server`
3. Start the frontend: `cd client && npm run dev`
4. Login and navigate to `/buzz`
5. Create a post, like, comment, and share!

## Notes

- Images are stored locally in `uploads/posts/` and `uploads/stories/`
- Stories automatically expire after 24 hours
- All posts are sorted by creation date (newest first)
- User stats are calculated in real-time

