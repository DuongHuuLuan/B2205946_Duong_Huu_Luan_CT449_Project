// src/stores/authStore.js
import { defineStore } from "pinia";
import AuthService from "@/services/auth.service";
import { useDocGiaStore } from "@/stores/docgiaStore";
import router from "@/router";

const DOCGIA_TOKEN_KEY = "docgiaToken";
const DOCGIA_USER_KEY = "docgiaUser";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // giữ user ở auth store chỉ như một tham chiếu/backup; chính source nên là docgiaStore.profile
    user: JSON.parse(localStorage.getItem(DOCGIA_USER_KEY)) || null,
    token: localStorage.getItem(DOCGIA_TOKEN_KEY) || null,
    isLoggedIn: !!localStorage.getItem(DOCGIA_TOKEN_KEY),
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    // helper để set token local (nếu cần dùng trực tiếp)
    setToken(token) {
      this.token = token;
      this.isLoggedIn = !!token;
      if (token) {
        localStorage.setItem(DOCGIA_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(DOCGIA_TOKEN_KEY);
      }
    },

    // login: set token vào docgiaStore và fetch profile => đảm bảo UI cập nhật ngay
    async login(credentials) {
      const docgiaStore = useDocGiaStore();
      try {
        const response = await AuthService.login(credentials);

        // backend có thể trả { token, user } hoặc { data: { token, user } } hoặc res.data...
        const token =
          response?.token ??
          response?.accessToken ??
          response?.data?.token ??
          response?.data?.accessToken;
        const maybeUser =
          response?.user ?? response?.data?.user ?? response?.data ?? null;

        if (!token) {
          throw new Error("Server không trả token");
        }

        // 1) set token vào docgiaStore (lưu localStorage trong setToken)
        docgiaStore.setToken(token);
        this.setToken(token); // keep authStore.token in sync (optional)

        // 2) cố fetch profile từ server (server sẽ sử dụng token mới)
        try {
          await docgiaStore.fetchProfile();
          // đồng bộ authStore.user nếu bạn muốn giữ user ở authStore
          this.user = docgiaStore.profile;
        } catch (fetchErr) {
          // nếu fetch thất bại nhưng response có user thì dùng user đó
          if (maybeUser && typeof maybeUser === "object") {
            docgiaStore.setProfile(maybeUser);
            this.user = maybeUser;
          } else {
            // fallback: clear state và ném lỗi
            this.logout();
            throw fetchErr;
          }
        }

        // 3) redirect (hoặc bạn có thể redirect trong component)
        router.push({ name: "home" });
        return true;
      } catch (err) {
        // đảm bảo trạng thái sạch
        this.logout();
        throw err;
      }
    },

    logout() {
      // clear auth store
      this.user = null;
      this.setToken(null);
      // clear docgia store
      try {
        const docgiaStore = useDocGiaStore();
        docgiaStore.clear();
      } catch (e) {
        // ignore
      }

      // clear any localStorage keys just in case
      try {
        localStorage.removeItem(DOCGIA_TOKEN_KEY);
        localStorage.removeItem(DOCGIA_USER_KEY);
      } catch (e) {}

      router.push({ name: "login" });
    },
  },
});
