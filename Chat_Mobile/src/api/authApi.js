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

export async function signUp(formData) {
    console.log("formData");
    console.log(formData._parts);
    try {
        const response = await instance.post(chatApi.signUp(), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Data:", error.response.data); // << cái này sẽ cho biết lý do 400
          } else {
            console.log("Other error:", error.message);
          }
          throw error;
    }
}

// export const verifyOtp= async (idToken) => {
//     const response = await instance.post("/api/v1/auth/verify-otp", { idToken });
//     return response.data;
// };

export async function sendOtp(phone) {
    try {
        const response = await instance.post(chatApi.sendOtp(), { phoneNumber: phone });
        return response.data
    } catch (error) {
        console.log("Error in sendOtp API:", error);
    }
}

export const verifyOtp= async (phoneNumber, otp) => {
    const response = await instance.post(chatApi.verifyOtp(), { phoneNumber, otp });
    return response.data;
};