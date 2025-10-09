<template>
    <div class="book-card" @click="$emit('view', book)">
        <h3>{{ book.TenSach }}</h3>
        <p>Tác giả: {{ book.TacGia }}</p>
        <p>Năm XB: {{ book.NamXuatBan }}</p>
        <BorrowButton :book="book" />
    </div>
</template>

<script setup>
import BorrowButton from "./BorrowButton.vue";
defineProps({ book: Object });
</script>

<style scoped>
.book-card {
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px;
    margin: 8px 0;
    cursor: pointer;
    transition: 0.2s;
}

.book-card:hover {
    background-color: #fafafa;
}
</style>
