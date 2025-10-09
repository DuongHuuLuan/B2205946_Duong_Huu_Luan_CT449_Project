import { defineStore } from "pinia";
import SachService from "@/services/sach.service";

export const useBookStore = defineStore("bookStore", {
  state: () => ({
    books: [],
    loading: false,
  }),

  actions: {
    async fetchAvailableBooks() {
      this.loading = true;
      try {
        const data = await SachService.getAllAvailable();
        console.log("Dữ liệu sách từ API:", data);
        this.books = data || [];
      } catch (error) {
        console.error("Lỗi tải sách:", error);
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
