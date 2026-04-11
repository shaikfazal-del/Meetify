import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"

import crypto from "crypto"
import { Meeting } from "../models/meeting.model.js";

// Escape special regex characters from user input to prevent MongoDB regex injection/crashes
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const login = async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please provide username and password." });
    }

    username = username.trim();

    if (username.length < 3 || username.length > 50) {
        return res.status(400).json({ message: "Username must be between 3 and 50 characters." });
    }

    try {
        const safeUsername = escapeRegex(username);
        const user = await User.findOne({ username: { $regex: `^${safeUsername}$`, $options: 'i' } });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "No account found with that username. Please register first." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            const token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Incorrect password. Please try again." })
        }

    } catch (e) {
        console.error("Login error:", e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Login failed due to a server error. Please try again later." })
    }
}


const register = async (req, res) => {
    let { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ message: "Please provide name, username, and password." });
    }

    username = username.trim();
    name = name.trim();

    if (username.length < 3 || username.length > 50) {
        return res.status(400).json({ message: "Username must be between 3 and 50 characters." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    try {
        const safeUsername = escapeRegex(username);
        const existingUser = await User.findOne({ username: { $regex: `^${safeUsername}$`, $options: 'i' } });

        if (existingUser) {
            return res.status(409).json({ message: "This username is already taken. Please choose a different one." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(httpStatus.CREATED).json({ message: "Account created successfully! You can now sign in." })

    } catch (e) {
        console.error("Registration error:", e);
        // Handle MongoDB duplicate key error (race condition)
        if (e.code === 11000) {
            return res.status(409).json({ message: "This username is already taken. Please choose a different one." });
        }
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Registration failed due to a server error. Please try again later." })
    }

}


const getUserHistory = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Authentication required" });
    }

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid or expired token" });
        }

        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        console.error("Get history error:", e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Could not fetch meeting history" })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "User not found" });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        console.error("Add history error:", e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to save meeting code to history" })
    }
}


export { login, register, getUserHistory, addToHistory }