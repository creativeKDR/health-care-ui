import axios from "axios"
import { GENERIC_HTTP_ERROR_MESSAGE,ACCESS_TOKEN } from "../models/constants.ts"
import LocalStorageService from "./localStorage.service.ts";

// LocalStorageService

// Add a request interceptor
const BASE_URL='http://localhost:5000';

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use(
    config => {
      const token = LocalStorageService.getAccessToken()
      if (token) {
        config.headers['Authorization'] =  'Bearer '+ token
      }
      return config
    },
    error => {
      Promise.reject(error)
    }
  )

const ERROR_MSG ={"status":false,"message":GENERIC_HTTP_ERROR_MESSAGE}
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if(error.message){
        return Promise.reject(error);
    }else {
      error.message = ERROR_MSG;
      return Promise.reject(error)
    }
});

export default class HttpService {

    static post(body: any, url: string) {
        return axiosInstance.post(BASE_URL+url, body, { headers: { "Content-Type": "application/json", }, responseType: 'json' })
    }
    static get(url: any) {
       return axiosInstance.get(BASE_URL+url, {headers: {
        'Accept': '*/*',
      }})
    }
    static patch(body: any, url: string) {
      return axiosInstance.put(BASE_URL+url, body, { headers: { "Content-Type": "application/json", }, responseType: 'json' })
  }
}
