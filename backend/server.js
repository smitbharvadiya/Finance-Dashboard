import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User from './models/user.js';
import connectDB from "./config/db.js";
import record from './routes/record.js';

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/record", record);

app.get('/', (req, res) => {
    res.send("Backend dashboard");
});

app.post("/register", async (req, res) => {

    const { name, email, password, role } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const createdUser = await User.create({
            name,
            email,
            password: hash,
            role
        });

        const token = jwt.sign(
            { id: createdUser._id, email: createdUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(201).json({
            message: 'User Created Successfully',
            user: createdUser,
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: "User Not Found!" });

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.log("Login Error: ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/logout", (req, res) => {

    res.clearCookie("token");

    res.json({ message: "Logout Succesfull" });
});

app.listen(3000, () => {
    console.log("The server is running on port 3000");
});