import axios from "axios";
import { CURRENT_URL, headerConfig } from "./config";
import { URLS } from "./urls";


export const getAllStundet = async () => {
    try {
        const url = CURRENT_URL + URLS.GET_STUDENT_LIST;
        const response = await axios.get(url, {
            headers: headerConfig()
        });
        return response.data;
    } catch (error) {
        return new Error(error);
    }
}
