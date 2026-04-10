import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt"

import crypto from "crypto"
import { Meeting } from "../models/meeting.model.js";
const login = async (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide" });
    }
    
    username = username.trim();

    try {
        const user = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
        }


        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (e) {
        console.error("Login error:", e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }
}


const register = async (req, res) => {
    let { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ message: "Please provide name, username, and password" });
    }

    username = username.trim();
    name = name.trim();

    try {
        const existingUser = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
        if (existingUser) {
            return res.status(409).json({ message: "Username already taken. Please choose a different one." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered" })

    } catch (e) {
        console.error("Registration error:", e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" })
    }

}


const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
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