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
        return response.data
    } catch (error) {
        console.log("Error in signUp API:", error);
    }
}