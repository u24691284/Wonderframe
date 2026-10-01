import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = express.Router();

//get all users
router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const users = await usersCollection.find(
            {},
            { projection: { password: 0 } }
        ).toArray();

        res.status(200).json(users);

    } catch (error) {
        console.error("Failed to get users:", error);

        res.status(500).json({
            message: "Failed to get users"
        });
    }
});

//get one user by their id
router.get("/:id", async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne(
            { _id: new ObjectId(req.params.id) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Failed to get user:", error);

        res.status(500).json({
            message: "Failed to get user"
        });
    }
});

//update a user
router.put("/:id", async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const { fullName, username, email } = req.body;

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    fullName,
                    username,
                    email
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully"
        });

    } catch (error) {
        console.error("Failed to update user:", error);

        res.status(500).json({
            message: "Failed to update user"
        });
    }
});

//delete a user
router.delete("/:id", async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Failed to delete user:", error);

        res.status(500).json({
            message: "Failed to delete user"
        });
    }
});

//add a friend
router.put("/:id/friends", async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const { friendId } = req.body;

        if (!friendId) {
            return res.status(400).json({
                message: "Friend ID is required"
            });
        }

        const friend = await usersCollection.findOne({
            _id: new ObjectId(friendId)
        });

        if (!friend) {
            return res.status(404).json({
                message: "Friend not found"
            });
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                //use add to set as it wont add the same friend twice
                $addToSet: {
                    friends: new ObjectId(friendId)
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Friend added successfully"
        });

    } catch (error) {
        console.error("Failed to add friend:", error);

        res.status(500).json({
            message: "Failed to add friend"
        });
    }
});

// Remove a friend
router.delete("/:id/friends/:friendId", async (req, res) => {
    try {
        const db = getDB();
        const usersCollection = db.collection("users");

        const userId = req.params.id;
        const friendId = req.params.friendId;

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $pull: {
                    friends: new ObjectId(friendId)
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Friend removed successfully"
        });

    } catch (error) {
        console.error("Error removing friend:", error);

        res.status(500).json({
            message: "Failed to remove friend"
        });
    }
});

export default router;