import { MongoClient } from "mongodb";

// Student Number: u24691284

let client;
let db;

async function connectDB() {
    const uri = process.env.MONGO_URI;

    client = new MongoClient(uri);

    // TODO: Connect to MongoDB
    await client.connect();

    // TODO: Store the PhotoShare database in db
    db = client.db("photoShareDB");
    console.log("Connected to MongoDB");

}

function getDB() {
    // TODO: Return the database
    return db;
}

export { connectDB, getDB };