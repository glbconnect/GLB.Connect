# Fix for Image Upload Display Issue

## Problem
Uploaded images on the Buzz page are not showing in production (Render + Vercel).

## Root Causes Found

1. **SERVER_URL not set in production** - Backend was using `process.env.SERVER_URL || 'http://localhost:5000'` which defaults to localhost in production
2. **Static file serving for subdirectories** - Images are saved to `uploads/posts/` and `uploads/stories/` but the route only handled single-level paths

## Fixes Applied

### 1. Dynamic Server URL Detection
Updated `src/controllers/buzzController.js` to automatically detect the server URL from the request:
- Uses `process.env.SERVER_URL` if set
- Otherwise uses `req.protocol + req.get('host')` to get the actual server URL
- Falls back to localhost only for local development

### 2. Fixed Static File Serving
Updated `server.js` to properly serve files from subdirectories:
- Removed the restrictive `/uploads/:filename` route
- `express.static` now handles all subdirectories automatically (`/uploads/posts/`, `/uploads/stories/`)
- Added proper CORS headers
- Added cache headers for images

## What Changed

### Backend (`src/controllers/buzzController.js`)
- ✅ `getPosts()` - Now uses dynamic server URL
- ✅ `createPost()` - Now uses dynamic server URL  
- ✅ `getStories()` - Now uses dynamic server URL
- ✅ `createStory()` - Now uses dynamic server URL

### Backend (`server.js`)
- ✅ Removed restrictive file route
- ✅ `express.static` now handles subdirectories
- ✅ Proper CORS and cache headers

## Deployment Steps

1. **Commit the changes:**
   ```bash
   git add .
   git commit -m "Fix image display: dynamic server URL and subdirectory file serving"
   git push origin main
   ```

2. **Render will auto-deploy:**
   - Backend will restart with the fixes
   - Images will now be served correctly

3. **Test:**
   - Upload a post with an image
   - Image should display immediately
   - Check browser Network tab to verify image URL is correct

## How It Works Now

1. **Image Upload:**
   - Image saved to `uploads/posts/post-{userId}-{timestamp}.{ext}`
   - Database stores: `/uploads/posts/post-{userId}-{timestamp}.{ext}`

2. **Image URL Construction:**
   - Backend detects server URL from request: `https://your-backend.onrender.com`
   - Constructs full URL: `https://your-backend.onrender.com/uploads/posts/post-{userId}-{timestamp}.{ext}`

3. **Image Serving:**
   - Request: `GET /uploads/posts/post-{userId}-{timestamp}.{ext}`
   - `express.static` serves the file from `uploads/posts/` directory
   - Proper headers set for CORS and caching

## Optional: Set SERVER_URL in Render

You can optionally set `SERVER_URL` in Render environment variables for explicit control:
- Go to Render Dashboard → Your Service → Environment
- Add: `SERVER_URL=https://your-backend.onrender.com`

But it's not required - the code now auto-detects it from the request!

## Testing

After deployment:
1. Create a post with an image
2. Check the image URL in browser DevTools → Network tab
3. Should be: `https://your-backend.onrender.com/uploads/posts/...`
4. Image should display correctly

## If Images Still Don't Show

1. **Check the image URL:**
   - Open browser DevTools → Network tab
   - Find the image request
   - Check if URL is correct
   - Check response status (should be 200)

2. **Check Render logs:**
   - Look for file serving errors
   - Verify `uploads/posts/` directory exists

3. **Check CORS:**
   - If image loads but doesn't display, might be CORS issue
   - Check browser console for CORS errors

4. **Verify file exists:**
   - Check if file was actually saved
   - Render has ephemeral storage - files might be lost on restart
   - Consider using cloud storage (S3, Cloudinary) for production

