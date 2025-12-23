# Cloudinary Troubleshooting Guide

## Problem: Images Not Showing After Refresh

If images disappear after refreshing the page, it's likely because:

1. **Cloudinary is not configured** - Images are stored locally and get deleted on server restart
2. **Cloudinary credentials are missing** - Check your environment variables
3. **USE_CLOUDINARY is not set to 'true'** - The system defaults to local storage

## Quick Fix

### Step 1: Check Server Logs

When you upload an image, check your server logs. You should see:
- `Cloudinary configured: true` - If Cloudinary is working
- `Cloudinary configured: false` - If Cloudinary is NOT configured
- `⚠️ Cloudinary not configured - using local storage` - Warning message

### Step 2: Add Cloudinary Credentials

**For Local Development (.env file):**
```env
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**For Production (Render):**
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add these variables:
   - `USE_CLOUDINARY` = `true`
   - `CLOUDINARY_CLOUD_NAME` = `your_cloud_name`
   - `CLOUDINARY_API_KEY` = `your_api_key`
   - `CLOUDINARY_API_SECRET` = `your_api_secret`

### Step 3: Restart Server

After adding environment variables:
- **Local**: Restart your server (`npm run server`)
- **Render**: The service will auto-restart

### Step 4: Test

1. Upload a new post with an image
2. Check server logs - should see "Cloudinary upload successful"
3. Check the image URL in database - should be a Cloudinary URL (starts with `https://res.cloudinary.com`)
4. Refresh the page - image should still be there!

## Verify Cloudinary is Working

### Check Image URLs

After uploading, check the image URL:
- **Cloudinary URL**: `https://res.cloudinary.com/your-cloud-name/image/upload/...`
- **Local URL**: `https://your-backend.onrender.com/uploads/posts/...`

If you see local URLs, Cloudinary is NOT being used.

### Check Server Logs

Look for these messages:
- ✅ `Cloudinary configured: true`
- ✅ `Uploading to Cloudinary...`
- ✅ `Cloudinary upload successful: https://res.cloudinary.com/...`

If you see:
- ❌ `Cloudinary configured: false`
- ❌ `⚠️ Cloudinary not configured - using local storage`

Then Cloudinary is NOT configured correctly.

## Common Issues

### Issue 1: "Cloudinary configured: false"

**Solution:**
- Check that all 3 Cloudinary variables are set
- Make sure `USE_CLOUDINARY=true` (not `"true"` or `True`)
- Restart server after adding variables

### Issue 2: "Cloudinary upload failed"

**Possible causes:**
- Invalid API credentials
- Network issues
- Cloudinary account issues

**Solution:**
- Verify credentials in Cloudinary dashboard
- Check server logs for specific error
- Test credentials manually

### Issue 3: Old images still using local storage

**Solution:**
- Old images uploaded before Cloudinary setup will still use local URLs
- New images will use Cloudinary
- You can re-upload old posts to migrate them to Cloudinary

## Why Cloudinary is Required for Production

On cloud platforms like Render:
- **Local files are deleted** on every server restart
- **Local files are deleted** on every deployment
- **No file persistence** - files don't survive restarts

**Cloudinary solves this:**
- ✅ Images stored permanently in the cloud
- ✅ Images survive server restarts
- ✅ Images survive deployments
- ✅ CDN included for fast delivery
- ✅ Automatic optimization

## Next Steps

1. ✅ Set up Cloudinary account (free tier available)
2. ✅ Add credentials to environment variables
3. ✅ Set `USE_CLOUDINARY=true`
4. ✅ Restart server
5. ✅ Upload a test image
6. ✅ Verify image URL is Cloudinary URL
7. ✅ Refresh page - image should persist!

