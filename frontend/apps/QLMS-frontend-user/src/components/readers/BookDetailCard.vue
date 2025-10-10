<template>
    <div class="book-card">
        <h2 class="book-title">{{ book.TenSach }}</h2>
        <p><strong>Tác giả:</strong> {{ book.TacGia }}</p>
        <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>
        <p><strong>Số quyển còn lại:</strong> {{ book.SoQuyen }}</p>
        <p><strong>Đơn giá:</strong> {{ formatPrice(book.DonGia) }} VNĐ</p>

        <button @click="$emit('borrow')" class="borrow-btn" :disabled="book.SoQuyen === 0">
            Mượn sách
        </button>
    </div>
</template>

<script setup>
defineProps({
    book: { type: Object, required: true },
});

function formatPrice(price) {
    return price?.toLocaleString?.('vi-VN') || price;
}
</script>

<style scoped>
.book-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.book-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(100, 60, 200, 0.15);
}

.book-title {
    font-size: 20px;
    font-weight: 700;
    color: #6c2bd9;
    margin-bottom: 10px;
}

.book-card p {
    margin: 6px 0;
    color: #374151;
    font-size: 14.5px;
}

.borrow-btn {
    margin-top: 18px;
    background-color: #7c3aed;
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
}

.borrow-btn:hover {
    background-color: #6d28d9;
    transform: scale(1.03);
}

.borrow-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
}
</style>
