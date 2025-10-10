<template>
    <button class="borrow-btn" :disabled="isButtonDisabled" @click="handleClick">
        {{ isButtonDisabled ? 'Hết sách' : 'Mượn sách' }}
    </button>
</template>

<script setup>
import { computed } from "vue";
// ❌ Loại bỏ useRouter vì việc điều hướng sẽ được xử lý ở component cha (BookListView)

const props = defineProps({
    book: { type: Object, required: true },
});

// Khai báo sự kiện 'borrow' để component cha lắng nghe
const emit = defineEmits(["borrow"]);

// Tính toán trạng thái vô hiệu hóa nút
const isButtonDisabled = computed(() => {
    // Vô hiệu hóa nếu số lượng sách còn lại nhỏ hơn hoặc bằng 0
    // Sử dụng book.SoQuyenCon nếu có, hoặc book.SoQuyen
    return (props.book.SoQuyenCon ?? props.book.SoQuyen) <= 0;
});

function handleClick() {
    // Phát ra sự kiện 'borrow' và truyền đối tượng sách (hoặc ID)
    emit("borrow", props.book);
}

</script>

<style scoped>
.borrow-btn {
    background: linear-gradient(135deg, #7c3aed, #9333ea);
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.2s, transform 0.1s;
}

.borrow-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #6d28d9, #8b5cf6);
    transform: translateY(-1px);
}

.borrow-btn:disabled {
    /* Thêm style để hiển thị rõ sách đã hết */
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
}
</style>