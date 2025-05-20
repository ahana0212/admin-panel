import axios from "axios";
import { CURRENT_URL, headerConfig } from "./config";
import { URLS } from "./urls";


export const getALLTables = async () => {
    try {
        const url = CURRENT_URL + URLS.GET_TABLE_DATA;
        const response = await axios.get(url, {
            headers: headerConfig()
        });
        return response.data;
    } catch (error) {
        return new Error(error);
    }
}


export const getTableDetails = async (payload) => {
    try {
        const url = CURRENT_URL + URLS.GET_TABLE_DETAILS;
        const response = await axios.post(url, payload, {
            headers: headerConfig()
        });
        return response.data;
    } catch (error) {
        return new Error(error);
    }
}