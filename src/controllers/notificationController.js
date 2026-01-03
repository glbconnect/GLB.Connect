import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get notifications for the current user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId
      },
      include: {
        sender: {
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
      take: 20
    });

    // Count unread notifications
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: userId,
        isRead: false
      }
    });

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Failed to get notifications" });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    if (notificationId === 'all') {
      await prisma.notification.updateMany({
        where: {
          recipientId: userId,
          isRead: false
        },
        data: {
          isRead: true
        }
      });
    } else {
      await prisma.notification.update({
        where: {
          id: notificationId,
          recipientId: userId
        },
        data: {
          isRead: true
        }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

// Internal helper to create a notification
export const createNotification = async ({ recipientId, senderId, type, message, relatedId }) => {
  try {
    // Don't create notification if sender is recipient
    if (recipientId === senderId) return;

    const notification = await prisma.notification.create({
      data: {
        recipientId,
        senderId,
        type,
        message,
        relatedId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    // Emit socket event to recipient
    try {
      const io = getIO();
      io.to(recipientId).emit('new_notification', notification);
    } catch (socketError) {
      console.error("Error emitting notification socket event:", socketError);
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    // Don't throw error to avoid breaking the main flow
  }
};
