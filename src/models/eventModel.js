// Event model using Prisma Client
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllEvents() {
  return prisma.event.findMany({ include: { organizer: true, registrations: true } });
}

export async function getEventById(id) {
  return prisma.event.findUnique({ where: { id: Number(id) }, include: { organizer: true, registrations: true } });
}

export async function createEvent(data) {
  return prisma.event.create({ data });
}

export async function updateEvent(id, data) {
  return prisma.event.update({ where: { id: Number(id) }, data });
}

export async function deleteEvent(id) {
  return prisma.event.delete({ where: { id: Number(id) } });
}

export async function registerUser(eventId, userId) {
  return prisma.eventRegistration.create({ data: { eventId: Number(eventId), userId } });
}

export async function unregisterUser(eventId, userId) {
  return prisma.eventRegistration.delete({ where: { eventId_userId: { eventId: Number(eventId), userId } } });
}

export async function getRegistrations(eventId) {
  return prisma.eventRegistration.findMany({ where: { eventId: Number(eventId) }, include: { user: true } });
} 