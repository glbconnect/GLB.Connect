import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to check if user is mentor/alumni (based on batchYear)
const isMentor = (user) => {
  const currentYear = new Date().getFullYear();
  // Consider users graduated 2+ years ago as mentors
  return user.batchYear && (currentYear - user.batchYear) >= 2;
};

// ==================== POLLS ====================

// Get all active polls
export const getActivePolls = async (req, res) => {
  try {
    const now = new Date();
    const polls = await prisma.poll.findMany({
      where: {
        expiresAt: {
          gt: now
        }
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            batchYear: true
          }
        },
        options: {
          include: {
            votes: true
          }
        },
        votes: {
          where: {
            userId: req.user?.id
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedPolls = polls.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      mentor: {
        id: poll.mentor.id,
        name: poll.mentor.name,
        avatarUrl: poll.mentor.avatarUrl,
        batchYear: poll.mentor.batchYear
      },
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        voteCount: option.votes.length
      })),
      hasVoted: poll.votes.length > 0,
      userVote: poll.votes.length > 0 ? poll.votes[0].optionId : null,
      expiresAt: poll.expiresAt,
      createdAt: poll.createdAt
    }));

    res.json(formattedPolls);
  } catch (error) {
    console.error("Error getting active polls:", error);
    res.status(500).json({ error: "Failed to get active polls" });
  }
};

// Create a poll (mentor only)
export const createPoll = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!isMentor(user)) {
      return res.status(403).json({ error: "Only mentors/alumni can create polls" });
    }

    const { title, description, options, expiresAt } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "Title and at least 2 options are required" });
    }

    if (!expiresAt || new Date(expiresAt) <= new Date()) {
      return res.status(400).json({ error: "Expiry date must be in the future" });
    }

    const poll = await prisma.poll.create({
      data: {
        title,
        description: description || null,
        mentorId: userId,
        expiresAt: new Date(expiresAt),
        options: {
          create: options.map(option => ({
            text: option
          }))
        }
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            batchYear: true
          }
        },
        options: true
      }
    });

    res.status(201).json({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      mentor: poll.mentor,
      options: poll.options.map(opt => ({
        id: opt.id,
        text: opt.text,
        voteCount: 0
      })),
      hasVoted: false,
      expiresAt: poll.expiresAt,
      createdAt: poll.createdAt
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    res.status(500).json({ error: "Failed to create poll" });
  }
};

// Vote on a poll
export const voteOnPoll = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { pollId } = req.params;
    const { optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({ error: "Option ID is required" });
    }

    // Check if poll exists and is active
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true
      }
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    if (new Date(poll.expiresAt) <= new Date()) {
      return res.status(400).json({ error: "Poll has expired" });
    }

    // Check if option belongs to poll
    const option = poll.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(400).json({ error: "Invalid option for this poll" });
    }

    // Check if user already voted
    const existingVote = await prisma.pollVote.findUnique({
      where: {
        pollId_userId: {
          pollId,
          userId
        }
      }
    });

    if (existingVote) {
      // Update existing vote
      await prisma.pollVote.update({
        where: {
          pollId_userId: {
            pollId,
            userId
          }
        },
        data: {
          optionId
        }
      });
    } else {
      // Create new vote
      await prisma.pollVote.create({
        data: {
          pollId,
          optionId,
          userId
        }
      });
    }

    // Get updated poll with vote counts
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            votes: true
          }
        },
        votes: {
          where: {
            userId
          }
        }
      }
    });

    res.json({
      success: true,
      poll: {
        id: updatedPoll.id,
        options: updatedPoll.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          voteCount: opt.votes.length
        })),
        hasVoted: true,
        userVote: optionId
      }
    });
  } catch (error) {
    console.error("Error voting on poll:", error);
    res.status(500).json({ error: "Failed to vote on poll" });
  }
};

// ==================== SESSIONS ====================

// Get all upcoming sessions
export const getUpcomingSessions = async (req, res) => {
  try {
    const userId = req.user?.id;
    const now = new Date();

    const sessions = await prisma.mentorshipSession.findMany({
      where: {
        scheduledAt: {
          gt: now
        }
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            batchYear: true
          }
        },
        enrollments: {
          where: {
            userId: userId
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    const formattedSessions = sessions.map(session => ({
      id: session.id,
      title: session.title,
      topic: session.topic,
      description: session.description,
      mentor: {
        id: session.mentor.id,
        name: session.mentor.name,
        avatarUrl: session.mentor.avatarUrl,
        batchYear: session.mentor.batchYear
      },
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      maxParticipants: session.maxParticipants,
      seatsRemaining: session.maxParticipants - session._count.enrollments,
      meetingLink: session.meetingLink,
      mode: session.mode,
      isEnrolled: session.enrollments.length > 0,
      createdAt: session.createdAt
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error("Error getting upcoming sessions:", error);
    res.status(500).json({ error: "Failed to get upcoming sessions" });
  }
};

// Create a session (mentor only)
export const createSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!isMentor(user)) {
      return res.status(403).json({ error: "Only mentors/alumni can create sessions" });
    }

    const { title, topic, description, scheduledAt, duration, maxParticipants, meetingLink, mode } = req.body;

    if (!title || !topic || !scheduledAt || !duration || !maxParticipants || !meetingLink) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const sessionDate = new Date(scheduledAt);
    if (sessionDate <= new Date()) {
      return res.status(400).json({ error: "Session must be scheduled in the future" });
    }

    if (maxParticipants < 1) {
      return res.status(400).json({ error: "Max participants must be at least 1" });
    }

    const session = await prisma.mentorshipSession.create({
      data: {
        title,
        topic,
        description: description || null,
        mentorId: userId,
        scheduledAt: sessionDate,
        duration: parseInt(duration),
        maxParticipants: parseInt(maxParticipants),
        meetingLink,
        mode: mode || "Online"
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            batchYear: true
          }
        }
      }
    });

    res.status(201).json({
      id: session.id,
      title: session.title,
      topic: session.topic,
      description: session.description,
      mentor: session.mentor,
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      maxParticipants: session.maxParticipants,
      seatsRemaining: session.maxParticipants,
      meetingLink: session.meetingLink,
      mode: session.mode,
      isEnrolled: false,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};

// Enroll in a session
export const enrollInSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { sessionId } = req.params;

    // Check if session exists and is upcoming
    const session = await prisma.mentorshipSession.findUnique({
      where: { id: sessionId },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (new Date(session.scheduledAt) <= new Date()) {
      return res.status(400).json({ error: "Cannot enroll in past sessions" });
    }

    if (session._count.enrollments >= session.maxParticipants) {
      return res.status(400).json({ error: "Session is full" });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.sessionEnrollment.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: "Already enrolled in this session" });
    }

    // Create enrollment
    await prisma.sessionEnrollment.create({
      data: {
        sessionId,
        userId
      }
    });

    res.json({ success: true, message: "Successfully enrolled in session" });
  } catch (error) {
    console.error("Error enrolling in session:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Already enrolled in this session" });
    }
    res.status(500).json({ error: "Failed to enroll in session" });
  }
};

// Get user's enrolled sessions
export const getMySessions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const now = new Date();

    // Get sessions where user is enrolled
    const enrollments = await prisma.sessionEnrollment.findMany({
      where: {
        userId
      },
      include: {
        session: {
          include: {
            mentor: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                batchYear: true
              }
            },
            _count: {
              select: {
                enrollments: true
              }
            }
          }
        }
      },
      orderBy: {
        session: {
          scheduledAt: 'asc'
        }
      }
    });

    const sessions = enrollments.map(enrollment => ({
      id: enrollment.session.id,
      title: enrollment.session.title,
      topic: enrollment.session.topic,
      description: enrollment.session.description,
      mentor: enrollment.session.mentor,
      scheduledAt: enrollment.session.scheduledAt,
      duration: enrollment.session.duration,
      maxParticipants: enrollment.session.maxParticipants,
      seatsRemaining: enrollment.session.maxParticipants - enrollment.session._count.enrollments,
      meetingLink: enrollment.session.meetingLink,
      mode: enrollment.session.mode,
      isEnrolled: true,
      isLive: new Date(enrollment.session.scheduledAt) <= now && 
              new Date(enrollment.session.scheduledAt.getTime() + enrollment.session.duration * 60000) >= now,
      enrolledAt: enrollment.enrolledAt,
      createdAt: enrollment.session.createdAt
    }));

    res.json(sessions);
  } catch (error) {
    console.error("Error getting my sessions:", error);
    res.status(500).json({ error: "Failed to get my sessions" });
  }
};

// Get sessions created by mentor
export const getMentorSessions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const sessions = await prisma.mentorshipSession.findMany({
      where: {
        mentorId: userId
      },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    const formattedSessions = sessions.map(session => ({
      id: session.id,
      title: session.title,
      topic: session.topic,
      description: session.description,
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      maxParticipants: session.maxParticipants,
      enrolledCount: session._count.enrollments,
      seatsRemaining: session.maxParticipants - session._count.enrollments,
      meetingLink: session.meetingLink,
      mode: session.mode,
      createdAt: session.createdAt
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error("Error getting mentor sessions:", error);
    res.status(500).json({ error: "Failed to get mentor sessions" });
  }
};

