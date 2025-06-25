import { 
  createUser, 
  getUserById, 
  getUserByIdWithPassword,
  getAllUsers, 
  findUserByEmail, 
  validatePassword, 
  generateToken,
  searchUsersByEmail,
  updateUser,
  updateUserPassword
} from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Set up multer storage for avatars
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${userId}${ext}`);
  }
});
export const uploadAvatarMiddleware = multer({ storage: avatarStorage }).single('avatar');

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, batchYear, skills } = req.body;

    // Validation
    if (!name || !email || !password || !batchYear) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if email already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create user
    const user = await createUser({ name, email, password, batchYear: Number(batchYear), skills });

    // Generate token
    const token = generateToken(user.id);

    // Return user without password and token
    const { password: removedPassword, ...userWithoutPassword } = user;
    res.status(201).json({ 
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password and token
    const { password: removedPassword, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Get search parameter from query
    const { search } = req.query;
    
    let users;
    if (search) {
      // Search users by email
      users = await searchUsersByEmail(search);
    } else {
      // Get all users
      users = await getAllUsers();
    }
    
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Failed to get current user' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    
    // Get current user
    const currentUser = await getUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if new email is already taken by another user
    if (email && email !== currentUser.email) {
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }
    
    // Update user in database (you'll need to add this function to userModel.js)
    const updatedUser = await updateUser(userId, { name, email });
    
    // Return user without password
    const { password: removedPassword, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Please provide current and new password' 
      });
    }
    
    // Get user with password
    const user = await getUserByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await validatePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password in database
    await updateUserPassword(userId, hashedNewPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const userId = req.user.id;
  const avatarUrl = `/uploads/${req.file.filename}`;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
    res.json({ success: true, avatarUrl });
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
}; 