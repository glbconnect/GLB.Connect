import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSessions = async () => {
    return prisma.session.findMany({
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: {
            scheduledAt: 'asc'
        }
    });
};

export const getSessionById = async (id) => {
    return prisma.session.findUnique({
        where: { id },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    });
};

export const createSession = async (data) => {
    // Generate unique session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return prisma.session.create({
        data: {
            ...data,
            sessionId
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    });
};

export const updateSession = async (id, data) => {
    return prisma.session.update({
        where: { id },
        data,
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    });
};

export const startSession = async (id, joinUrl) => {
    return prisma.session.update({
        where: { id },
        data: {
            status: 'LIVE',
            startedAt: new Date(),
            joinUrl: joinUrl || null
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    });
};

export const endSession = async (id) => {
    return prisma.session.update({
        where: { id },
        data: {
            status: 'ENDED',
            endedAt: new Date()
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        }
    });
};

export const deleteSession = async (id) => {
    return prisma.session.delete({
        where: { id }
    });
};

export const getLiveSessions = async () => {
    return prisma.session.findMany({
        where: {
            status: 'LIVE'
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: {
            startedAt: 'desc'
        }
    });
};

export const getUpcomingSessions = async () => {
    const now = new Date();
    return prisma.session.findMany({
        where: {
            status: 'SCHEDULED',
            scheduledAt: {
                gte: now
            }
        },
        include: {
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true
                }
            }
        },
        orderBy: {
            scheduledAt: 'asc'
        }
    });
};

