<template>
    <div class="book-table-wrapper">
        <table class="book-table" role="table">
            <caption class="sr-only">Danh sách sách</caption>

            <thead>
                <tr>
                    <th scope="col">Mã</th>
                    <th scope="col">Ảnh sách</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Tác giả</th>
                    <th scope="col">Năm XB</th>
                    <th scope="col">Số quyển</th>
                    <th scope="col">Đơn giá</th>
                    <th scope="col">Hành động</th>
                </tr>
            </thead>

            <tbody>
                <BookRow v-for="b in books" :key="b.MaSach ?? b._id ?? b.TenSach" :book="b"
                    @view="$emit('view', $event)" @borrow="$emit('borrow', $event)" />

                <tr v-if="books.length === 0">
                    <td colspan="7" class="empty">Không có sách</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import BookRow from "./BookRow.vue";

const props = defineProps({ books: { type: Array, required: true } });
defineEmits(["view", "borrow"]);
</script>

<style scoped>
.book-table-wrapper {
    overflow-x: auto;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 6px 20px rgba(2, 6, 23, 0.04);
    padding: 6px;
}

.book-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 840px;
    table-layout: fixed;
    background: transparent;
    border-radius: 8px;
    overflow: hidden;
}

.book-table thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    text-align: left;
    padding: 12px 16px;
    font-size: 13px;
    color: #374151;
    border-bottom: 2px solid #eef2f7;
    background: linear-gradient(180deg, #fbfdff 0%, #f3f4f6 100%);
    font-weight: 700;
}

.book-table tbody tr:last-child td {
    border-bottom: none;
}

.book-table tbody .empty {
    text-align: center;
    padding: 32px;
    color: #9ca3af;
    font-style: italic;
}

.book-table td {
    border-bottom: 1px solid #f1f5f9;
    padding: 12px 16px;
    font-size: 14px;
    color: #111827;
}

/* small-screen behavior */
@media (max-width: 860px) {
    .book-table {
        min-width: 700px;
    }
}

/* utility: screen-reader-only */
.sr-only {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
    border: 0;
    padding: 0;
    margin: -1px;
}
</style>