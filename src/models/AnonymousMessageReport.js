import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAnonymousMessageReport = async (data) => prisma.anonymousMessageReport.create({
    data: {
        messageId: data.messageId,
        reportedGuestId: data.reportedGuestId,
        reporterUserId: data.reporterUserId,
        reason: data.reason,
        timestamp: new Date()
    }
});

export const countReportsForMessage = async (messageId) => prisma.anonymousMessageReport.count({
    where: { messageId }
});

export default {
    createAnonymousMessageReport,
    countReportsForMessage
};
