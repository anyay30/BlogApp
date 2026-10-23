import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createUserToken = (userId) => jwt.sign(
    { sub: userId.toString(), type: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

const publicUser = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email
});

export const registerUser = async (req, res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (name.length < 2 || name.length > 80) {
        return res.status(400).json({ success: false, message: "Name must be between 2 and 80 characters." });
    }

    if (email.length > 254 || !emailPattern.test(email)) {
        return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }

    if (password.length < 8 || password.length > 72 || bcrypt.truncates(password)) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters and no more than 72 UTF-8 bytes." });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(503).json({ success: false, message: "Account authentication is not configured on the server." });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: passwordHash });

        return res.status(201).json({
            success: true,
            token: createUserToken(user._id),
            user: publicUser(user)
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "An account with this email already exists." });
        }

        console.error("User registration failed", error.name || "UnknownError");
        return res.status(500).json({ success: false, message: "Could not create your account. Please try again." });
    }
};

export const loginUser = async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(503).json({ success: false, message: "Account authentication is not configured on the server." });
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        const passwordMatches = user && await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        return res.status(200).json({
            success: true,
            token: createUserToken(user._id),
            user: publicUser(user)
        });
    } catch (error) {
        console.error("User login failed", error.name || "UnknownError");
        return res.status(500).json({ success: false, message: "Could not sign in. Please try again." });
    }
};
