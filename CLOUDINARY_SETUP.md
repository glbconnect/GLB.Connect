# Cloudinary Setup Guide for Image Storage

## Why Cloudinary?

✅ **Persistent Storage** - Images never get deleted  
✅ **CDN Included** - Fast image delivery worldwide  
✅ **Image Optimization** - Automatic compression and resizing  
✅ **Free Tier** - 25GB storage, 25GB bandwidth/month  
✅ **Easy Integration** - Simple API, great documentation  

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up" (free account)
3. Verify your email
4. You'll be taken to your dashboard

## Step 2: Get Your Credentials

In your Cloudinary dashboard, you'll see:

- **Cloud Name** (e.g., `dxyz1234`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

**Important:** Keep your API Secret secure! Never commit it to Git.

## Step 3: Install Cloudinary Package

```bash
npm install cloudinary
```

## Step 4: Add Environment Variables

### Local Development (.env)

Add these to your `.env` file in the project root:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Set to 'true' to use Cloudinary, 'false' for local storage
USE_CLOUDINARY=true
```

### Production (Render/Vercel)

Add the same environment variables in your hosting platform:

**Render:**
1. Go to your service dashboard
2. Click "Environment"
3. Add the three Cloudinary variables

**Vercel:**
1. Go to your project settings
2. Click "Environment Variables"
3. Add the three Cloudinary variables

## Step 5: Code Changes

The code has been updated to support Cloudinary. The implementation:
- ✅ Automatically uses Cloudinary if `USE_CLOUDINARY=true`
- ✅ Falls back to local storage if Cloudinary is not configured
- ✅ Works seamlessly with existing code

## Step 6: Test

1. Start your server: `npm run server`
2. Upload a post with an image
3. Check Cloudinary dashboard → Media Library
4. Your image should appear there!

## Step 7: Migration (Optional)

If you have existing images stored locally, you can:

1. **Keep old images**: They'll continue to work (backward compatible)
2. **Migrate to Cloudinary**: Upload old images to Cloudinary manually or via script

## Troubleshooting

### "Invalid cloud_name"
- Check your `CLOUDINARY_CLOUD_NAME` in `.env`
- Make sure there are no extra spaces

### "Invalid API key"
- Verify your `CLOUDINARY_API_KEY` in `.env`
- Check Cloudinary dashboard for correct key

### "Images not uploading"
- Check `USE_CLOUDINARY=true` in `.env`
- Verify all three Cloudinary variables are set
- Check server logs for error messages

### "Images work locally but not in production"
- Make sure environment variables are set in your hosting platform
- Restart your server after adding environment variables

## Cloudinary Dashboard Features

Once set up, you can:
- 📸 View all uploaded images
- 🔄 Transform images (resize, crop, filters)
- 📊 See usage statistics
- 🗑️ Delete images if needed
- 🔒 Set up security rules

## Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: Unlimited
- **Perfect for**: Small to medium applications

## Upgrade When Needed

If you exceed free tier:
- **Plus Plan**: $99/month - 100GB storage, 100GB bandwidth
- **Advanced Plan**: $224/month - 250GB storage, 250GB bandwidth

## Security Best Practices

1. ✅ Never commit `.env` file to Git
2. ✅ Use environment variables in production
3. ✅ Set up upload presets in Cloudinary dashboard
4. ✅ Enable signed uploads for security
5. ✅ Set up CORS rules if needed

## Next Steps

After setup:
1. ✅ Test image uploads
2. ✅ Verify images appear in Cloudinary
3. ✅ Check image URLs in database
4. ✅ Test on different devices
5. ✅ Monitor Cloudinary dashboard for usage

