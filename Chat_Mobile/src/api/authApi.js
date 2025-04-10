import { chatApi } from "./index";
import instance from "./axios";

export async function login(phone, password) {
    try {
        const response = await instance.post(chatApi.login(), {phone: phone, password: password});
        if (response.status !== 200) {
            throw new Error("Login failed");
        }
        return response.data
    } catch (error) {
        console.log("Error in login API:", error);
    }
}

export async function signUp(params) {
    try {
        const response = await instance.post(chatApi.signUp(), params);
        return response.data;
    } catch (error) {
        console.log("Error in signUp API:", error);
    }
}

// export const verifyOtp= async (idToken) => {
//     const response = await instance.post("/api/v1/auth/verify-otp", { idToken });
//     return response.data;
// };

export async function sendOtp(phone) {
    try {
        const response = await instance.post('/api/v1/auth/send-otp', { phoneNumber: phone });
        return response.data
    } catch (error) {
        console.log("Error in sendOtp API:", error);
    }
}

export const verifyOtp= async (phoneNumber, otp) => {
    const response = await instance.post("/api/v1/auth/verify-otp-sns", { phoneNumber, otp });
    return response.data;
};