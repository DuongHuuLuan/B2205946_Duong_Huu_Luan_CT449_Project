<template>
    <div class="book-list">
        <SearchBar @search="onSearch" />

        <EmptyState v-if="!bookStore.loading && filteredBooks.length === 0" text="Không có sách khả dụng" />

        <BookTable v-else :books="filteredBooks" @view="viewDetail" @borrow="borrowBook" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBookStore } from "@/stores/bookStore";
import SearchBar from "@/components/readers/SearchBar.vue";
import EmptyState from "@/components/common/EmptyState.vue";

import BookTable from "@/components/readers/BookTable.vue";

const bookStore = useBookStore();
const router = useRouter();
const search = ref("");

onMounted(() => bookStore.fetchAvailableBooks());

const filteredBooks = computed(() =>
    bookStore.books.filter((b) =>
        (b.TenSach || "").toLowerCase().includes(search.value.toLowerCase())
    )
);

function onSearch(value) {
    search.value = value;
}

function viewDetail(book) {
    router.push(`/reader/books/${book._id}`);
}

/**
 * Hàm xử lý khi người dùng nhấn nút Mượn Sách.
 * Điều hướng đến trang xác nhận mượn (checkout).
 * @param {Object} book - Đối tượng sách được chọn.
 */
function borrowBook(book) {
    router.push({
        name: 'reader.checkout-book',
        params: { id: book._id }
    });
}
</script>