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
  if (!res) return null;
  if (res.data && typeof res.data === "object") return res.data;
  if (res.updated) return res.updated;
  if (res.profile) return res.profile;
  if (res.user) return res.user;
  if (res.payload) return res.payload;
  if (res.result) return res.result;
  if (typeof res === "object") return res;
  return res;
}

function normalizeAvatarPath(path) {
  if (!path) return null;

  let normalized = path.replace(/\\/g, "/").trim();

  normalized = normalized.replace(/\/+/g, "/");

  if (!normalized.toLowerCase().startsWith("/uploads/")) {
    if (normalized.toLowerCase().startsWith("uploads/")) {
      normalized = "/" + normalized;
    } else {
      normalized = "/uploads/" + normalized.replace(/^\/+/, "");
    }
  }

  return normalized;
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
    avatarUrl: (state) => normalizeAvatarPath(state.profile?.Avatar),
  },

  actions: {
    init() {
      this.profile = safeParse(localStorage.getItem(DOCGIA_USER_KEY)) || null;
      this.token = localStorage.getItem(DOCGIA_TOKEN_KEY) || null;
    },

    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem(DOCGIA_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(DOCGIA_TOKEN_KEY);
      }
    },

    setProfile(user) {
      if (!user) {
        this.profile = null;
        localStorage.removeItem(DOCGIA_USER_KEY);
        return;
      }

      const normalized = {
        ...user,
        Avatar: normalizeAvatarPath(user.Avatar || user.avatar),
      };

      this.profile = normalized;
      try {
        localStorage.setItem(DOCGIA_USER_KEY, JSON.stringify(this.profile));
      } catch (e) {
        console.warn("Failed to persist profile to localStorage", e);
      }
    },

    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        const res = await DocGiaService.getProfile();
        const profile = unwrap(res) ?? res;
        if (profile) this.setProfile(profile);
        return this.profile;
      } catch (err) {
        this.error =
          err?.response?.data?.message ?? err?.message ?? "Lỗi khi lấy profile";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(payload) {
      this.loading = true;
      this.error = null;
      try {
        const body = { ...payload };
        delete body.MaDocGia;

        const res = await DocGiaService.updateProfile(body);
        const data = res?.data ?? res;
        const updatedProfile =
          data?.profile ?? data?.updated ?? data?.user ?? data;

        if (updatedProfile) {
          this.setProfile(updatedProfile);
          return data;
        }

        console.warn(
          "Update thành công nhưng không có profile trả về → fetch lại"
        );
        await this.fetchProfile();
        return data;
      } catch (err) {
        this.error =
          err?.response?.data?.message ?? err?.message ?? "Cập nhật thất bại";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async uploadAvatar(file) {
      if (!file) throw new Error("No file provided");

      const fd = new FormData();
      fd.append("Avatar", file);

      this.loading = true;
      this.error = null;

      try {
        const res = await DocGiaService.uploadAvatar(fd);
        const result = unwrap(res);

        let newAvatarPath =
          result?.Avatar ?? result?.avatar ?? result?.data?.Avatar;

        if (!newAvatarPath) {
          console.warn("Backend không trả về Avatar → fetch lại profile");
          await this.fetchProfile();
          return this.avatarUrl;
        }

        newAvatarPath = normalizeAvatarPath(newAvatarPath);

        this.setProfile({
          ...(this.profile || {}),
          Avatar: newAvatarPath,
        });

        return newAvatarPath;
      } catch (err) {
        this.error =
          err?.response?.data?.message ?? err?.message ?? "Upload ảnh thất bại";
        await this.fetchProfile();
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      this.loading = true;
      try {
        const res = await DocGiaService.getBorrowStats();
        const data = unwrap(res) ?? {};
        this.stats = normalizeStats(data);
        return this.stats;
      } catch (err) {
        this.stats = null;
        this.error = err?.response?.data?.message ?? err?.message ?? null;
        return null;
      } finally {
        this.loading = false;
      }
    },

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
