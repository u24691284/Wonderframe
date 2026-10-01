import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

function getPostsCollection() {
    const db = getDB();
    return db.collection("posts");
}

//create a post
export async function createPost(userId, image, description, hashtags) {
    const newPost = {
        userId: new ObjectId(userId),
        image,
        description,
        hashtags: hashtags || [],
        likes: [],
        comments: [],
        createdAt: new Date()
    };

    return await getPostsCollection().insertOne(newPost);
}

//get all posts
export async function getAllPosts() {
    return await getPostsCollection().find({}).toArray();
}

//get one post by id
export async function getPostById(id) {
    return await getPostsCollection().findOne({
        _id: new ObjectId(id)
    });
}

//update a post
export async function updatePost(id, image, description, hashtags) {
    return await getPostsCollection().updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                image,
                description,
                hashtags
            }
        }
    );
}

//delete a post
export async function deletePost(id) {
    return await getPostsCollection().deleteOne({
        _id: new ObjectId(id)
    });
}