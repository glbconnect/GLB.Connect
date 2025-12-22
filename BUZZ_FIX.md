# Fix for Buzz Page Errors

## Problem
You're seeing these errors:
- "Failed to load feed. Please try again."
- "Failed to create post. Please try again."

## Root Cause
The database tables for the Buzz feature don't exist yet. The migration hasn't been run.

## Solution

### Step 1: Run the Database Migration

Open your terminal in the project root directory and run:

```bash
npx prisma migrate dev --name add_buzz_models
```

This will:
- Create the Post, PostLike, Comment, Share, Story, and Follow tables
- Add `branch` and `year` fields to the User table
- Update your database schema

### Step 2: Verify Migration

After the migration completes, you should see:
- ✅ Migration files created in `prisma/migrations/`
- ✅ Database tables created
- ✅ Prisma client regenerated

### Step 3: Restart Your Server

Restart your backend server:
```bash
npm run server
```

### Step 4: Test the Buzz Page

1. Make sure you're logged in
2. Navigate to `/buzz`
3. The feed should load (it will be empty if no posts exist yet)
4. Try creating a post

## If Migration Fails

### Check DATABASE_URL
Make sure your `.env` file has the `DATABASE_URL` set:
```env
DATABASE_URL="your-postgresql-connection-string"
```

### Check Prisma Version
The project uses Prisma 6.5.0. If you have issues, try:
```bash
npm install prisma@6.5.0 @prisma/client@6.6.0
```

### Manual Migration
If automatic migration fails, you can create the tables manually using the SQL from the migration file, or use:
```bash
npx prisma db push
```

## After Migration

Once the migration is complete:
- ✅ All API endpoints will work
- ✅ You can create posts
- ✅ You can like, comment, and share
- ✅ Stories will work
- ✅ Follow/unfollow will work

## Still Having Issues?

Check the browser console and server logs for specific error messages. The improved error handling will now show more detailed error messages.

