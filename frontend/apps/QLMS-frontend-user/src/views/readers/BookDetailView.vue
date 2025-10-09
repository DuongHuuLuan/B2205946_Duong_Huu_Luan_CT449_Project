<template>
    <div class="book-detail p-6 max-w-3xl mx-auto">
        <LoadingSpinner v-if="loading" />

        <EmptyState v-else-if="!book" text="Không tìm thấy sách" />

        <BookDetailCard v-else :book="book" @borrow="onBorrow" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SachService from "@/services/sach.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import BookDetailCard from "@/components/readers/BookDetailCard.vue";

const route = useRoute();
const router = useRouter();

const book = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        const id = route.params.id;
        book.value = await SachService.getById(id);

    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
});

async function onBorrow() {
    try {
        await TheoDoiMuonSachService.create({
            MaSach: book.value.MaSach,
            NgayMuon: new Date(),
        });
        alert("Mượn sách thành công!");
        router.push("/borrow");
    } catch (error) {
        alert("Không thể mượn sách, vui lòng thử lại.");
        console.error(error);
    }
}
</script>
