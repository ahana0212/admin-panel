import axios from "axios";
import { CURRENT_URL } from "./config";
import { URLS } from "./urls";


export const genrateOTPforLogin = async (payload) => {
    try {
        const url = CURRENT_URL + URLS.GENRATE_OTP_FOR_LOGIN;
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        return new Error(error);
    }
}


export const validateOTPforUsers = async (payload) => {
    try {
        const url = CURRENT_URL + URLS.VALIDATE_OTP;
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        return new Error(error);
    }
}
