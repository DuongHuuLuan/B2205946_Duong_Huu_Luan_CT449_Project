<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4"> Mượn sách mới</h1>

        <div class="grid grid-cols-2 gap-4">
            <div v-for="book in books" :key="book._id" class="border p-3 rounded shadow-sm">
                <h2 class="font-semibold">{{ book.TenSach }}</h2>
                <p class="text-sm text-gray-500 mb-2">{{ book.TacGia }}</p>
                <p>Còn lại: {{ book.SoQuyenCon }}</p>
                <button :disabled="selected.includes(book._id)" @click="toggleSelect(book._id)"
                    class="mt-2 bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50">
                    {{ selected.includes(book._id) ? "Đã chọn" : "Chọn mượn" }}
                </button>
            </div>
        </div>

        <div class="mt-6">
            <button @click="submitBorrow" class="bg-green-600 text-white px-4 py-2 rounded">
                Xác nhận mượn {{ selected.length }} sách
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import sachService from "@/services/sach.service";
import tdmsService from "@/services/theodoimuonsach.service";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const books = ref([]);
const selected = ref([]);

const toggleSelect = (id) => {
    if (selected.value.includes(id)) {
        selected.value = selected.value.filter((x) => x !== id);
    } else if (selected.value.length < 3) {
        selected.value.push(id);
    } else {
        alert("Chỉ được mượn tối đa 3 sách!");
    }
};

onMounted(async () => {
    const res = await sachService.getAvailableBooks(); // API trả về sách có SoQuyenCon > 0
    books.value = res;
});

const submitBorrow = async () => {
    try {
        const payload = {
            MaDocGia: authStore.user._id,
            ChiTietMuon: selected.value.map((id) => ({ MaSach: id })),
        };
        const res = await tdmsService.create(payload);
        alert("Mượn sách thành công!");
        selected.value = [];
    } catch (err) {
        alert(err.response?.data?.message || "Lỗi khi mượn sách!");
    }
};
</script>
