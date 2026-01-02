import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Authentication token required"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
};

export const requireAdmin = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Authentication token required"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await getUserById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Admin access required"
            });
        }
        req.user = decoded;
        req.user.role = user.role;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token or unauthorized"
        });
    }
};

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = verified;
        } catch (error) {}
    }
    next();
};

export default {
    verifyToken: verifyToken,
    requireAdmin: requireAdmin
};