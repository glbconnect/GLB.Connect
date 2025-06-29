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

# GLB.CONNECT Deployment Guide

## 🚀 Production Deployment

### **Important: File Storage Considerations**

⚠️ **CRITICAL**: The current implementation uses local file storage (`uploads/` folder). This will **NOT work** in production cloud environments because:

1. **Ephemeral Storage**: Cloud platforms delete local files when servers restart
2. **No File Persistence**: Files uploaded to one server instance won't be available on others
3. **Storage Limitations**: Local storage is limited and not scalable

### **Recommended Solutions for Production:**

#### **Option 1: Cloud Storage (Recommended)**
- **AWS S3**: Most popular and reliable
- **Google Cloud Storage**: Good integration with Google services
- **Cloudinary**: Specialized for media files
- **Firebase Storage**: Easy integration with Firebase

#### **Option 2: Database Storage (Small files only)**
- Store files as BLOB in PostgreSQL (not recommended for large files)

#### **Option 3: External File Hosting**
- Use services like Dropbox, Google Drive API, or OneDrive

### **Current Production Setup**

The application is configured for deployment on:

#### **Render.com**
- Backend: `glb-connect-backend`
- Frontend: `glb-connect-frontend`
- Environment variables are configured in `render.yaml`

#### **Railway.app**
- Full-stack deployment
- Configuration in `railway.json`

### **Environment Variables Required**

#### **Backend (.env)**
```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"

# Client URL
CLIENT_URL="https://your-frontend-domain.com"

# Environment
NODE_ENV="production"

# File Storage (if using cloud storage)
CLOUD_STORAGE_BUCKET="your-bucket-name"
CLOUD_STORAGE_KEY="your-access-key"
CLOUD_STORAGE_SECRET="your-secret-key"
```

#### **Frontend (.env)**
```env
VITE_API_URL="https://your-backend-domain.com/api"
VITE_SOCKET_URL="https://your-backend-domain.com"
```

### **File Viewing in Production**

The file viewing functionality has been enhanced with:

1. **Robust URL Construction**: Handles different environment configurations
2. **Fallback Mechanisms**: Tries alternative URLs if primary fails
3. **Error Handling**: Comprehensive error messages and debugging
4. **CORS Support**: Proper headers for cross-origin file access
5. **File Type Detection**: Different handling for PDFs vs other files

### **Testing File Access**

After deployment, test file access with:

1. **Upload a test file** through the resource sharing interface
2. **Check browser console** for URL construction logs
3. **Test file viewing** with different file types (PDF, images, documents)
4. **Verify CORS headers** are properly set

### **Troubleshooting File Issues**

#### **Common Issues:**

1. **Files not accessible after deployment**
   - Check if files are being stored in cloud storage
   - Verify CORS headers are set correctly
   - Check browser console for URL construction errors

2. **CORS errors**
   - Ensure backend CORS configuration includes frontend domain
   - Check that file serving routes have proper CORS headers

3. **File URLs not working**
   - Verify environment variables are set correctly
   - Check that SERVER_URL is constructed properly
   - Test file access endpoints directly

#### **Debug Steps:**

1. **Check file existence**: Use `/api/files/test/:filename` endpoint
2. **Verify URL construction**: Check browser console logs
3. **Test direct access**: Try accessing file URL directly in browser
4. **Check network tab**: Look for failed requests in browser dev tools

### **Migration to Cloud Storage**

To migrate from local storage to cloud storage:

1. **Choose a cloud storage provider** (AWS S3 recommended)
2. **Update file upload logic** in `src/controllers/resourceController.js`
3. **Update file URL construction** in `client/src/utils/fileUtils.js`
4. **Test thoroughly** before deploying to production

### **Performance Optimization**

1. **File Caching**: Implement proper cache headers for static files
2. **CDN**: Use a CDN for faster file delivery
3. **Image Optimization**: Compress images before storage
4. **Lazy Loading**: Implement lazy loading for file previews

### **Security Considerations**

1. **File Validation**: Validate file types and sizes
2. **Access Control**: Implement proper file access permissions
3. **Virus Scanning**: Consider scanning uploaded files
4. **Rate Limiting**: Limit file upload frequency

### **Monitoring**

1. **File Access Logs**: Monitor file access patterns
2. **Error Tracking**: Track file access errors
3. **Storage Usage**: Monitor storage consumption
4. **Performance Metrics**: Track file loading times

---

## **Quick Start for Production**

1. **Set up cloud storage** (AWS S3 recommended)
2. **Configure environment variables**
3. **Deploy backend** to your chosen platform
4. **Deploy frontend** with correct API URLs
5. **Test file upload and viewing**
6. **Monitor and optimize**

For immediate deployment without cloud storage, files will work temporarily but will be lost on server restarts. 