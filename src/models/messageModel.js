import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

export const createMessage = async (senderId, receiverId, content, isAnonymous = false) => prisma.message.create({
    data: {
        content: content,
        isAnonymous: isAnonymous,
        senderId: senderId,
        receiverId: receiverId
    },
    include: {
        sender: true,
        receiver: true
    }
});

export const getMessagesBetweenUsers = async (user1Id, user2Id) => prisma.message.findMany({
    where: {
        OR: [ {
            AND: [ {
                senderId: user1Id
            }, {
                receiverId: user2Id
            } ]
        }, {
            AND: [ {
                senderId: user2Id
            }, {
                receiverId: user1Id
            } ]
        } ]
    },
    include: {
        sender: true,
        receiver: true
    },
    orderBy: {
        timestamp: "asc"
    }
});

export const markMessageAsSeen = async messageId => {
    const message = await prisma.message.findUnique({
        where: {
            id: messageId
        }
    });
    if (!message) {
        throw new Error(`Message with ID ${messageId} not found`);
    }
    return prisma.message.update({
        where: {
            id: messageId
        },
        data: {
            seen: true
        },
        include: {
            sender: true,
            receiver: true
        }
    });
};

export const getUnseenMessages = async userId => prisma.message.findMany({
    where: {
        receiverId: userId,
        seen: false
    },
    include: {
        sender: true
    },
    orderBy: {
        timestamp: "desc"
    }
});