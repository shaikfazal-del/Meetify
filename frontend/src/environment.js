/**
 * Backend URL resolver for production and development environments.
 *
 * Priority order:
 * 1. window.__BACKEND_URL__ — injected at runtime via index.html on Render
 * 2. REACT_APP_BACKEND_URL — build-time env var (Netlify, Vercel, etc.)
 * 3. Render auto-detection — infer from hostname patterns
 * 4. Local fallback for development
 */
const isBrowser = typeof window !== "undefined";

// Get runtime URL injected by server during HTML generation
const runtimeUrl = isBrowser && window.__BACKEND_URL__ ? window.__BACKEND_URL__.trim() : "";

// Get build-time URL from build environment
const buildTimeUrl = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL.trim() : "";

// Auto-detect if we're on Render production
const isRenderProduction = isBrowser && window.location.hostname.includes('.onrender.com');

// Infer Render backend URL from frontend URL pattern
// Render naming: meetify-frontend-xxx.onrender.com -> meetify-backend-xxx.onrender.com
const inferRenderBackendUrl = () => {
    if (!isBrowser) return "";
    const hostname = window.location.hostname;

    // Render pattern: service-name-xyz.onrender.com (supports numbers and hyphens)
    const match = hostname.match(/^([a-zA-Z0-9-]+?)(?:-frontend)?(-[a-zA-Z0-9]+)?\.onrender\.com$/i);
    if (match) {
        const [, serviceName, uniqueId = ""] = match;
        // Try common backend naming patterns
        const possibleUrls = [
            `https://${serviceName}-backend${uniqueId}.onrender.com`,
            `https://${serviceName}-api${uniqueId}.onrender.com`,
            `https://${serviceName}-server${uniqueId}.onrender.com`,
            `https://${serviceName}${uniqueId}.onrender.com`,
        ];
        console.log("[env] Render environment detected. Possible backend URLs:", possibleUrls);
        // Return first pattern as best guess (user can override with env var)
        return possibleUrls[0];
    }
    return "";
};

// Determine the final server URL
let server;
if (runtimeUrl && runtimeUrl !== "undefined" && !runtimeUrl.startsWith("%")) {
    // Runtime injection is most reliable on Render
    server = runtimeUrl;
    console.log("[env] Using runtime backend URL:", server);
} else if (buildTimeUrl && buildTimeUrl !== "undefined" && buildTimeUrl !== "") {
    // Build-time env var (Netlify, Vercel, etc.)
    server = buildTimeUrl;
    console.log("[env] Using build-time backend URL:", server);
} else if (isRenderProduction) {
    // Try to infer backend URL from frontend hostname
    const inferredUrl = inferRenderBackendUrl();
    if (inferredUrl) {
        server = inferredUrl;
        console.log("[env] Using auto-inferred Render backend URL:", server);
    } else {
        console.warn("[env] Could not infer backend URL from hostname:", window.location.hostname);
        console.warn("[env] Please set REACT_APP_BACKEND_URL in Render environment variables!");
        // Critical: Don't leave server empty - fallback to a placeholder that will show clear errors
        server = "";
    }
} else {
    // Local development fallback
    server = "http://localhost:8000";
    console.log("[env] Using localhost development server:", server);
}

// Validate the URL format
try {
    if (server && server !== "") {
        new URL(server);
    }
} catch (e) {
    console.error("[env] Invalid backend URL format:", server);
    server = "http://localhost:8000";
}

// FINAL SAFETY CHECK: If server is empty, set a placeholder that will cause clear API errors
// instead of confusing "Cannot read property of undefined" errors
if (!server || server === "") {
    if (isRenderProduction) {
        console.error("[env] CRITICAL: No backend URL configured for Render deployment!");
        console.error("[env] Please set REACT_APP_BACKEND_URL environment variable in Render dashboard.");
        // Set a dummy URL so axios requests fail with clear network errors instead of malformed requests
        server = "https://backend-not-configured.onrender.com";
    } else {
        server = "http://localhost:8000";
    }
}

export default server;
