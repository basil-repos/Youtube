import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://mytubevapp.herokuapp.com/api/",
    //baseURL: "http://localhost:8800/api/",
    withCredentials: true
});