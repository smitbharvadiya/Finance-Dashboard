import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


// Register
router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({
            message: "Name, email, and password are required",
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters",
        });
    }

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const createdUser = await User.create({
            name,
            email,
            password: hash,
            role: "viewer"
        });

        const token = jwt.sign(
            {
                id: createdUser._id,
                email: createdUser.email,
                role: createdUser.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });

        const safeUser = {
            id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role
        };

        res.status(201).json({
            message: 'User Created Successfully',
            user: safeUser,
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});


// Login
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        return res.status(400).json({
            message: "Email and password are required",
            code: "MISSING_FIELDS"
        });
    }

    try {

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                message: "This account has been deactivated",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password!"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log("Login Error: ", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});


// Me
router.get("/me", verifyToken, async (req, res) => {

    try {

        const user = await User
            .findById(req.userId)
            .select("name email role status");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                message: "Account is inactive"
            });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.log("Me Error: ", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }

});


// Logout
router.post("/logout", (req, res) => {

    res.clearCookie("token");

    res.json({
        message: "Logout Successful"
    });

});


export default router;