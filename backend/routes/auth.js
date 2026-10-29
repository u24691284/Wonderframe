import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

//signup
router.post("/signup", async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        if (!fullName || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const db = getDB();
        const users = db.collection("users");

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const newUser = {
            fullName,
            username,
            email,
            password,
            friends: [],
            friendRequests: []
        };

        const result = await users.insertOne(newUser);

        res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: result.insertedId,
                fullName,
                username,
                email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Signup failed"
        });
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const db = getDB();
        const users = db.collection("users");

        const user = await users.findOne({
            email,
            password
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.status(200).json({
        message: "Logout successful"
    });
});

export default router;