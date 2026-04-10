import { Server } from "socket.io"


let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const rawOrigin = process.env.CLIENT_URL
        ? process.env.CLIENT_URL.replace(/[^\x20-\x7E]/g, "").trim()
        : "";
    const allowedOrigin = rawOrigin.length > 0 ? rawOrigin : ["http://localhost:3000", "http://localhost:5173"];

    // Function to check if origin is allowed
    const isOriginAllowed = (origin) => {
        if (!origin) return true; // Allow no-origin (mobile, curl, etc)
        if (typeof allowedOrigin === 'string') {
            return origin === allowedOrigin || origin.startsWith(allowedOrigin);
        }
        if (Array.isArray(allowedOrigin)) {
            return allowedOrigin.some(a => origin === a || origin.startsWith(a));
        }
        return true;
    };

    const io = new Server(server, {
        cors: {
            origin: function(origin, callback) {
                if (isOriginAllowed(origin) || /\.onrender\.com$/.test(origin)) {
                    callback(null, true);
                } else {
                    console.warn(`Socket.io CORS blocked origin: ${origin}`);
                    callback(null, false);
                }
            },
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
            credentials: true
        },
        transports: ["websocket", "polling"],
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 20000
    });


    io.on("connection", (socket) => {
        console.log(`[Socket] New connection: ${socket.id} from ${socket.handshake.address}`);

        socket.on("join-call", (path) => {
            const roomId = path || "/";
            console.log(`[Socket] ${socket.id} joining room: ${roomId}`);

            if (connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            console.log(`[Socket] Room ${roomId} now has ${connections[path].length} participants:`, connections[path]);

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
            }
        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }
        })

        socket.on("whiteboard-data", (data) => {
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found === true) {
                connections[matchingRoom].forEach((elem) => {
                    if (elem !== socket.id) {
                        io.to(elem).emit("whiteboard-data", data);
                    }
                });
            }
        })

        socket.on("whiteboard-clear", () => {
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [room, isFound];
                }, ['', false]);

            if (found === true) {
                connections[matchingRoom].forEach((elem) => {
                    if (elem !== socket.id) {
                        io.to(elem).emit("whiteboard-clear");
                    }
                });
            }
        })

        socket.on("disconnect", (reason) => {
            console.log(`[Socket] Disconnected: ${socket.id}, reason: ${reason}`);
            for (const [roomPath, participants] of Object.entries(connections)) {
                const index = participants.indexOf(socket.id);
                if (index !== -1) {
                    participants.splice(index, 1);
                    participants.forEach(pId => io.to(pId).emit('user-left', socket.id));
                    if (participants.length === 0) {
                        console.log(`[Socket] Room ${roomPath} is now empty, cleaning up`);
                        delete connections[roomPath];
                    }
                    break;
                }
            }
            delete timeOnline[socket.id];
        })


    })


    return io;
}

