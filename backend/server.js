// Student Number: u24691284

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import albumRoutes from "./routes/albums.js";


dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
// allow base64 profile images
app.use(express.json({ limit: "10mb" }));

//routes
app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/albums", albumRoutes);

//start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });