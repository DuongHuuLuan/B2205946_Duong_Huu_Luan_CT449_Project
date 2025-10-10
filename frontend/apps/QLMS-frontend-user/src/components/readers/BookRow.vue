<template>
    <tr class="book-row" @click="onView" tabindex="0" @keydown.enter.prevent="onView">
        <td class="cell id">{{ book.MaSach || "-" }}</td>
        <td class="cell name">{{ book.TenSach || "-" }}</td>
        <td class="cell author">{{ book.TacGia || "-" }}</td>
        <td class="cell year">{{ book.NamXuatBan || "-" }}</td>
        <td class="cell qty">{{ book.SoQuyenCon ?? book.SoQuyen ?? "-" }}</td>
        <td class="cell price">{{ formatPrice(book.DonGia) }}</td>
        <td class="cell actions">
            <BorrowButton :book="book" @borrow="onBorrow" @click.stop />
        </td>
    </tr>
</template>

<script setup>
import BorrowButton from "./BorrowButton.vue";

const props = defineProps({
    book: { type: Object, required: true },
});

// Khai báo rõ ràng các sự kiện phát ra
const emit = defineEmits(["view", "borrow"]);

/** Khi nhấn vào hàng -> xem chi tiết sách */
function onView() {
    emit("view", props.book);
}

/** * Khi nhấn nút mượn sách -> phát sự kiện borrow với object sách.
 * * NOTE: Tham số _payload không cần dùng, vì ta luôn gửi props.book 
 * để đảm bảo parent nhận đủ thông tin.
 */
function onBorrow(_payload) {
    emit("borrow", props.book);
}

/** Định dạng tiền tệ VNĐ */
function formatPrice(v) {
    if (v === null || v === undefined || v === "") return "-";
    const n = Number(v);
    // Sử dụng .replace(/\D/g, "") để loại bỏ ký tự không phải số nếu cần làm sạch dữ liệu
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString("vi-VN") + " ₫";
}
</script>

<style scoped>
.book-row {
    cursor: pointer;
    transition: background-color 0.15s ease, transform 0.1s ease;
}

.book-row:hover {
    background: #f9fafb;
    transform: scale(1.002);
}

.cell {
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    font-size: 14px;
}

.cell.name {
    font-weight: 600;
    color: #4c1d95;
}

.cell.price {
    color: #2563eb;
    font-weight: 500;
}

.cell.qty {
    text-align: center;
}

.cell.actions {
    text-align: center;
    width: 120px;
}

.cell.id {
    width: 90px;
    color: #6b7280;
}
</style>