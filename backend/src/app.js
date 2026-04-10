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
// CORS configuration - allow specific origins for production security
const getAllowedOrigins = () => {
    const origins = new Set([
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "https://localhost:3000"
    ]);

    // Add the configured client URL
    if (process.env.CLIENT_URL) {
        const cleanUrl = process.env.CLIENT_URL.replace(/[^\x20-\x7E]/g, "").trim().replace(/\/$/, "");
        if (cleanUrl) origins.add(cleanUrl);
    }

    return Array.from(origins);
};

const allowedOrigins = getAllowedOrigins();
console.log("CORS allowed origins:", allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, server-to-server, etc)
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/$/, ""); // Remove trailing slash

        // Allow exact matches and Render preview subdomains (*.onrender.com)
        const allowed = allowedOrigins.some(allowed => {
            const normalizedAllowed = allowed.replace(/\/$/, "");
            return normalizedOrigin === normalizedAllowed ||
                   normalizedOrigin === allowed ||
                   // Allow Render preview URLs: *.onrender.com
                   (/\.onrender\.com$/.test(normalizedOrigin) && allowed.includes('onrender.com'));
        });

        if (allowed) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            // In production, be strict; log but don't crash
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With", "X-Socket-ID"],
    exposedHeaders: ["X-Total-Count"],
    maxAge: 86400 // 24 hours - cache preflight
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

        // Log environment for debugging (hiding sensitive info)
        console.log("[Startup] Environment:", {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT || 8000,
            hasMongoUri: !!mongoUri,
            mongoUriPrefix: mongoUri.substring(0, 15) + "...",
            hasClientUrl: !!process.env.CLIENT_URL,
            clientUrl: process.env.CLIENT_URL
        });

        const connectionDb = await mongoose.connect(mongoUri);

        console.log(`[MongoDB] Connected successfully to host: ${connectionDb.connection.host}`);
        console.log(`[MongoDB] Database name: ${connectionDb.connection.name}`);

        server.listen(app.get("port"), () => {
            console.log(`[Server] Running on port ${app.get("port")}`);
            console.log(`[Server] CORS allowed origins:`, allowedOrigins);
        });
    } catch (error) {
        console.error("[FATAL] Failed to start server:", error.message);
        process.exit(1);
    }
}



start();
