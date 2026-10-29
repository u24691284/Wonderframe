import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

const router = express.Router();

//create an album
router.post("/", async (req, res) => {
    try {
        const db = getDB();
        const albumsCollection = db.collection("albums");

        const { userId, name, description, hashtags } = req.body;

        if (!userId || !name) {
            return res.status(400).json({
                message: "User ID and album name are required"
            });
        }

        const newAlbum = {
            userId: new ObjectId(userId),
            name,
            description: description || "",
            hashtags: hashtags || [],
            posts: [],
            createdAt: new Date()
        };

        const result = await albumsCollection.insertOne(newAlbum);

        res.status(201).json({
            message: "Album created successfully",
            albumId: result.insertedId
        });

    } catch (error) {
        console.error("Failed to create album:", error);

        res.status(500).json({
            message: "Failed to create album"
        });
    }
});

//get all albums
router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const albumsCollection = db.collection("albums");

        const albums = await albumsCollection.find({}).toArray();

        res.status(200).json(albums);

    } catch (error) {
        console.error("Failed to get albums:", error);

        res.status(500).json({
            message: "Failed to get albums"
        });
    }
});

//get one album by id
router.get("/:id", async (req, res) => {
    try {
        const db = getDB();
        const albumsCollection = db.collection("albums");

        const album = await albumsCollection.findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!album) {
            return res.status(404).json({
                message: "Album not found"
            });
        }

        res.status(200).json(album);

    } catch (error) {
        console.error("Failed to get album:", error);

        res.status(500).json({
            message: "Failed to get album"
        });
    }
});

//update an album
router.put("/:id", async (req, res) => {
    try {
        const db = getDB();
        const albumsCollection = db.collection("albums");

        const { name, description, hashtags } = req.body;

        const result = await albumsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name,
                    description,
                    hashtags
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Album not found"
            });
        }

        res.status(200).json({
            message: "Album updated successfully"
        });

    } catch (error) {
        console.error("Failed to update album:", error);

        res.status(500).json({
            message: "Failed to update album"
        });
    }
});

//delete an album
router.delete("/:id", async (req, res) => {
    try {
        const db = getDB();
        const albumsCollection = db.collection("albums");

        const result = await albumsCollection.deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Album not found"
            });
        }

        res.status(200).json({
            message: "Album deleted successfully"
        });

    } catch (error) {
        console.error("Failed to delete album:", error);

        res.status(500).json({
            message: "Failed to delete album"
        });
    }
});

// Add a post to an album
router.put("/:id/posts", async (req, res) => {
    try {
        const db = getDB();

        const albumsCollection = db.collection("albums");
        const postsCollection = db.collection("posts");

        const albumId = req.params.id;
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        // Make sure the post exists
        const post = await postsCollection.findOne({
            _id: new ObjectId(postId)
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Add post to album
        const result = await albumsCollection.updateOne(
            {
                _id: new ObjectId(albumId),
                posts: { $ne: new ObjectId(postId) }
            },
            {
                $addToSet: { //prevents the same post being added twice
                    posts: new ObjectId(postId)
                },
                $push: {
                    activities: {
                        type: "post_added",
                        postId: new ObjectId(postId),
                        createdAt: new Date()
                    }
                }
            }
        );


        if (result.matchedCount === 0) {
            const albumExists = await albumsCollection.findOne({
                _id: new ObjectId(albumId)
            });

            return res.status(albumExists ? 409 : 404).json({
                message: albumExists
                    ? "Post is already in this album"
                    : "Album not found"
            });
        }

        res.status(200).json({
            message: "Post added to album"
        });

    } catch (error) {
        console.error(
            "Error adding post to album:",
            error
        );

        res.status(500).json({
            message: "Failed to add post to album"
        });
    }

});

// Remove a post from an album
router.delete("/:id/posts/:postId", async (req, res) => {
    try {
        const db = getDB();
        const albumsCollection = db.collection("albums");

        const albumId = req.params.id;
        const postId = req.params.postId;

        const result = await albumsCollection.updateOne(
            {
                _id: new ObjectId(albumId)
            },
            {
                $pull: {
                    posts: new ObjectId(postId)
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Album not found"
            });
        }

        res.status(200).json({
            message: "Post removed from album"
        });

    } catch (error) {
        console.error(
            "Error removing post from album:",
            error
        );

        res.status(500).json({
            message: "Failed to remove post from album"
        });
    }
    
});

export default router;