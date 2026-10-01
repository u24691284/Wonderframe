import { ObjectId } from "mongodb";
import { getDB } from "../db.js";

function getUsersCollection() {
    const db = getDB();
    return db.collection("users");
}

//get all users
export async function getAllUsers() {
    return await getUsersCollection()
        .find({}, { projection: { password: 0 } })
        .toArray();
}

//get one user by id
export async function getUserById(id) {
    return await getUsersCollection().findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
    );
}

//update a user
export async function updateUser(id, fullName, username, email) {
    return await getUsersCollection().updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                fullName,
                username,
                email
            }
        }
    );
}

//delete a user
export async function deleteUser(id) {
    return await getUsersCollection().deleteOne({
        _id: new ObjectId(id)
    });
}

//get user by id - used when adding a friend
export async function findUser(id) {
    return await getUsersCollection().findOne({
        _id: new ObjectId(id)
    });
}

//add a friend
export async function addFriend(userId, friendId) {
    return await getUsersCollection().updateOne(
        { _id: new ObjectId(userId) },
        {
            $addToSet: {
                friends: new ObjectId(friendId)
            }
        }
    );
}