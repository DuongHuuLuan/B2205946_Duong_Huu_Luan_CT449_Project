<template>
    <div class="book-list">
        <SearchBar @search="onSearch" />
        <LoadingSpinner v-if="bookStore.loading" />
        <EmptyState v-else-if="filteredBooks.length === 0" text="Không có sách khả dụng" />
        <BookCard v-for="b in filteredBooks" :key="b._id" :book="b" @view="viewDetail" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBookStore } from "@/stores/bookStore";
import SearchBar from "@/components/readers/SearchBar.vue";
import BookCard from "@/components/readers/BookCard.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

const bookStore = useBookStore();
const router = useRouter();
const search = ref("");

onMounted(() => bookStore.fetchAvailableBooks());

const filteredBooks = computed(() =>
    bookStore.books.filter((b) =>
        b.TenSach.toLowerCase().includes(search.value.toLowerCase())
    )
);

function onSearch(value) {
    search.value = value;
}

function viewDetail(book) {
    router.push(`/reader/books/${book._id}`);
}
</script>
