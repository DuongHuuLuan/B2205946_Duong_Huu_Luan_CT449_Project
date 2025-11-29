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
      this.error = null;
      try {
        const data = await SachService.getAllAvailable();
        console.log("Dữ liệu tất cả sách:", data);
        this.books = Array.isArray(data)
          ? data
          : data?.books || data?.data || [];
      } catch (error) {
        console.error("Lỗi tải sách:", error);
        this.error = "Không thể tải danh sách sách. Vui lòng thử lại.";
        this.books = [];
      } finally {
        this.loading = false;
      }
    },

    async searchBooks(keyword) {
      if (!keyword || keyword.trim() === "") {
        return await this.fetchAvailableBooks();
      }

      this.loading = true;
      this.error = null;
      try {
        const data = await SachService.search(keyword.trim());
        console.log("Kết quả tìm kiếm:", data);

        this.books = Array.isArray(data)
          ? data
          : data?.books || data?.data || data?.results || [];
      } catch (error) {
        console.error("Lỗi tìm kiếm sách:", error);
        this.error = "Không tìm thấy sách nào phù hợp.";
        this.books = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
