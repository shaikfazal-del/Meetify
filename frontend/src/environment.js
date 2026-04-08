// In production, set REACT_APP_BACKEND_URL in Render's environment variables.
// For local dev, it falls back to http://localhost:8000
const server = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default server;