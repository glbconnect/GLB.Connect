# Fix for Render Deployment Database Timeout

## Problem
Prisma migration is timing out when trying to connect to Neon database:
```
Error: P1002
The database server was reached but timed out.
Timed out trying to acquire a postgres advisory lock
```

## Solution

### Option 1: Use Direct Connection for Migrations (Recommended)

Neon provides two connection strings:
1. **Pooler connection** (ends with `-pooler`) - Fast but can timeout during migrations
2. **Direct connection** - Slower but more reliable for migrations

**Steps:**

1. **Get Direct Connection URL from Neon:**
   - Go to your Neon dashboard
   - Click on your database
   - Go to "Connection Details"
   - Copy the **Direct connection** string (NOT the pooler one)
   - It should look like: `postgresql://user:pass@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - Notice: NO `-pooler` in the hostname

2. **Add to Render Environment Variables:**
   - Go to Render dashboard → Your backend service
   - Go to "Environment" tab
   - Add/Update `DATABASE_URL` with the **direct connection** string
   - Keep the pooler URL for runtime (optional, see below)

3. **For Better Performance (Optional):**
   - Use **direct connection** for migrations (in build command)
   - Use **pooler connection** for runtime (in DATABASE_URL)
   - This requires updating your code to use different URLs

### Option 2: Update Build Command with Retry Logic

Update `render.yaml` build command to handle timeouts:

```yaml
buildCommand: "npm install && npx prisma@6.5.0 generate && (npx prisma@6.5.0 migrate deploy || echo 'Migration failed, continuing...')"
```

**Note:** This is a workaround. Option 1 is better.

### Option 3: Split Migrations from Build

1. **Remove migration from build command:**
   ```yaml
   buildCommand: "npm install && npx prisma@6.5.0 generate"
   ```

2. **Run migrations manually:**
   - SSH into your Render instance (if available)
   - Or create a one-time migration script
   - Or run migrations locally pointing to production DB

3. **Or use Render's post-deploy script:**
   - Add a script in `package.json`:
     ```json
     "postdeploy": "npx prisma@6.5.0 migrate deploy"
     ```

## Recommended Fix (Step by Step)

### Step 1: Get Direct Connection URL
1. Log into Neon dashboard
2. Select your database
3. Go to "Connection Details"
4. Copy the **Direct connection** string (without `-pooler`)

### Step 2: Update Render Environment
1. Go to Render dashboard
2. Select `glb-connect-backend` service
3. Go to "Environment" tab
4. Find `DATABASE_URL`
5. Replace with direct connection string
6. Save changes

### Step 3: Update render.yaml (Optional)
You can also update the build command to be more resilient:

```yaml
buildCommand: "npm install && npx prisma@6.5.0 generate && npx prisma@6.5.0 migrate deploy"
```

### Step 4: Redeploy
1. Go to Render dashboard
2. Click "Manual Deploy" → "Clear build cache & deploy"
3. Or push a new commit to trigger redeploy

## Why This Happens

- **Connection Poolers** (like Neon's pooler) are optimized for many short connections
- **Migrations** need long-running connections with advisory locks
- **Advisory locks** prevent concurrent migrations but can timeout with poolers
- **Direct connections** bypass the pooler and work better for migrations

## After Fix

Once migrations succeed, you can:
- Keep using direct connection (simpler)
- Or switch back to pooler for better performance (migrations already done)

## Verify

After deployment, check:
1. ✅ Build completes without timeout errors
2. ✅ Application starts successfully
3. ✅ Database tables exist (check logs or connect to DB)

