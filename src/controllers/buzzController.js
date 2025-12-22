import { PrismaClient } from "@prisma/client";
import path from "path";
import multer from "multer";
import fs from "fs";

const prisma = new PrismaClient();

// Configure multer for post images
const postImageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads", "posts");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `post-${userId}-${timestamp}${ext}`);
  }
});

export const uploadPostImageMiddleware = multer({
  storage: postImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single("image");

// Get all posts (feed)
export const getPosts = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            branch: true,
            year: true,
            batchYear: true
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        shares: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get server URL from request or environment
    const getServerUrl = () => {
      if (process.env.SERVER_URL) return process.env.SERVER_URL;
      if (req.protocol && req.get('host')) {
        return `${req.protocol}://${req.get('host')}`;
      }
      return 'http://localhost:5000';
    };
    const serverUrl = getServerUrl();

    const postsWithStats = posts.map(post => ({
      id: post.id,
      content: post.content,
      image: post.imageUrl ? `${serverUrl}${post.imageUrl}` : null,
      user: {
        id: post.user.id,
        name: post.user.name,
        avatarUrl: post.user.avatarUrl,
        branch: post.user.branch || 'Computer Science',
        year: post.user.year || calculateYear(post.user.batchYear)
      },
      likes: post.likes.length,
      comments: post.comments.length,
      shares: post.shares.length,
      isLiked: userId ? post.likes.some(like => like.userId === userId) : false,
      timestamp: post.createdAt
    }));

    res.json(postsWithStats);
  } catch (error) {
    console.error("Error getting posts:", error);
    // Check if it's a table doesn't exist error
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      return res.status(500).json({ 
        error: "Database tables not found. Please run: npx prisma migrate dev --name add_buzz_models" 
      });
    }
    res.status(500).json({ error: error.message || "Failed to get posts" });
  }
};

// Create a post
export const createPost = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/posts/${req.file.filename}` : null;

    if (!content && !imageUrl) {
      return res.status(400).json({ error: "Post content or image is required" });
    }

    const post = await prisma.post.create({
      data: {
        content: content || "",
        imageUrl: imageUrl,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            branch: true,
            year: true,
            batchYear: true
          }
        },
        likes: true,
        comments: true,
        shares: true
      }
    });

    // Get server URL from request or environment
    const getServerUrl = () => {
      if (process.env.SERVER_URL) return process.env.SERVER_URL;
      if (req.protocol && req.get('host')) {
        return `${req.protocol}://${req.get('host')}`;
      }
      return 'http://localhost:5000';
    };
    const serverUrl = getServerUrl();

    const postWithStats = {
      id: post.id,
      content: post.content,
      image: post.imageUrl ? `${serverUrl}${post.imageUrl}` : null,
      user: {
        id: post.user.id,
        name: post.user.name,
        avatarUrl: post.user.avatarUrl,
        branch: post.user.branch || 'Computer Science',
        year: post.user.year || calculateYear(post.user.batchYear)
      },
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      timestamp: post.createdAt
    };

    res.status(201).json(postWithStats);
  } catch (error) {
    console.error("Error creating post:", error);
    // Check if it's a table doesn't exist error
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      return res.status(500).json({ 
        error: "Database tables not found. Please run: npx prisma migrate dev --name add_buzz_models" 
      });
    }
    res.status(500).json({ error: error.message || "Failed to create post" });
  }
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: userId
        }
      }
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: {
          id: existingLike.id
        }
      });
      res.json({ liked: false });
    } else {
      await prisma.postLike.create({
        data: {
          postId: postId,
          userId: userId
        }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content,
        postId: postId,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Failed to get comments" });
  }
};

// Share a post (now used for repost)
export const sharePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Get the original post
    const originalPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            branch: true,
            year: true,
            batchYear: true
          }
        }
      }
    });

    if (!originalPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a repost (new post with reference to original)
    const repost = await prisma.post.create({
      data: {
        content: `Reposted from ${originalPost.user.name}\n\n${originalPost.content}`,
        imageUrl: originalPost.imageUrl,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            branch: true,
            year: true,
            batchYear: true
          }
        },
        likes: true,
        comments: true,
        shares: true
      }
    });

    // Also create a share record
    await prisma.share.create({
      data: {
        postId: postId,
        userId: userId
      }
    });

    // Get server URL
    const getServerUrl = () => {
      if (process.env.SERVER_URL) return process.env.SERVER_URL;
      if (req.protocol && req.get('host')) {
        return `${req.protocol}://${req.get('host')}`;
      }
      return 'http://localhost:5000';
    };
    const serverUrl = getServerUrl();

    const repostWithStats = {
      id: repost.id,
      content: repost.content,
      image: repost.imageUrl ? `${serverUrl}${repost.imageUrl}` : null,
      user: {
        id: repost.user.id,
        name: repost.user.name,
        avatarUrl: repost.user.avatarUrl,
        branch: repost.user.branch || 'Computer Science',
        year: repost.user.year || calculateYear(repost.user.batchYear)
      },
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      timestamp: repost.createdAt
    };

    res.status(201).json(repostWithStats);
  } catch (error) {
    console.error("Error reposting:", error);
    res.status(500).json({ error: "Failed to repost" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    // Check if post exists and belongs to user
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own posts" });
    }

    // Delete the post (cascade will delete likes, comments, shares)
    await prisma.post.delete({
      where: { id: postId }
    });

    // Delete image file if exists
    if (post.imageUrl) {
      const imagePath = path.join(process.cwd(), post.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Get user stats (posts, followers, following)
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [postsCount, followersCount, followingCount] = await Promise.all([
      prisma.post.count({ where: { userId } }),
      prisma.follow.count({ where: { followingId: userId } }),
      prisma.follow.count({ where: { followerId: userId } })
    ]);

    res.json({
      posts: postsCount,
      followers: followersCount,
      following: followingCount
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({ error: "Failed to get user stats" });
  }
};

// Get suggested students
export const getSuggestedStudents = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get users that the current user is not following
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });

    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId); // Exclude self

    const suggested = await prisma.user.findMany({
      where: {
        id: { notIn: followingIds }
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        branch: true,
        year: true,
        batchYear: true
      },
      take: 10
    });

    const formatted = suggested.map(user => ({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      branch: user.branch || 'Computer Science',
      year: user.year || calculateYear(user.batchYear)
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error getting suggested students:", error);
    res.status(500).json({ error: "Failed to get suggested students" });
  }
};

// Get top contributors
export const getTopContributors = async (req, res) => {
  try {
    const topContributors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        posts: {
          select: {
            id: true
          }
        }
      },
      take: 10
    });

    const formatted = topContributors
      .map(user => ({
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        posts: user.posts.length
      }))
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 5);

    res.json(formatted);
  } catch (error) {
    console.error("Error getting top contributors:", error);
    res.status(500).json({ error: "Failed to get top contributors" });
  }
};

// Get trending posts
export const getTrendingPosts = async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: oneDayAgo
        }
      },
      include: {
        likes: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    const trending = posts.map(post => ({
      id: post.id,
      content: post.content.substring(0, 100),
      likes: post.likes.length,
      comments: post.comments.length
    }));

    res.json(trending);
  } catch (error) {
    console.error("Error getting trending posts:", error);
    res.status(500).json({ error: "Failed to get trending posts" });
  }
};

// Get stories
export const getStories = async (req, res) => {
  try {
    const now = new Date();
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: now
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Get server URL from request or environment
    const getServerUrl = () => {
      if (process.env.SERVER_URL) return process.env.SERVER_URL;
      if (req.protocol && req.get('host')) {
        return `${req.protocol}://${req.get('host')}`;
      }
      return 'http://localhost:5000';
    };
    const serverUrl = getServerUrl();

    const formatted = stories.map(story => ({
      id: story.id,
      user: {
        id: story.user.id,
        name: story.user.name,
        avatarUrl: story.user.avatarUrl
      },
      imageUrl: story.imageUrl.startsWith('http') ? story.imageUrl : `${serverUrl}${story.imageUrl}`
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error getting stories:", error);
    res.status(500).json({ error: "Failed to get stories" });
  }
};

// Configure multer for story images
const storyImageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads", "stories");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `story-${userId}-${timestamp}${ext}`);
  }
});

export const uploadStoryImageMiddleware = multer({
  storage: storyImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single("image");

// Create a story
export const createStory = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: "Story image is required" });
    }

    const imageUrl = `/uploads/stories/${req.file.filename}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Stories expire after 24 hours

    const story = await prisma.story.create({
      data: {
        imageUrl: imageUrl,
        userId: userId,
        expiresAt: expiresAt
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    // Get server URL from request or environment
    const getServerUrl = () => {
      if (process.env.SERVER_URL) return process.env.SERVER_URL;
      if (req.protocol && req.get('host')) {
        return `${req.protocol}://${req.get('host')}`;
      }
      return 'http://localhost:5000';
    };
    const serverUrl = getServerUrl();

    res.status(201).json({
      id: story.id,
      user: story.user,
      imageUrl: story.imageUrl.startsWith('http') ? story.imageUrl : `${serverUrl}${story.imageUrl}`
    });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ error: "Failed to create story" });
  }
};

// Follow/Unfollow a user
export const toggleFollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const { followingId } = req.params;

    if (userId === followingId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: followingId
        }
      }
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          id: existingFollow.id
        }
      });
      res.json({ following: false });
    } else {
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: followingId
        }
      });
      res.json({ following: true });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ error: "Failed to toggle follow" });
  }
};

// Helper function to calculate year from batchYear
function calculateYear(batchYear) {
  if (!batchYear) return '1st';
  const currentYear = new Date().getFullYear();
  const yearDiff = currentYear - batchYear;
  if (yearDiff < 0) return '1st';
  if (yearDiff === 0) return '1st';
  if (yearDiff === 1) return '2nd';
  if (yearDiff === 2) return '3rd';
  if (yearDiff === 3) return '4th';
  return 'Alumni';
}

