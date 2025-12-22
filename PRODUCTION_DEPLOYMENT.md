# Production Deployment Guide for Buzz Feature

## Current Setup
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: PostgreSQL (on Render or external)

## Steps to Deploy Buzz Feature to Production

### Step 1: Commit and Push Your Changes

Make sure all your Buzz feature code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Add Buzz feature with posts, likes, comments, shares, stories, and follow functionality"
git push origin main
```

**Important files that should be committed:**
- ✅ `prisma/schema.prisma` (with Buzz models)
- ✅ `src/controllers/buzzController.js`
- ✅ `src/routes/buzzRoutes.js`
- ✅ `server.js` (with buzz routes)
- ✅ `client/src/pages/Buzz.jsx`
- ✅ `client/src/components/buzz/*` (all Buzz components)
- ✅ `client/src/services/api.js` (with Buzz API calls)
- ✅ `client/src/App.jsx` (with Buzz route)
- ✅ `client/src/components/layout/Header.jsx` (with Buzz nav link)

### Step 2: Create Migration Locally First

Before deploying, create the migration file locally:

```bash
# Make sure you have DATABASE_URL in your .env
npx --package=prisma@6.5.0 prisma migrate dev --name add_buzz_models
```

This will create a migration file in `prisma/migrations/` that needs to be committed.

### Step 3: Commit the Migration File

```bash
git add prisma/migrations/
git commit -m "Add database migration for Buzz feature"
git push origin main
```

### Step 4: Trigger Render Deployment

**Option A: Automatic (if auto-deploy is enabled)**
- Render will automatically detect the push and start building
- The build command in `render.yaml` will run: `npx prisma migrate deploy`
- This will apply the migration to your production database

**Option B: Manual Trigger**
1. Go to Render Dashboard
2. Select your `glb-connect-backend` service
3. Click "Manual Deploy" → "Deploy latest commit"

### Step 5: Verify Render Build

Check the Render build logs to ensure:
- ✅ `npm install` completes successfully
- ✅ `npx prisma migrate deploy` runs without errors
- ✅ `npx prisma generate` completes
- ✅ Server starts successfully

**If migration fails in Render:**
- Check the build logs for specific errors
- Verify `DATABASE_URL` is set in Render environment variables
- Make sure the migration file exists in `prisma/migrations/`

### Step 6: Deploy Frontend to Vercel

**Option A: Automatic (if auto-deploy is enabled)**
- Vercel will automatically detect the push and rebuild

**Option B: Manual Deploy**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Redeploy" → "Redeploy with existing Build Cache" (or trigger a new build)

### Step 7: Verify Environment Variables

**On Render (Backend):**
- ✅ `DATABASE_URL` - Your PostgreSQL connection string
- ✅ `JWT_SECRET` - Your JWT secret key
- ✅ `CLIENT_URL` - Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- ✅ `NODE_ENV=production`

**On Vercel (Frontend):**
- ✅ `VITE_API_URL` - Your Render backend URL (e.g., `https://glb-connect-backend.onrender.com/api`)
- ✅ `VITE_SOCKET_URL` - Your Render backend URL (e.g., `https://glb-connect-backend.onrender.com`)

### Step 8: Test the Deployment

1. **Test Backend API:**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should return 200 OK

2. **Test Buzz Endpoints (requires auth):**
   - Login to your app
   - Navigate to `/buzz`
   - Check browser console for any errors
   - Try creating a post

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Network tab for API calls
   - Look for any 404 or 500 errors

## Troubleshooting Production Issues

### "Failed to load feed" Error

**Possible Causes:**
1. **Migration not run** - Check Render build logs for migration errors
2. **Database connection issue** - Verify `DATABASE_URL` in Render
3. **API route not found** - Verify backend is deployed with latest code
4. **CORS issue** - Check `CLIENT_URL` in Render matches your Vercel URL

**Solution:**
1. Check Render build logs
2. Verify migration ran: Look for "Applied migration" in logs
3. Check Render service logs for runtime errors
4. Verify API endpoint: `https://your-backend.onrender.com/api/buzz/posts` (requires auth)

### "Failed to create post" Error

**Possible Causes:**
1. **Database tables don't exist** - Migration didn't run
2. **File upload issue** - Check `uploads/` directory permissions on Render
3. **Authentication issue** - Verify JWT token is being sent

**Solution:**
1. Check if migration was applied (see Render logs)
2. Verify file upload directory exists: Render creates `uploads/` automatically
3. Check browser Network tab for the actual error response

### Migration Not Running on Render

**If `npx prisma migrate deploy` fails:**

1. **Check Prisma version:**
   - Render might be using a different Prisma version
   - Update `render.yaml` build command to specify version:
     ```yaml
     buildCommand: "npm install && npx prisma@6.5.0 migrate deploy && npx prisma@6.5.0 generate"
     ```

2. **Run migration manually via Render Shell:**
   - Go to Render Dashboard → Your Service → Shell
   - Run: `npx prisma migrate deploy`

3. **Check DATABASE_URL:**
   - Verify it's set correctly in Render environment variables
   - Make sure it's the production database URL

## Quick Checklist

Before deploying:
- [ ] All code committed and pushed to GitHub
- [ ] Migration file created and committed
- [ ] `render.yaml` has correct build command
- [ ] Environment variables set on Render
- [ ] Environment variables set on Vercel

After deploying:
- [ ] Render build completed successfully
- [ ] Migration applied (check logs)
- [ ] Backend API is accessible
- [ ] Frontend deployed on Vercel
- [ ] Buzz page loads without errors
- [ ] Can create posts
- [ ] Can like/comment/share

## Need Help?

If you're still seeing errors:
1. Check Render service logs (real-time logs)
2. Check Vercel deployment logs
3. Check browser console for frontend errors
4. Check Network tab for API call failures
5. Verify all environment variables are set correctly

