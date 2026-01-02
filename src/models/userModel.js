import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient;

const SALT_ROUNDS = 10;

export const createUser = async userData => {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    return prisma.user.create({
        data: {
            ...userData,
            password: hashedPassword
        }
    });
};

export const findUserByEmail = async email => prisma.user.findUnique({
    where: {
        email: email
    },
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        avatarUrl: true,
        batchYear: true,
        skills: true,
        createdAt: true,
        updatedAt: true
    }
});

export const validatePassword = async (plainPassword, hashedPassword) => bcrypt.compare(plainPassword, hashedPassword);

export const generateToken = userId => jwt.sign({
    id: userId
}, process.env.JWT_SECRET, {
    expiresIn: "1d"
});

export const getUserById = async id => prisma.user.findUnique({
    where: {
        id: id
    },
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        batchYear: true,
        skills: true,
        createdAt: true,
        updatedAt: true
    }
});

export const getUserByIdWithPassword = async id => prisma.user.findUnique({
    where: {
        id: id
    },
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
    }
});

export const getAllUsers = async () => prisma.user.findMany({
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        batchYear: true,
        skills: true,
        createdAt: true,
        updatedAt: true
    }
});

export const searchUsersByEmail = async searchQuery => prisma.user.findMany({
    where: {
        OR: [ {
            email: {
                contains: searchQuery,
                mode: "insensitive"
            }
        }, {
            name: {
                startsWith: searchQuery,
                mode: "insensitive"
            }
        }, {
            name: {
                contains: searchQuery,
                mode: "insensitive"
            }
        } ]
    },
    select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        batchYear: true,
        skills: true,
        createdAt: true,
        updatedAt: true
    }
});

export const updateUser = async (userId, updateData) => prisma.user.update({
    where: {
        id: userId
    },
    data: updateData,
    select: {
        id: true,
        name: true,
        email: true,
        password: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
    }
});

export const updateUserPassword = async (userId, hashedPassword) => prisma.user.update({
    where: {
        id: userId
    },
    data: {
        password: hashedPassword
    }
});