import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // Install with `npm install jwt-decode`

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // Your API base URL
});

// Add an interceptor to refresh the token
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken) {
            // No access token, redirect to login
            window.location.href = "/";
            return Promise.reject(new Error("No access token")); // Reject for clarity
        }

        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        const expire = currentTime - decodedToken.exp;
        console.log("expires: ", expire);
        console.log(`decoded Token: ${decodedToken.exp}`);
        console.log(`current Time: ${currentTime}`);
        // If the access token is near expiration (e.g., 5 minutes before expiry), refresh it
        if (expire >= 0) { // Adjust threshold as needed
            try {
                const response = await axios.post(
                        "http://localhost:3000/admin/refresh-token",
                        { token: refreshToken }
                    );
                    console.log("REFRESH TOKEN RESPONSE", response.data);
                    const { accessToken: newAccessToken } = response.data;
                    localStorage.setItem("accessToken", newAccessToken);

                    // Update request headers with the new access token
                    config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                } catch (error) {
                    console.error("Token refresh failed:", error);
                    localStorage.clear(); // Clear tokens on refresh failure
                    window.location.href = "/"; // Redirect to login
                }
         } else {
                // Token is still valid (or near expiration but not refreshed)
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;