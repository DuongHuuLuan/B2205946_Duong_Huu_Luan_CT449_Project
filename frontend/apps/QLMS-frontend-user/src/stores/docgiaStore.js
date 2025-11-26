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

  if (res.data && typeof res.data === "object") {
    return res.data;
  }

  if (res.updated) return res.updated;
  if (res.profile) return res.profile;
  if (res.user) return res.user;
  if (res.payload) return res.payload;
  if (res.result) return res.result;

  if (typeof res === "object") return res;

  return res;
}

function normalizeStats(raw = {}) {
  if (!raw || typeof raw !== "object")
    return { currentBorrowed: 0, totalBorrowed: 0, overdueCount: 0 };

  const pickNumber = (...keys) => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null) {
        const n = Number(raw[k]);
        if (Number.isFinite(n)) return n;
      }
    }
    return 0;
  };

  const currentBorrowed = pickNumber(
    "currentBorrowed",
    "dangMuon",
    "dang_muon",
    "dangMuonCount",
    "dangMuonQty"
  );
  const totalBorrowed = pickNumber(
    "totalBorrowed",
    "tongMuon",
    "tong_sach_da_muon",
    "total",
    "tongSach"
  );
  const overdueCount = pickNumber(
    "overdueCount",
    "quaHan",
    "qua_han",
    "treHan",
    "treHanCount",
    "overdue"
  );

  return { currentBorrowed, totalBorrowed, overdueCount };
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
      this.profile = user ? { ...user } : null;
      if (user) {
        try {
          localStorage.setItem(DOCGIA_USER_KEY, JSON.stringify(this.profile));
        } catch (e) {
          console.warn("Failed to persist profile to localStorage", e);
        }
      } else {
        localStorage.removeItem(DOCGIA_USER_KEY);
      }
    },

    _normalizeProfilePayload(payload) {
      const p = { ...payload };
      if (p.NgaySinh && typeof p.NgaySinh === "string") {
        const d = new Date(p.NgaySinh);
        if (!isNaN(d.getTime())) p.NgaySinh = d;
      }

      delete p.Password;
      delete p.MaDocGia;
      return p;
    },

    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        const res = await DocGiaService.getProfile();
        const maybe = res ?? {};
        const profile = maybe.profile ?? maybe.user ?? maybe;
        if (profile) {
          this.setProfile(profile);
        }
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

        const res = await DocGiaService.updateProfile(body); // 1. TRÍCH XUẤT DỮ LIỆU JSON

        const data = res.data; // 2. TÌM KIẾM OBJECT PROFILE ĐÃ CẬP NHẬT TRONG PHẢN HỒI (data)

        const maybe = data ?? {};
        const updatedProfile = // Sử dụng tên biến rõ ràng hơn
          maybe.profile ?? maybe.updated ?? maybe.user ?? maybe.value ?? maybe; // 3. CẬP NHẬT STATE VÀ TRẢ VỀ

        if (updatedProfile && typeof updatedProfile === "object") {
          // DÒNG QUAN TRỌNG NHẤT: Cập nhật state Pinia ngay lập tức
          this.setProfile(updatedProfile);

          // Trả về toàn bộ data (bao gồm message và profile)
          return data;
        }

        console.warn(
          "Update profile successful but missing profile object, fetching again..."
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
        // Giả sử DocGiaService.uploadAvatar gọi PUT /profile/update
        const res = await DocGiaService.uploadAvatar(fd);
        const maybe = unwrap(res);
        const updatedProfile =
          maybe?.data ?? maybe?.profile ?? maybe?.user ?? maybe; // 🚨 NẾU BACKEND TRẢ VỀ TOÀN BỘ PROFILE ĐÃ CẬP NHẬT

        if (
          updatedProfile &&
          (updatedProfile?.Avatar || updatedProfile?.avatar)
        ) {
          // Lấy đường dẫn avatar mới
          const avatar = updatedProfile.Avatar || updatedProfile.avatar;
          // Cập nhật Profile trong Store, sử dụng tên trường 'Avatar'
          this.setProfile({ ...(this.profile || {}), Avatar: avatar });
          return avatar;
        } // Logic dự phòng: Nếu không lấy được URL mới, gọi fetchProfile để cập nhật lại

        await this.fetchProfile();
        return this.profile?.Avatar ?? null;
      } catch (err) {
        this.error =
          err?.response?.data?.message ?? err?.message ?? "Upload ảnh thất bại";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        const res = await DocGiaService.getBorrowStats();
        const maybe = unwrap(res) ?? {};
        const normalized = normalizeStats(maybe);
        this.stats = normalized;
        return this.stats;
      } catch (err) {
        this.stats = null;
        this.error = err?.response?.data?.message ?? err?.message ?? null;
        return null;
      } finally {
        this.loading = false;
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
