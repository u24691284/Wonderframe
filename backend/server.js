const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    res.json({
        success: true,
        message: "Login successful",
        user: {
            id: 1,
            email: email
        }
    });
});

app.post("/signup", (req, res) => {
    const { fullName, username, email, password } = req.body;

    res.json({
        success: true,
        message: "Signup successful",
        user: {
            id: 1,
            fullName: fullName,
            username: username,
            email: email
        }
    });
});

app.listen(3000, () => {
    console.log("Listening on localhost:3000");
});