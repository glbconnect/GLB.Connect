import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const getUsersByBatch = async (req, res) => {
    try {
        const {batch: batch} = req.params;
        const users = await prisma.user.findMany({
            where: {
                batch: Number(batch)
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const {id: id} = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!user) return res.status(404).json({
            error: "User not found"
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};