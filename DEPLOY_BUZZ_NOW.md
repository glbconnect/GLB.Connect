# Quick Guide: Deploy Buzz Feature to Production (Vercel + Render)

## The Problem
You're seeing errors on your live site because:
1. The database migration hasn't been run on Render's production database
2. The new code needs to be deployed

## Quick Fix (3 Steps)

### Step 1: Create Migration Locally & Push to GitHub

```bash
# Make sure you're in the project root
cd D:\Projects\GLB.Connect

# Create the migration (you'll need DATABASE_URL in .env for this)
npx --package=prisma@6.5.0 prisma migrate dev --name add_buzz_models

# Commit and push everything
git add .
git commit -m "Add Buzz feature with database migration"
git push origin main
```

### Step 2: Render Will Auto-Deploy

Once you push to GitHub:
- Render will detect the changes
- It will run: `npx prisma@6.5.0 migrate deploy` (I updated render.yaml)
- This will create the tables in your production database
- Backend will restart with the new Buzz routes

**Check Render Dashboard:**
- Go to your `glb-connect-backend` service
- Watch the build logs
- Look for "Applied migration add_buzz_models" message
- If you see errors, check the logs

### Step 3: Vercel Will Auto-Deploy Frontend

- Vercel will detect the push
- It will rebuild the frontend with the Buzz page
- Should be live in 1-2 minutes

## If Auto-Deploy Doesn't Work

### Manual Render Deploy:
1. Go to Render Dashboard
2. Click on `glb-connect-backend` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Watch the logs to ensure migration runs

### Manual Vercel Deploy:
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Redeploy" → Choose latest commit

## Verify It's Working

1. **Check Render Logs:**
   - Should see: "Applied migration add_buzz_models"
   - Should see: "Server is running on port..."

2. **Test the API:**
   - Login to your app
   - Open browser DevTools (F12)
   - Go to Network tab
   - Navigate to `/buzz`
   - Check if `/api/buzz/posts` returns data (not 404/500)

3. **Test Creating a Post:**
   - Try creating a post
   - Check Network tab for errors
   - Check Console for error messages

## Common Issues

### Migration Fails on Render
**Error:** "Migration not found" or "No migrations to apply"
**Fix:** Make sure the migration file is committed to GitHub in `prisma/migrations/`

### Still Getting "Failed to load feed"
**Check:**
1. Render build logs - did migration run?
2. Render service logs - any runtime errors?
3. Browser console - what's the actual API error?
4. Network tab - what status code is returned?

### API Returns 404
**Fix:** 
- Verify backend is deployed with latest code
- Check that `server.js` includes buzz routes
- Verify the route: `/api/buzz/posts`

## Need to Check Something?

**Render Service Logs:**
- Render Dashboard → Your Service → Logs (real-time)

**Vercel Deployment Logs:**
- Vercel Dashboard → Your Project → Deployments → Click latest → View Logs

**Browser Console:**
- F12 → Console tab (for frontend errors)
- F12 → Network tab (for API call details)

## After Deployment

Once everything is deployed:
- ✅ Buzz page should load
- ✅ You can create posts
- ✅ Like, comment, share will work
- ✅ Stories will work
- ✅ Follow/unfollow will work

If you're still seeing errors after deployment, check the specific error message in the browser console or Render logs, and let me know what it says!

