<template>
    <div class="bg-white rounded-xl shadow p-6">
        <h2 class="text-2xl font-bold mb-3 text-purple-700">
            {{ book.TenSach }}
        </h2>
        <p><strong>Tác giả:</strong> {{ book.TacGia }}</p>
        <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>
        <p><strong>Số quyển còn lại:</strong> {{ book.SoQuyen }}</p>
        <p><strong>Đơn giá:</strong> {{ book.DonGia.toLocaleString() }} VNĐ</p>

        <button @click="$emit('borrow')" class="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            :disabled="book.SoQuyen === 0">
            Mượn sách
        </button>
    </div>
</template>

<script setup>
defineProps({
    book: { type: Object, required: true },
});
</script>
