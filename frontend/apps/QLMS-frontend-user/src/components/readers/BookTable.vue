<template>
    <div class="book-table-wrapper">
        <table class="book-table">
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Năm XB</th>
                    <th>Số quyển</th>
                    <th>Đơn giá</th>
                    <th>Hành động</th>
                </tr>
            </thead>

            <tbody>
                <BookRow v-for="b in books" :key="b.MaSach" :book="b" @view="$emit('view', $event)"
                    @borrow="$emit('borrow', $event)" />
                <tr v-if="books.length === 0">
                    <td colspan="7" class="empty">Không có sách</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import BookRow from "./BookRow.vue";
defineProps({ books: { type: Array, required: true } });
// Cập nhật: Thêm sự kiện 'borrow'
defineEmits(["view", "borrow"]);
</script>

<style scoped>
.book-table-wrapper {
    overflow-x: auto;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.book-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
}

.book-table thead th {
    text-align: left;
    padding: 12px;
    font-size: 14px;
    color: #4b5563;
    border-bottom: 2px solid #e5e7eb;
    background: #f3f4f6;
    font-weight: 600;
    letter-spacing: 0.3px;
}

.book-table tbody tr:last-child td {
    border-bottom: none;
}

.book-table tbody .empty {
    text-align: center;
    padding: 24px;
    color: #9ca3af;
    font-style: italic;
}

.book-table tbody tr:hover {
    background: #f9fafb;
    transition: background 0.2s ease;
}

.book-table td {
    border-bottom: 1px solid #f1f5f9;
    padding: 10px 12px;
    font-size: 14px;
    color: #374151;
}
</style>