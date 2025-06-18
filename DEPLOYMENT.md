# QNA Threads - Deployment Guide

This guide will help you deploy both the frontend and backend of your QNA Threads application.

## Prerequisites

- Node.js (v16 or higher)
- Git
- A PostgreSQL database (for production)
- Accounts on hosting platforms (Vercel, Railway, Render, etc.)

## Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

### Backend Deployment on Railway

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with your GitHub account

2. **Deploy Backend**
   ```bash
   # Navigate to your project directory
   cd "QNA Threads"
   
   # Initialize git if not already done
   git init
   git add .
   git commit -m "Initial commit for deployment"
   
   # Push to GitHub
   git remote add origin https://github.com/yourusername/qna-threads.git
   git push -u origin main
   ```

3. **Connect to Railway**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect it's a Node.js app

4. **Configure Environment Variables**
   In Railway dashboard, add these environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=your_production_postgresql_url
   JWT_SECRET=your_very_secure_jwt_secret_key
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```

5. **Set up PostgreSQL Database**
   - In Railway dashboard, add a PostgreSQL service
   - Copy the DATABASE_URL and add it to your environment variables
   - Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Frontend Deployment on Vercel

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Deploy Frontend**
   ```bash
   # Navigate to client directory
   cd client
   
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Configure Environment Variables**
   In Vercel dashboard, add:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app/api
   VITE_SOCKET_URL=https://your-railway-backend-url.railway.app
   ```

## Option 2: Render (Full Stack)

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Deploy Backend**
   - Create a new Web Service
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Add environment variables as shown above

3. **Deploy Frontend**
   - Create a new Static Site
   - Connect your GitHub repository
   - Set build command: `cd client && npm install && npm run build`
   - Set publish directory: `client/dist`
   - Add environment variables for API URLs

## Option 3: Heroku (Full Stack)

1. **Sign up for Heroku**
   - Go to [heroku.com](https://heroku.com)
   - Sign up for an account

2. **Deploy Backend**
   ```bash
   # Install Heroku CLI
   # Then run:
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secure_secret
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   git push heroku main
   ```

3. **Deploy Frontend**
   - Use Heroku's static buildpack
   - Or deploy frontend separately on Vercel/Netlify

## Database Setup

### Local Development
```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run server
```

### Production
```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@host:port/database"
PORT=5000
CLIENT_URL="https://your-frontend-domain.com"
JWT_SECRET="your_very_secure_jwt_secret_key"
NODE_ENV=production
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_SOCKET_URL=https://your-backend-domain.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CLIENT_URL is set correctly in backend
   - Check that frontend is making requests to the correct backend URL

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Ensure database is accessible from your hosting platform
   - Run migrations: `npx prisma migrate deploy`

3. **Socket.io Connection Issues**
   - Check VITE_SOCKET_URL is set correctly
   - Ensure backend supports WebSocket connections
   - Verify CORS settings allow WebSocket connections

4. **Build Errors**
   - Check all dependencies are installed
   - Verify Node.js version compatibility
   - Check for any missing environment variables

### Health Check

Test your deployment by:
1. Checking if the API responds: `GET /api/users`
2. Testing WebSocket connection
3. Verifying frontend can connect to backend
4. Testing authentication flow

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to git
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **Database**
   - Use connection pooling in production
   - Enable SSL for database connections
   - Regular backups

3. **API Security**
   - Implement rate limiting
   - Add input validation
   - Use HTTPS in production

## Monitoring

1. **Logs**
   - Monitor application logs
   - Set up error tracking (Sentry, etc.)
   - Monitor database performance

2. **Health Checks**
   - Set up automated health checks
   - Monitor API response times
   - Track user activity

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review hosting platform documentation
3. Check application logs
4. Verify environment variables are set correctly 