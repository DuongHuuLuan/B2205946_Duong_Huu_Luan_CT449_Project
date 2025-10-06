import { defineStore } from "pinia";
import AuthService from "@/services/auth.service";
import router from "@/router";

const DOCGIA_TOKEN_KEY = "docgiaToken";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // lưu thông tin Độc giả
    user: JSON.parse(localStorage.getItem("docgiaUser")),
    token: localStorage.getItem(DOCGIA_TOKEN_KEY),
    isLoggedIn: !!localStorage.getItem(DOCGIA_TOKEN_KEY),
  }),

  getters: {
    // getter để kiểm tra trạng thái đăng nhập
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    async login(credentials) {
      try {
        // gọi auth service
        const response = await AuthService.login(credentials);

        //
        const { user, token } = response;

        // cập nhật state
        this.user = user;
        this.token = token;
        this.isLoggedIn = true;

        // luuw vào LocalStorage với khóa riêng
        localStorage.setItem(DOCGIA_TOKEN_KEY, token);
        localStorage.setItem("docgiaUser", JSON.stringify(user));

        router.push({ name: "home" });

        return true;
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    logout() {
      // xóa state
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;

      // xóa LocalStorage
      localStorage.removeItem(DOCGIA_TOKEN_KEY);
      localStorage.removeItem("docgiaUser");

      router.push({ name: "login" });
    },
  },
});
