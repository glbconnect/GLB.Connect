# How to Run the Buzz Migration

## Step 1: Create .env File

If you don't have a `.env` file, create one in the project root (`D:\Projects\GLB.Connect`) with your database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-jwt-secret-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

**Important:** Replace:
- `username` with your PostgreSQL username (usually `postgres`)
- `password` with your PostgreSQL password
- `localhost:5432` with your database host and port
- `database_name` with your database name

## Step 2: Run the Migration

Use this command to run the migration with the correct Prisma version:

```powershell
npx --package=prisma@6.5.0 prisma migrate dev --name add_buzz_models
```

Or if you have Prisma installed locally:

```powershell
.\node_modules\.bin\prisma.cmd migrate dev --name add_buzz_models
```

## Step 3: Verify

After the migration completes, you should see:
- ✅ Migration files created in `prisma/migrations/`
- ✅ Database tables created (Post, PostLike, Comment, Share, Story, Follow)
- ✅ User table updated with `branch` and `year` fields

## Step 4: Restart Server

Restart your backend server:
```powershell
npm run server
```

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Make sure `.env` file exists in the project root
- Check that `DATABASE_URL` is set correctly
- Restart your terminal after creating `.env`

### "Prisma 7.x error"
- Use: `npx --package=prisma@6.5.0 prisma migrate dev --name add_buzz_models`
- This ensures you use Prisma 6.5.0 (compatible with your project)

### "Connection refused" or database errors
- Make sure PostgreSQL is running
- Verify your DATABASE_URL is correct
- Check that the database exists

## After Migration

Once the migration is complete:
1. ✅ Buzz page will load without errors
2. ✅ You can create posts
3. ✅ All Buzz features will work

