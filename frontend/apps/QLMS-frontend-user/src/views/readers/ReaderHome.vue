<template>
    <div class="home-page">
        <section class="hero">
            <div class="container">
                <h1 class="hero-title">Khám Phá Kho Sách Tuyệt Vời</h1>

                <div class="carousel">
                    <BookCardHorizontal v-for="book in featuredBooks" :key="book._id" :book="book"
                        @click="goToDetail(book)" />
                </div>

                <div class="view-all">
                    <button @click="goToAllBooks" class="btn-view-all">
                        Xem Tất Cả Sách
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBookStore } from "@/stores/bookStore";
import BookCardHorizontal from "@/components/readers/BookCardHorizontal.vue";

const router = useRouter();
const bookStore = useBookStore();
const featuredBooks = ref([]);

onMounted(async () => {
    await bookStore.fetchAvailableBooks();
    featuredBooks.value = bookStore.books.slice(0, 8);
});

function goToDetail(book) {
    router.push(`/reader/books/${book._id}`);
}

function goToAllBooks() {
    router.push({ name: "reader.all-books" });
}
</script>

<style scoped>
.home-page {
    background: #FFF2D7 !important;
    min-height: 100vh;
    padding-bottom: 4rem;
}

.hero {
    padding: 5rem 0 3rem;
}

.hero-title {
    text-align: center;
    font-size: 2.6rem;
    font-weight: 900;
    color: #1e1b15;
    margin-bottom: 3rem;
}

.carousel {
    display: flex;
    gap: 1.8rem;
    overflow-x: auto;
    padding: 1rem 0;
    scrollbar-width: none;
}

.carousel::-webkit-scrollbar {
    display: none;
}

.view-all {
    text-align: center;
    margin-top: 3rem;
}

.btn-view-all {
    background: #1e293b;
    color: white;
    border: none;
    padding: 16px 50px;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(30, 41, 59, 0.2);
}

.btn-view-all:hover {
    background: #0f172a;
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(30, 41, 59, 0.3);
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1.5rem;
}
</style>