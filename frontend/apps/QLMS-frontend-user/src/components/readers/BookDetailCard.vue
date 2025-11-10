<!-- src/components/books/BookCard.vue -->
<template>
    <div class="book-card" :aria-label="`Chi tiết sách ${book.TenSach || ''}`" role="article">
        <h2 class="book-title">{{ book.TenSach || '—' }}</h2>
        <div class="book-cover-wrapper">
            <img :src="book.BiaSach" :alt="`Bìa sách ${book.TenSach || ''}`" class="book-cover" v-if="book.BiaSach" />
            <div v-else class="cover-placeholder">🖼️</div>
        </div>
        <p class="meta-line"><strong>Tác giả:</strong> <span>{{ book.TacGia || '—' }}</span></p>
        <p class="meta-line"><strong>Năm xuất bản:</strong> <span>{{ book.NamXuatBan || '—' }}</span></p>
        <p class="meta-line"><strong>Số quyển còn lại:</strong> <span>{{ book.SoQuyen ?? '-' }}</span></p>
        <p class="meta-line"><strong>Đơn giá:</strong> <span>{{ formatPrice(book.DonGia) }}</span></p>

        <div class="actions">
            <button @click="$emit('borrow')" class="borrow-btn" :disabled="(book.SoQuyen ?? 0) === 0"
                :aria-disabled="(book.SoQuyen ?? 0) === 0 ? 'true' : 'false'" aria-label="Mượn sách" title="Mượn sách">
                Mượn sách
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    book: { type: Object, required: true },
});

function formatPrice(price) {
    if (price === null || price === undefined || price === "") return "-";
    const n = Number(String(price).replace(/\D/g, ""));
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString("vi-VN") + " ₫";
}
</script>

<style scoped>
.book-card {
    background: linear-gradient(180deg, #ffffff, #fbfdff);
    border-radius: 14px;
    padding: 18px;
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.06);
    transition: transform 0.16s ease, box-shadow 0.16s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
    /* Tăng khoảng cách tổng thể giữa các phần tử */
    min-width: 240px;
    text-align: center;
    /* Căn giữa nội dung trong card */
}

/* hover / focus */
.book-card:hover,
.book-card:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 14px 38px rgba(15, 23, 42, 0.08);
}

/* Book Cover Wrapper */
.book-cover-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    /* Khoảng cách dưới ảnh bìa */
}

/* Book Cover Image */
.book-cover {
    width: 120px;
    /* Chiều rộng ảnh bìa */
    height: 180px;
    /* Chiều cao ảnh bìa */
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e2e8f0;
}

/* Placeholder khi không có ảnh bìa */
.cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    /* Chiều rộng giống ảnh */
    height: 180px;
    /* Chiều cao giống ảnh */
    border-radius: 8px;
    background-color: #f1f5f9;
    color: #9ca3af;
    font-size: 40px;
    /* Ký tự lớn hơn */
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}


/* Title */
.book-title {
    font-size: 18px;
    font-weight: 800;
    color: #5b21b6;
    /* purple accent */
    margin: 0;
    /* Loại bỏ margin top/bottom */
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* metadata lines */
.meta-line {
    margin: 2px 0;
    /* Giảm khoảng cách giữa các dòng meta */
    color: #374151;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    /* Căn đều nội dung */
    align-items: baseline;
    text-align: left;
    /* Đặt lại text-align cho meta-line */
}

.meta-line strong {
    color: #111827;
    font-weight: 600;
    /* min-width: 120px; */
    /* Không cần min-width khi dùng space-between */
    display: inline-block;
    font-size: 14px;
}

/* values */
.meta-line span {
    color: #374151;
    font-weight: 500;
    font-size: 14px;
    flex-grow: 1;
    /* Cho phép span chiếm hết không gian còn lại */
    text-align: right;
    /* Căn phải các giá trị */
}

/* actions row */
.actions {
    display: flex;
    justify-content: center;
    /* Căn giữa nút mượn sách */
    margin-top: 12px;
    /* Khoảng cách trên nút mượn sách */
}

/* borrow button */
.borrow-btn {
    background: linear-gradient(180deg, #7c3aed, #6d28d9);
    color: #fff;
    border: none;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 18px rgba(109, 40, 217, 0.08);
    transition: transform 0.08s ease, box-shadow 0.12s ease, opacity 0.12s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
    justify-content: center;
}

/* hover */
.borrow-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(109, 40, 217, 0.12);
}

/* disabled state */
.borrow-btn:disabled,
.borrow-btn[aria-disabled="true"] {
    background: #e6e7ee;
    color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    opacity: 0.95;
}

/* small screens */
@media (max-width: 640px) {
    .book-card {
        padding: 14px;
        gap: 8px;
    }

    .book-cover {
        width: 100px;
        height: 150px;
    }

    .cover-placeholder {
        width: 100px;
        height: 150px;
        font-size: 32px;
    }

    .meta-line strong {
        /* min-width: 96px; */
        font-size: 13px;
    }

    .meta-line span {
        font-size: 13px;
    }

    .book-title {
        font-size: 16px;
    }

    .borrow-btn {
        min-width: 100px;
        padding: 9px 12px;
        font-size: 13px;
    }
}
</style>
