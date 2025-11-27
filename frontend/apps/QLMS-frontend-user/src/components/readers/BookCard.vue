<!-- src/components/books/BookCard.vue -->
<template>
    <div class="v-card" @click="$emit('view')">
        <div class="v-cover-wrapper">
            <img :src="book.BiaSach" :alt="book.TenSach" class="v-cover" />
        </div>
        <div class="v-content">
            <h3 class="v-title">{{ truncate(book.TenSach, 36) }}</h3>
            <p class="v-author">Tác giả: {{ book.TacGia || '—' }}</p>
            <p class="v-price">{{ formatPrice(book.DonGia) }}</p>
            <button class="v-btn">Xem chi tiết →</button>
        </div>
    </div>
</template>

<script setup>
defineProps({ book: Object });
defineEmits(['view']);
function truncate(str, n) { /* ... same as above */ }
function formatPrice(p) { /* ... same */ }
</script>

<style scoped>
.v-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.v-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.v-cover-wrapper {
    height: 280px;
    overflow: hidden;
    background: #f8fafc;
}

.v-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.v-card:hover .v-cover {
    transform: scale(1.05);
}

.v-content {
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
}

.v-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem;
    line-height: 1.3;
}

.v-author {
    font-size: 0.92rem;
    color: #64748b;
    margin: 0 0 0.8rem;
}

.v-price {
    font-size: 1.2rem;
    font-weight: 800;
    color: #7c3aed;
}

.v-btn {
    margin-top: 1rem;
    background: #7c3aed;
    color: white;
    border: none;
    padding: 11px 20px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    align-self: center;
}

.v-btn:hover {
    background: #6d28d9;
    transform: translateY(-2px);
}
</style>