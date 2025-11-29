<template>
    <div class="book-card" @click="$emit('click')">
        <div class="book-cover">
            <img :src="book.BiaSach || '/no-cover.jpg'" :alt="book.TenSach" loading="lazy" />
        </div>

        <div class="book-info">
            <h3 class="book-title">{{ book.TenSach }}</h3>
            <p class="book-author">{{ book.TacGia || 'Không rõ' }}</p>
            <p class="book-price">{{ formatPrice(book.DonGia) }}đ</p>

            <button class="view-btn">
                Xem chi tiết <span class="arrow">→</span>
            </button>
        </div>
    </div>
</template>

<script setup>
defineEmits(['click'])
defineProps(['book'])

function formatPrice(p) {
    return p ? Number(p).toLocaleString('vi-VN') : '0'
}
</script>

<style scoped>
.book-card {
    width: 240px;
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
    transition: all 0.35s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    border: 1px solid #eee;
    flex-shrink: 0;
}

.book-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.14);
}

.book-cover {
    height: 280px;
    overflow: hidden;
}

.book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.book-card:hover img {
    transform: scale(1.08);
}

.book-info {
    padding: 14px 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
}

.book-title {
    font-size: 1rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.35;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.book-author {
    font-size: 0.88rem;
    color: #64748b;
    margin: 0;
    font-weight: 500;
}

.book-price {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e40af;
    margin: 4px 0 8px;
}

.view-btn {
    margin-top: auto;
    background: #1e293b;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 0.94rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    align-self: flex-start;
    box-shadow: 0 4px 12px rgba(30, 41, 59, 0.25);
    display: flex;
    align-items: center;
    gap: 6px;
}

.view-btn:hover {
    background: #0f172a;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.4);
}

.view-btn .arrow {
    font-weight: 400;
    font-size: 1.1em;
}

@media (max-width: 640px) {
    .book-card {
        width: 200px;
    }

    .book-cover {
        height: 240px;
    }
}
</style>