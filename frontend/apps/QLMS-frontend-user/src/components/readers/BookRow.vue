<template>
    <tr class="book-row" @click="onView" tabindex="0" @keydown.enter.prevent="onView" role="button"
        :aria-label="`Xem chi tiết: ${book.TenSach || 'sách'}`">
        <td class="cell id">
            <div class="cell-content">{{ book.MaSach ?? "-" }}</div>
        </td>

        <td class="cell avatar" :title="book.BiaSach">
            <div class="cell-content">
                <img :src="book.BiaSach" :alt="`Bìa sách ${book.TenSach || ''}`" class="book-cover"
                    v-if="book.BiaSach  " />
                <div v-else class="cover-placeholder">🖼️</div>
            </div>
        </td>
        <td class="cell name" :title="book.TenSach || '-'">
            <div class="cell-content name-content">
                <div class="title">{{ book.TenSach || "-" }}</div>
                <div class="meta">{{ book.TheLoai ? book.TheLoai : '' }}</div>
            </div>
        </td>

        <td class="cell author">
            <div class="cell-content">{{ book.TacGia ?? "-" }}</div>
        </td>

        <td class="cell year">
            <div class="cell-content">{{ book.NamXuatBan ?? "-" }}</div>
        </td>

        <td class="cell qty">
            <div class="cell-content">
                <span class="badge"
                    :class="{ 'badge-empty': qtyValue === 0, 'badge-low': qtyValue > 0 && qtyValue <= 2 }"
                    :title="qtyTooltip">
                    {{ qtyDisplay }}
                </span>
            </div>
        </td>

        <td class="cell price">
            <div class="cell-content price-content">
                <span class="price-pill">{{ formatPrice(book.DonGia) }}</span>
            </div>
        </td>

        <td class="cell actions">
            <div class="cell-content actions-content" @click.stop>
                <BorrowButton :book="book" @borrow="onBorrow" />
            </div>
        </td>
    </tr>
</template>

<script setup>
import BorrowButton from "./BorrowButton.vue";

const props = defineProps({
    book: { type: Object, required: true },
});
const emit = defineEmits(["view", "borrow"]);

function onView() {
    emit("view", props.book);
}
function onBorrow(_payload) {
    emit("borrow", props.book);
}

function formatPrice(v) {
    if (v === null || v === undefined || v === "") return "-";
    const n = Number(String(v).replace(/\D/g, ""));
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString("vi-VN") + " ₫";
}

const qtyValue = props.book.SoQuyenCon ?? props.book.SoQuyen ?? 0;
const qtyDisplay = qtyValue === null || qtyValue === undefined || qtyValue === "" ? "-" : qtyValue;
const qtyTooltip = qtyValue === 0 ? "Hết sách" : (qtyValue <= 2 ? `Còn ${qtyValue} quyển` : `Còn ${qtyValue} quyển`);
</script>

<style scoped>
:root {
    --bg: #ffffff;
    --muted: #6b7280;
    --text: #111827;
    --accent: #5b21b6;
    --accent-2: #2563eb;
    --surface: #f8fafc;
}

.book-row {
    cursor: pointer;
    transition: background-color 0.16s ease, transform 0.12s ease, box-shadow 0.12s ease;
}

.book-row:hover {
    background: var(--surface);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
}

.book-row:focus-visible {
    outline: 2px solid rgba(37, 99, 235, 0.18);
    outline-offset: 2px;
}

/* --- CELL BASE --- */
.cell {
    padding: 12px 14px;
    border-bottom: 1px solid #eef2f7;
    color: var(--text);
    font-size: 14px;
    vertical-align: middle;
    /* important for table rows */
    /* ensure cell doesn't collapse too small */
    min-width: 48px;
    box-sizing: border-box;
}

/* Use an inner wrapper for flex layout without changing td display */
.cell-content {
    display: flex;
    align-items: center;
    /* vertical centering inside the cell */
    justify-content: flex-start;
    gap: 8px;
    width: 100%;
}

/* ID column */
.cell.id {
    width: 92px;
    max-width: 92px;
    color: var(--muted);
    font-weight: 600;
    justify-content: center;
}

/* NAME column: allow it to grow */
.cell.name {
    max-width: 380px;
    width: 40%;
}

.name-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}

/* Title styling */
.title {
    font-weight: 700;
    color: var(--accent);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

/* meta under title */
.meta {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* AUTHOR */
.cell.author {
    max-width: 200px;
}

.cell.author .cell-content {
    justify-content: flex-start;
}

/* YEAR */
.cell.year {
    width: 96px;
    max-width: 96px;
    color: var(--muted);
}

.cell.year .cell-content {
    justify-content: center;
}

/* QTY (badge centered) */
.cell.qty {
    width: 120px;
    max-width: 120px;
    text-align: center;
}

.cell.qty .cell-content {
    justify-content: center;
}

.badge {
    display: inline-block;
    min-width: 46px;
    padding: 6px 10px;
    border-radius: 999px;
    background: #ecfdf5;
    color: #065f46;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
}

.badge-empty {
    background: #fff1f2;
    color: #b91c1c;
}

.badge-low {
    background: #fffbeb;
    color: #92400e;
}

/* PRICE: align to right inside cell */
.cell.price {
    width: 160px;
    max-width: 160px;
}

.price-content {
    justify-content: flex-end;
}

.price-pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 8px;
    background: rgba(37, 99, 235, 0.07);
    color: var(--accent-2);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    /* keeps numbers aligned */
}

/* ACTIONS: use flex to keep button centered and stable */
.cell.actions {
    width: 140px;
    max-width: 140px;
}

.actions-content {
    justify-content: center;
}

/* RESPONSIVE adjustments */
@media (max-width: 720px) {
    .cell {
        padding: 10px 8px;
        font-size: 13px;
    }

    .cell.name {
        max-width: 180px;
        width: 36%;
    }

    .cell.author {
        max-width: 140px;
    }

    .cell.id {
        width: 72px;
        max-width: 72px;
    }

    .cell.price {
        width: 120px;
        max-width: 120px;
    }

    .cell.actions {
        width: 100px;
        max-width: 100px;
    }
}

.cell.avatar {
    width: 60px;
    max-width: 60px;
    padding: 8px 10px;
}

.cell.avatar .cell-content {
    justify-content: center;
}

/* Style cho ảnh bìa */
.book-cover {
    width: 40px;
    /* Kích thước ảnh */
    height: 55px;
    /* Kích thước ảnh */
    object-fit: cover;
    /* Đảm bảo ảnh hiển thị đẹp */
    border-radius: 4px;
    /* Góc bo tròn nhẹ */
    border: 1px solid #e2e8f0;
    /* Viền nhẹ */
    flex-shrink: 0;
    /* Ngăn ảnh bị co lại */
}

/* Style cho placeholder khi không có ảnh bìa */
.cover-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 55px;
    border-radius: 4px;
    background-color: #f1f5f9;
    /* Màu nền nhẹ */
    color: var(--muted);
    font-size: 18px;
    /* Ký tự lớn */
    border: 1px solid #e2e8f0;
}


/* RESPONSIVE adjustments cho cột mới */
@media (max-width: 720px) {
    /* ... các rule cũ giữ nguyên ... */

    .cell.avatar {
        width: 50px;
        max-width: 50px;
        padding: 6px 8px;
    }

    .book-cover,
    .cover-placeholder {
        width: 34px;
        height: 48px;
    }
}
</style>
