import { defineStore } from "pinia";
import AuthService from "@/services/auth.service";
import { useDocGiaStore } from "@/stores/docgiaStore";
import router from "@/router";

const DOCGIA_TOKEN_KEY = "docgiaToken";
const DOCGIA_USER_KEY = "docgiaUser";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem(DOCGIA_USER_KEY)) || null,
    token: localStorage.getItem(DOCGIA_TOKEN_KEY) || null,
    isLoggedIn: !!localStorage.getItem(DOCGIA_TOKEN_KEY),
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    setToken(token) {
      this.token = token;
      this.isLoggedIn = !!token;
      if (token) {
        localStorage.setItem(DOCGIA_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(DOCGIA_TOKEN_KEY);
      }
    },

    async login(credentials) {
      const docgiaStore = useDocGiaStore();
      try {
        const response = await AuthService.login(credentials);

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

        docgiaStore.setToken(token);
        this.setToken(token);

        try {
          await docgiaStore.fetchProfile();
          this.user = docgiaStore.profile;
        } catch (fetchErr) {
          if (maybeUser && typeof maybeUser === "object") {
            docgiaStore.setProfile(maybeUser);
            this.user = maybeUser;
          } else {
            this.logout();
            throw fetchErr;
          }
        }

        router.push({ name: "home" });
        return true;
      } catch (err) {
        this.logout();
        throw err;
      }
    },

    logout() {
      this.user = null;
      this.setToken(null);
      try {
        const docgiaStore = useDocGiaStore();
        docgiaStore.clear();
      } catch (e) {}

      try {
        localStorage.removeItem(DOCGIA_TOKEN_KEY);
        localStorage.removeItem(DOCGIA_USER_KEY);
      } catch (e) {}

      router.push({ name: "login" });
    },
  },
});
