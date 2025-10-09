// src/stores/bookStore.js

import { defineStore } from "pinia";
import SachService from "@/services/sach.service";

export const useBookStore = defineStore("bookStore", {
  state: () => ({
    books: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAvailableBooks() {
      this.loading = true;
      this.error = null; // Reset lỗi
      try {
        const data = await SachService.getAllAvailable();
        console.log("Dữ liệu sách từ API:", data);
        this.books = data || [];
      } catch (error) {
        console.error("Lỗi tải sách:", error);
        // Lưu thông báo lỗi
        this.error = "Không thể tải danh sách sách. Vui lòng thử lại.";
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
