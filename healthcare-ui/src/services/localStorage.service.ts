import { ACCESS_TOKEN, USER_ID, USER_NAME } from "../models/constants.ts"

export default class LocalStorageService {

static getAccessToken(){
 return localStorage.getItem(ACCESS_TOKEN);
}
static saveAccessToken(token:string){
    localStorage.setItem(ACCESS_TOKEN,token)
}

static getUserName(){
    return localStorage.getItem(USER_NAME);
   }
   static saveUserName(name:string){
       localStorage.setItem(USER_NAME,name)
   }

static getUserID(){
return localStorage.getItem(USER_ID);
}
static saveUserID(id:string){
    localStorage.setItem(USER_ID,id)
}
static clear(){
    localStorage.clear()
}

}