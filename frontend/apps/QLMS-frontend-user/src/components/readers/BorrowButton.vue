<script setup>
import { ref } from "vue";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service"; // ✅ Đổi tên cho khớp
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const isBorrowing = ref(false);

const handleBorrow = async (bookId) => {
    try {
        isBorrowing.value = true;
        const data = {
            docGiaId: authStore.user.id,
            sachId: bookId,
            ngayMuon: new Date().toISOString(),
        };
        await TheoDoiMuonSachService.create(data);
        alert("Mượn sách thành công!");
    } catch (error) {
        console.error("Lỗi mượn sách:", error);
        alert("Không thể mượn sách!");
    } finally {
        isBorrowing.value = false;
    }
};
</script>

<template>
    <button class="btn btn-primary" :disabled="isBorrowing" @click="handleBorrow(book.id)">
        {{ isBorrowing ? "Đang xử lý..." : "Mượn sách" }}
    </button>
</template>
