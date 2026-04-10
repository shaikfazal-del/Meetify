import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));

app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

// Health check — Render pings GET / to verify the service is alive
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "Meetify Backend API",
        version: "1.0.0",
        endpoints: ["/api/v1/users"],
    });
});

const start = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const connectionDb = await mongoose.connect(mongoUri);

        console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
        server.listen(app.get("port"), () => {
            console.log(`SERVER IS RUNNING ON PORT ${app.get("port")}`);
        });
    } catch (error) {
        console.error("FATAL ERROR: Failed to start server:", error);
        process.exit(1);
    }
}



start();
