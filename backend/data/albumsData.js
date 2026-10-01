import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

function getAlbumsCollection() {
    const db = getDB();
    return db.collection("albums");
}

//create an album
export async function createAlbum(userId, name, description, hashtags) {
    const newAlbum = {
        userId: new ObjectId(userId),
        name,
        description: description || "",
        hashtags: hashtags || [],
        posts: [],
        createdAt: new Date()
    };

    return await getAlbumsCollection().insertOne(newAlbum);
}

//get all albums
export async function getAllAlbums() {
    return await getAlbumsCollection().find({}).toArray();
}

//get one album by id
export async function getAlbumById(id) {
    return await getAlbumsCollection().findOne({
        _id: new ObjectId(id)
    });
}

//update an album
export async function updateAlbum(id, name, description, hashtags) {
    return await getAlbumsCollection().updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                name,
                description,
                hashtags
            }
        }
    );
}

//delete an album
export async function deleteAlbum(id) {
    return await getAlbumsCollection().deleteOne({
        _id: new ObjectId(id)
    });
}