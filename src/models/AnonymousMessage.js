import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

export const createAnonymousMessage = async messageData => prisma.anonymousMessage.create({
    data: {
        content: messageData.content,
        guestId: messageData.guestId,
        timestamp: new Date(messageData.timestamp)
    }
});

export const getAnonymousMessages = async (limit = 100) => prisma.anonymousMessage.findMany({
    orderBy: {
        timestamp: "desc"
    },
    take: limit
});

export default {
    createAnonymousMessage: createAnonymousMessage,
    getAnonymousMessages: getAnonymousMessages
};