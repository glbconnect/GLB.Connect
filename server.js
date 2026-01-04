import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import messageRouter from './src/routes/messageRoutes.js';
import userRouter from './src/routes/userRoutes.js';
import batchRouter from './src/routes/batchroute.js';
import jobRouter from './src/routes/jobRoutes.js';
import resourceRouter from './src/routes/resourceRoutes.js';
import { initializeSocket } from './src/sockets/chatSocket.js';
import anonymousMessageRouter from './src/routes/anonymousMessageRoutes.js';
import eventRouter from './src/routes/eventRoutes.js';
import buzzRouter from './src/routes/buzzRoutes.js';
import sessionRouter from './src/routes/sessionRoutes.js';
import multer from 'multer';
import fs from 'fs';
import { uploadToCloudinary, isCloudinaryConfigured } from './src/utils/cloudinary.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Attach app to httpServer for socket.io
httpServer.app = app;

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://glb-connect-frontend.onrender.com",
    "https://glb-connect.vercel.app",
    "https://glb.connect"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// API Routes - MUST come before static file serving
app.use('/api/messages', messageRouter);
app.use('/api/users', userRouter);
app.use('/api/batch', batchRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/resources', resourceRouter);
app.use('/api/anonymous-messages', anonymousMessageRouter);
app.use('/api/events', eventRouter);
app.use('/api/buzz', buzzRouter);
app.use('/api/sessions', sessionRouter);

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Category seeding endpoint for production
app.post('/api/seed-categories', async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: "Academics Notes",
        slug: "academics-notes",
        description: "Lecture notes, study materials, and academic resources"
      },
      {
        name: "Gate Notes",
        slug: "gate-notes",
        description: "GATE exam preparation materials and study guides"
      },
      {
        name: "Quantum",
        slug: "quantum",
        description: "Quantum computing and quantum mechanics resources"
      },
      {
        name: "Placement Resources",
        slug: "placement-resources",
        description: "Interview preparation, resume templates, and career resources"
      },
      {
        name: "Others",
        slug: "others",
        description: "Miscellaneous resources and materials"
      }
    ];

    console.log("🌱 Seeding categories...");
    let createdCount = 0;
    
    for (const category of defaultCategories) {
      const existingCategory = await prisma.category.findUnique({
        where: {
          slug: category.slug
        }
      });
      
      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
        createdCount++;
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`);
      }
    }
    
    console.log("🎉 Categories seeding completed!");
    
    res.json({
      success: true,
      message: `Categories seeded successfully. ${createdCount} new categories created.`,
      createdCount
    });
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed categories",
      error: error.message
    });
  }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'event-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Handle file uploads
app.post('/api/uploads', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    if (isCloudinaryConfigured()) {
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
      const buffer = fs.readFileSync(filePath);
      const publicId = req.file.filename.replace(path.extname(req.file.filename), '');
      const result = await uploadToCloudinary(buffer, 'events', publicId);
      // cleanup local file
      try { fs.unlinkSync(filePath); } catch {}
      return res.json({ url: result.url });
    } else {
      const fileUrl = `/uploads/${req.file.filename}`;
      return res.json({ url: fileUrl });
    }
  } catch (error) {
    console.error('Error handling upload:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Add CORS headers for file serving (before static middleware)
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve static files (for uploaded resources) - handles subdirectories automatically
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Set proper headers for image files
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      res.setHeader('Content-Type', 'image/jpeg'); // Default, will be overridden by express.static
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    }
  }
}));

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// File access test endpoint
app.get('/api/files/test/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    res.json({
      exists: true,
      size: stats.size,
      path: filePath,
      url: `/uploads/${filename}`
    });
  } else {
    res.status(404).json({
      exists: false,
      error: 'File not found',
      path: filePath
    });
  }
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  
  // Catch-all route for React app - MUST be last
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

// Test database connection and start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Auto-seed categories if they don't exist
    await seedCategoriesIfNeeded();
    
    // Start the server
httpServer.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📊 Database: PostgreSQL (Railway)`);
      console.log(`🔗 API URL: http://localhost:${port}/api`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Function to seed categories if they don't exist
async function seedCategoriesIfNeeded() {
  try {
    // Check if any categories exist
    const existingCategories = await prisma.category.count();
    
    if (existingCategories === 0) {
      console.log('🌱 No categories found. Auto-seeding categories...');
      
      const defaultCategories = [
        {
          name: "Academics Notes",
          slug: "academics-notes",
          description: "Lecture notes, study materials, and academic resources"
        },
        {
          name: "Gate Notes",
          slug: "gate-notes",
          description: "GATE exam preparation materials and study guides"
        },
        {
          name: "Quantum",
          slug: "quantum",
          description: "Quantum computing and quantum mechanics resources"
        },
        {
          name: "Placement Resources",
          slug: "placement-resources",
          description: "Interview preparation, resume templates, and career resources"
        },
        {
          name: "Others",
          slug: "others",
          description: "Miscellaneous resources and materials"
        }
      ];

      for (const category of defaultCategories) {
        await prisma.category.create({
          data: category
        });
        console.log(`✅ Created category: ${category.name}`);
      }
      
      console.log('🎉 Auto-seeding completed!');
    } else {
      console.log(`✅ Categories already exist (${existingCategories} found)`);
    }
  } catch (error) {
    console.error('❌ Error during auto-seeding:', error);
    // Don't exit the server if seeding fails
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();






