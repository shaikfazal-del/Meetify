import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";

export const AuthContext = createContext({});

// Create the axios client lazily so it always picks up the latest server URL
// This is important on Render where window.__BACKEND_URL__ is set at runtime
const getClient = () => axios.create({
    baseURL: `${server}/api/v1/users`,
    timeout: 15000,
    headers: { "Content-Type": "application/json" }
});

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);
    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            const client = getClient();
            const request = await client.post("/register", { name, username, password });

            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            if (!err.response) {
                // Network/CORS error — backend unreachable
                const networkErr = new Error();
                networkErr.response = {
                    data: {
                        message: `Cannot reach the server. Please check your connection or try again later. (URL: ${server})`
                    }
                };
                throw networkErr;
            }
            throw err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const client = getClient();
            const request = await client.post("/login", { username, password });

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                router("/home");
            }
        } catch (err) {
            if (!err.response) {
                // Network/CORS error — backend unreachable
                const networkErr = new Error();
                networkErr.response = {
                    data: {
                        message: `Cannot reach the server. Please check your connection or try again later. (URL: ${server})`
                    }
                };
                throw networkErr;
            }
            throw err;
        }
    };

    const getHistoryOfUser = async () => {
        try {
            const client = getClient();
            const request = await client.get("/get_all_activity", {
                params: { token: localStorage.getItem("token") }
            });
            return request.data;
        } catch (err) {
            throw err;
        }
    };

    const addToUserHistory = async (meetingCode) => {
        try {
            const client = getClient();
            const request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request;
        } catch (err) {
            throw err;
        }
    };

    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};
