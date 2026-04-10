// Priority order for resolving the backend URL:
// 1. window.__BACKEND_URL__ — set by index.html at runtime (always correct on Render)
// 2. REACT_APP_BACKEND_URL  — CRA build-time env var (backup)
// 3. http://localhost:8000   — local development fallback

const _runtime = typeof window !== "undefined" ? window.__BACKEND_URL__ : "";
const _buildtime = process.env.REACT_APP_BACKEND_URL || "";

const server =
    (_runtime && _runtime !== "undefined") ? _runtime :
    (_buildtime && _buildtime !== "undefined") ? _buildtime :
    "http://localhost:8000";

export default server;