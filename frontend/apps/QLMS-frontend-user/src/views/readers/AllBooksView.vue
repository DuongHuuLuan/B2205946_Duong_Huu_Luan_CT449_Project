<template>
    <div class="all-books-page">
        <div class="container">
            <h1 class="page-title">Tất Cả Sách Trong Thư Viện</h1>

            <div class="books-list">
                <BookCardHorizontal v-for="book in bookStore.books" :key="book._id" :book="book"
                    @click="goToDetail(book)" />
            </div>

            <div v-if="!bookStore.books.length" class="empty">
                <p>Đang tải danh sách sách...</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBookStore } from "@/stores/bookStore";
import BookCardHorizontal from "@/components/readers/BookCardHorizontal.vue";

const router = useRouter();
const bookStore = useBookStore();

onMounted(async () => {
    if (!bookStore.books.length) {
        await bookStore.fetchAvailableBooks();
    }
});

function goToDetail(book) {
    router.push(`/reader/books/${book._id}`);
}
</script>

<style scoped>
.all-books-page {
    background: #f5f0e6;
    min-height: 100vh;
    padding: 4rem 0;
}

.page-title {
    text-align: center;
    font-size: 2.6rem;
    font-weight: 900;
    color: #1e1b15;
    margin-bottom: 3rem;
}

.books-list {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.empty {
    text-align: center;
    padding: 5rem;
    color: #64748b;
    font-size: 1.2rem;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1.5rem;
}
</style>