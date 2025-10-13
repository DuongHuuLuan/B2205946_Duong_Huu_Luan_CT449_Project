// src/stores/docgiaStore.js
import { defineStore } from "pinia";
import DocGiaService from "@/services/docgia.service";

const DOCGIA_USER_KEY = "docgiaUser";
const DOCGIA_TOKEN_KEY = "docgiaToken";

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

function unwrap(res) {
  if (res == null) return null;
  // nếu createApiClient đã unwrap resp.data thì res là payload trực tiếp
  if (res.data && typeof res.data === "object") return res.data;
  if (res.updated) return res.updated;
  return res;
}

export const useDocGiaStore = defineStore("docgia", {
  state: () => ({
    profile: safeParse(localStorage.getItem(DOCGIA_USER_KEY)) || null,
    token: localStorage.getItem(DOCGIA_TOKEN_KEY) || null,
    stats: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    displayName: (state) =>
      state.profile
        ? `${state.profile.HoLot ?? ""} ${state.profile.Ten ?? ""}`.trim() ||
          "—"
        : "—",
    initials: (state) => {
      if (!state.profile) return "DG";
      const ten = state.profile.Ten || "";
      const holot = state.profile.HoLot || "";
      return (ten[0] || holot[0] || "D").toUpperCase();
    },
  },

  actions: {
    // restore from localStorage on app start
    init() {
      this.profile = safeParse(localStorage.getItem(DOCGIA_USER_KEY)) || null;
      this.token = localStorage.getItem(DOCGIA_TOKEN_KEY) || null;
    },

    // set token vào store và localStorage
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem(DOCGIA_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(DOCGIA_TOKEN_KEY);
      }
    },

    // set profile (thay object để kích hoạt reactivity)
    setProfile(user) {
      this.profile = user ? { ...user } : null;
      if (user) {
        localStorage.setItem(DOCGIA_USER_KEY, JSON.stringify(this.profile));
      } else {
        localStorage.removeItem(DOCGIA_USER_KEY);
      }
    },

    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        const res = await DocGiaService.getProfile();
        const maybe = unwrap(res);
        const user = maybe?.user ?? maybe;
        this.setProfile(user);
        return user;
      } catch (err) {
        // chuẩn hóa lỗi dạng chuỗi
        this.error = err?.message ?? "Lỗi khi lấy profile";
        // nếu cần: nếu unauthorized thì clear()
        // if (err?.status === 401) this.clear();
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await DocGiaService.updateProfile(payload);
        const maybe = unwrap(res);
        const updated = maybe?.updated ?? maybe?.user ?? maybe;

        if (!updated || !updated.MaDocGia) {
          // fallback: refresh từ server
          await this.fetchProfile();
          return this.profile;
        }

        this.setProfile(updated);
        return this.profile;
      } catch (err) {
        this.error = err?.message ?? "Cập nhật thất bại";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async uploadAvatar(file) {
      if (!file) throw new Error("No file provided");
      const fd = new FormData();
      fd.append("avatar", file);
      this.loading = true;
      this.error = null;
      try {
        const res = await DocGiaService.uploadAvatar(fd);
        const maybe = unwrap(res);
        const avatarUrl =
          maybe?.avatarUrl ?? maybe?.url ?? maybe?.data?.avatarUrl ?? maybe;

        if (avatarUrl) {
          // update profile an toàn
          this.setProfile({ ...(this.profile || {}), avatar: avatarUrl });
          return avatarUrl;
        }

        // nếu server không trả url, refetch profile
        await this.fetchProfile();
        return this.profile?.avatar ?? null;
      } catch (err) {
        this.error = err?.message ?? "Upload ảnh thất bại";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      try {
        const res = await DocGiaService.getBorrowStats();
        this.stats = unwrap(res) ?? res ?? null;
        return this.stats;
      } catch (err) {
        this.stats = null;
        return null;
      }
    },

    // xóa mọi thứ
    clear() {
      this.profile = null;
      this.token = null;
      this.stats = null;
      this.loading = false;
      this.error = null;
      localStorage.removeItem(DOCGIA_USER_KEY);
      localStorage.removeItem(DOCGIA_TOKEN_KEY);
    },
  },
});
