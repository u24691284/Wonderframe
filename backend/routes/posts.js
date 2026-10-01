import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = express.Router();

//create a post
router.post("/", async (req, res) => {
    try {
        const db = getDB();
        const postsCollection = db.collection("posts");

        const { userId, image, description, hashtags } = req.body;

        if (!userId || !image || !description) {
            return res.status(400).json({
                message: "User ID, image and description are required"
            });
        }

        const newPost = {
            userId: new ObjectId(userId),
            image,
            description,
            hashtags: hashtags || [],
            likes: [],
            comments: [],
            createdAt: new Date()
        };

        const result = await postsCollection.insertOne(newPost);

        res.status(201).json({
            message: "Post created successfully",
            postId: result.insertedId
        });

    } catch (error) {
        console.error("Failed to create post:", error);

        res.status(500).json({
            message: "Failed to create post"
        });
    }
});

//get all posts
router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const postsCollection = db.collection("posts");

        const posts = await postsCollection.find({}).toArray();

        res.status(200).json(posts);

    } catch (error) {
        console.error("Failed to get posts:", error);

        res.status(500).json({
            message: "Failed to get posts"
        });
    }
});

//get one post by id
router.get("/:id", async (req, res) => {
    try {
        const db = getDB();
        const postsCollection = db.collection("posts");

        const post = await postsCollection.findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json(post);

    } catch (error) {
        console.error("Failed to get post:", error);

        res.status(500).json({
            message: "Failed to get post"
        });
    }
});

//update a post
router.put("/:id", async (req, res) => {
    try {
        const db = getDB();
        const postsCollection = db.collection("posts");

        const { image, description, hashtags } = req.body;

        const result = await postsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    image,
                    description,
                    hashtags
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post updated successfully"
        });

    } catch (error) {
        console.error("Failed to update post:", error);

        res.status(500).json({
            message: "Failed to update post"
        });
    }
});

//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const db = getDB();
        const postsCollection = db.collection("posts");

        const result = await postsCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Failed to delete post:", error);

        res.status(500).json({
            message: "Failed to delete post"
        });
    }
});

// ADD COMMENT TO POST
router.post("/:id/comments", async (req, res) => {
    try {
        const db = getDB();
        const postsCollection = db.collection("posts");

        const postId = req.params.id;
        const { userId, text } = req.body;

        if (!userId || !text) {
            return res.status(400).json({
                message: "User ID and comment text are required"
            });
        }

        const comment = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            text: text,
            createdAt: new Date()
        };

        const result = await postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $push: {
                    comments: comment
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(201).json({
            message: "Comment added successfully",
            comment: comment
        });

    } catch (error) {
        console.error("Error adding comment:", error);

        res.status(500).json({
            message: "Failed to add comment"
        });
    }
});

// REPORT A POST
router.post("/:id/report", async (req, res) => {
    try {
        const db = getDB();
        const postsCollection = db.collection("posts");

        const postId = req.params.id;
        const { userId, reason } = req.body;

        if (!userId || !reason) {
            return res.status(400).json({
                message: "User ID and reason are required"
            });
        }

        const report = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            reason: reason,
            createdAt: new Date()
        };

        const result = await postsCollection.updateOne(
            { _id: new ObjectId(postId) },
            {
                $push: {
                    reports: report
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(201).json({
            message: "Post reported successfully"
        });

    } catch (error) {
        console.error("Error reporting post:", error);

        res.status(500).json({
            message: "Failed to report post"
        });
    }
});

export default router;