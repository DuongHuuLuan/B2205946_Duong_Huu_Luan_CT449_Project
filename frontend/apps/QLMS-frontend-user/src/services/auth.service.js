// import createApiClient from "./api.service";

// const API_BASE_URL = "http://localhost:3000/api/docgia/auth";
// class AuthService {
//   constructor() {
//     this.api = createApiClient(API_BASE_URL); // OK
//   }

//   async login(data) {
//     return (await this.api.post("/login", data)).data;
//   }

//   async register(data) {
//     return (await this.api.post("/register", data)).data;
//   }

//   logout() {
//     localStorage.removeItem("docgiaToken");
//     localStorage.removeItem("docgiaUser");
//   }

//   getToken() {
//     return localStorage.getItem("docgiaToken");
//   }

//   isLoggedIn() {
//     return !!this.getToken();
//   }
// }

// export default new AuthService();

// src/services/auth.service.js

import api, { publicApi } from "./api.service";

const API_AUTH_PATH = "/docgia/auth";

class AuthService {
  async login(data) {
    // Dùng publicApi và nối đường dẫn Auth
    return (await publicApi.post(`${API_AUTH_PATH}/login`, data)).data;
  }

  async register(data) {
    // Dùng publicApi và nối đường dẫn Auth
    return (await publicApi.post(`${API_AUTH_PATH}/register`, data)).data;
  }

  logout() {
    localStorage.removeItem("docgiaToken");
    localStorage.removeItem("docgiaUser");
  }

  getToken() {
    return localStorage.getItem("docgiaToken");
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}

export default new AuthService();
