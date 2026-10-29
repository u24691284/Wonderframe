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
        const { fullName, username, email, profileImage } = req.body;
        const updates = { fullName, username, email };

        // update the picture only when one is provided
        if (profileImage !== undefined) {
            updates.profileImage = profileImage;
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
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


 // send a friend request
router.post("/:id/friend-requests", async (req, res) => {
    try {
        const { friendId } = req.body;
        const senderId = req.params.id;

        if (!ObjectId.isValid(senderId) || !ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }


        const users = getDB().collection("users");
        const sender = await users.findOne({ _id: new ObjectId(senderId) });
        const receiver = await users.findOne({ _id: new ObjectId(friendId) });

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        if (String(sender._id) === String(receiver._id)) {
            return res.status(400).json({
                message: "You cannot send yourself a friend request"
            });
        }

        if (
            (sender.friends || []).some((id) => String(id) === friendId) ||
            (receiver.friends || []).some((id) => String(id) === senderId)
        ) {
            return res.status(400).json({ message: "Already friends" });
        }

        if (
            (receiver.friendRequests || []).some(
                (id) => String(id) === senderId
            )
        ) {
            return res.status(400).json({
                message: "Friend request already sent"
            });
        }

        if (
            (sender.friendRequests || []).some(
                (id) => String(id) === friendId
            )
        ) {
            return res.status(400).json({
                message: "This user has already sent you a request"
            });
        }

        await users.updateOne(
            { _id: receiver._id },
            { $addToSet: { friendRequests: sender._id } }
        );

        res.json({ message: "Friend request sent" });

    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Failed to send request" });
    }
});

// accept a friend request
router.put("/:id/friend-requests/:senderId", async (req, res) => {
    try {
        const { id, senderId } = req.params;

        if (!ObjectId.isValid(id) || !ObjectId.isValid(senderId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const users = getDB().collection("users");
        const receiverId = new ObjectId(id);
        const requesterId = new ObjectId(senderId);

        const receiver = await users.findOne({ _id: receiverId });
        const sender = await users.findOne({ _id: requesterId });

        if (!receiver || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        const hasRequest = (receiver.friendRequests || []).some(
            (requestId) => String(requestId) === senderId
        );

        if (!hasRequest) {
            return res.status(400).json({
                message: "Friend request not found"
            });
        }

        await users.updateOne(
            { _id: receiverId },
            {
                $pull: { friendRequests: requesterId },
                $addToSet: { friends: requesterId }
            }
        );

        await users.updateOne(
            { _id: requesterId },
            { $addToSet: { friends: receiverId } }
        );

        res.json({ message: "Friend request accepted" });

    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Failed to accept request" });
    }
});

// reject or cancel a friend request
router.delete("/:id/friend-requests/:senderId", async (req, res) => {
    try {
        const { id, senderId } = req.params;

        if (!ObjectId.isValid(id) || !ObjectId.isValid(senderId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const result = await getDB().collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $pull: { friendRequests: new ObjectId(senderId) } }
        );

        if (!result.matchedCount) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Friend request removed" });

    } catch (error) {
        console.error("Error removing friend request:", error);
        res.status(500).json({ message: "Failed to remove request" });
    }
});

// remove a friend from both users
router.delete("/:id/friends/:friendId", async (req, res) => {
    try {
        const { id, friendId } = req.params;

        if (!ObjectId.isValid(id) || !ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const users = getDB().collection("users");

        const result = await users.updateOne(
            { _id: new ObjectId(id) },
            { $pull: { friends: new ObjectId(friendId) } }
        );

        if (!result.matchedCount) {
            return res.status(404).json({ message: "User not found" });
        }

        await users.updateOne(
            { _id: new ObjectId(friendId) },
            { $pull: { friends: new ObjectId(id) } }
        );

        res.json({ message: "Friend removed successfully" });

    } catch (error) {
        console.error("Error removing friend:", error);
        res.status(500).json({ message: "Failed to remove friend" });
    }
});

export default router;
