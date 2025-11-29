<template>
    <div class="all-books-page">
        <div class="container">
            <h1 class="page-title">
                {{ searchKeyword ? `Kết quả tìm kiếm: "${searchKeyword}"` : "Tất Cả Sách Trong Thư Viện" }}
            </h1>

            <div class="books-list" v-if="bookStore.books.length">
                <BookCardHorizontal v-for="book in bookStore.books" :key="book._id" :book="book"
                    @click="goToDetail(book)" />
            </div>

            <div v-else class="empty">
                <p v-if="bookStore.loading">Đang tải sách...</p>
                <p v-else-if="searchKeyword">Không tìm thấy sách nào phù hợp với "{{ searchKeyword }}"</p>
                <p v-else>Chưa có sách nào trong thư viện.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBookStore } from "@/stores/bookStore";
import BookCardHorizontal from "@/components/readers/BookCardHorizontal.vue";

const router = useRouter();
const route = useRoute();
const bookStore = useBookStore();

const searchKeyword = ref("");

async function performSearch() {
    const q = searchKeyword.value.trim();
    if (q) {
        await bookStore.searchBooks(q);
    } else {
        await bookStore.fetchAvailableBooks();
    }
}

onMounted(async () => {
    searchKeyword.value = (route.query.q || "").toString();
    await performSearch();
    console.log("Kết quả từ backend:", bookStore.books);
});

watch(
    () => route.query.q,
    async (newQuery) => {
        searchKeyword.value = (newQuery || "").toString();
        await performSearch();
    }
);

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
    font-size: 1.4rem;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1.5rem;
}
</style>