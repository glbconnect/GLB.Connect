import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Format file size for display
const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + ' B';
  } else if (sizeInBytes < 1024 * 1024) {
    return (sizeInBytes / 1024).toFixed(2) + ' KB';
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
};

// Extract file type from filename
const getFileType = (filename) => {
  const extension = path.extname(filename).toLowerCase().substring(1);
  return extension;
};

// Get all resources
export const getResources = async (req, res) => {
  try {
    const { 
      categoryId, 
      categorySlug,
      year, 
      search, 
      limit = 20, 
      page = 1 
    } = req.query;
    
    const skip = (page - 1) * parseInt(limit);
    
    // Build filter conditions
    const where = {};
    
    // Handle category filtering by ID or slug
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    } else if (categorySlug) {
      // Find the category ID by slug
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      });
      
      if (category) {
        where.categoryId = category.id;
      } else {
        // If category not found, return empty result
        return res.json({
          success: true,
          count: 0,
          totalCount: 0,
          totalPages: 0,
          currentPage: parseInt(page),
          data: []
        });
      }
    }
    
    if (year) {
      where.year = parseInt(year);
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Get total count
    const totalCount = await prisma.resource.count({ where });
    
    // Get resources with pagination
    const resources = await prisma.resource.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        category: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });
    
    res.json({
      success: true,
      count: resources.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      data: resources
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: error.message
    });
  }
};

// Get resource by ID
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        category: true
      }
    });
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    // Increment download count
    await prisma.resource.update({
      where: { id: parseInt(id) },
      data: { downloadCount: { increment: 1 } }
    });
    
    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resource',
      error: error.message
    });
  }
};

// Create resource
export const createResource = async (req, res) => {
  try {
    const { title, description, year, categoryId } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!title || !year || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, year, and category'
      });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }
    
    // For now, we'll use a simple file URL (in production, you'd upload to Cloudinary or similar)
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Get file type and size
    const fileType = getFileType(req.file.originalname);
    const fileSize = formatFileSize(req.file.size);
    
    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        thumbnailUrl: fileUrl, // For now, use same URL as thumbnail
        publicId: req.file.filename,
        year: parseInt(year),
        size: fileSize,
        userId,
        categoryId: parseInt(categoryId)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        category: true
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resource',
      error: error.message
    });
  }
};

// Update resource
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, year, categoryId } = req.body;
    const userId = req.user.id;
    
    // Check if resource exists and belongs to user
    const existingResource = await prisma.resource.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    if (existingResource.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own resources'
      });
    }
    
    // Update resource
    const updatedResource = await prisma.resource.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        year: parseInt(year),
        categoryId: parseInt(categoryId)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        category: true
      }
    });
    
    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resource',
      error: error.message
    });
  }
};

// Delete resource
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if resource exists and belongs to user
    const existingResource = await prisma.resource.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existingResource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
    
    if (existingResource.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own resources'
      });
    }
    
    // Delete the file from uploads folder
    const filePath = path.join(__dirname, '../../uploads', existingResource.publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete resource from database
    await prisma.resource.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource',
      error: error.message
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        resources: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
}; 