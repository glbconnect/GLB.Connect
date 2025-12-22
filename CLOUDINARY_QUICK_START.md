# Cloudinary Quick Start Guide

## ✅ What's Been Done

1. ✅ **Cloudinary package added** to `package.json`
2. ✅ **Cloudinary utility created** (`src/utils/cloudinary.js`)
3. ✅ **Post upload updated** to use Cloudinary
4. ✅ **Story upload updated** to use Cloudinary
5. ✅ **Image deletion updated** to handle Cloudinary URLs
6. ✅ **Automatic fallback** to local storage if Cloudinary not configured

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Package

```bash
npm install cloudinary
```

### Step 2: Get Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free)
2. In your dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 3: Add to .env

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
USE_CLOUDINARY=true
```

### Step 4: Add to Production (Render)

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add the three Cloudinary variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `USE_CLOUDINARY=true`

### Step 5: Restart Server

```bash
npm run server
```

## ✨ How It Works

- **If `USE_CLOUDINARY=true`**: Images upload to Cloudinary
- **If `USE_CLOUDINARY=false` or not set**: Uses local storage (current behavior)
- **Automatic fallback**: If Cloudinary fails, falls back to local storage

## 🧪 Test It

1. Upload a post with an image
2. Check Cloudinary dashboard → Media Library
3. Your image should be there!

## 📝 Notes

- Old images (local storage) will continue to work
- New images will go to Cloudinary
- Images are automatically optimized by Cloudinary
- CDN included for fast delivery worldwide

## ❓ Troubleshooting

**Images not uploading?**
- Check `.env` file has all 3 Cloudinary variables
- Make sure `USE_CLOUDINARY=true`
- Check server logs for errors

**Still using local storage?**
- Verify `USE_CLOUDINARY=true` in `.env`
- Restart your server after adding variables

For detailed setup, see `CLOUDINARY_SETUP.md`

