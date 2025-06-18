import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getResources, 
  getResourceById, 
  createResource, 
  updateResource, 
  deleteResource,
  getCategories,
  getCategoryBySlug
} from '../controllers/resourceController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow common document and media file types
    const allowedTypes = [
      'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
      'txt', 'rtf', 'zip', 'rar', 'jpg', 'jpeg', 'png', 'gif',
      'mp4', 'avi', 'mov', 'mp3', 'wav'
    ];
    
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

// Public routes
router.get('/', getResources);
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/:id', getResourceById);

// Protected routes
router.post('/', verifyToken, upload.single('file'), createResource);
router.put('/:id', verifyToken, updateResource);
router.delete('/:id', verifyToken, deleteResource);

export default router; 