// File: src/views/docgia/DocGiaEdit.vue
<template>
    <div class="container mt-4">
        <h2 class="mb-3">Cập Nhật Độc Giả</h2>

        <DocGiaForm v-if="docGia" :docGia="docGia" @submit:docgia="updateDocGia" />
        <p v-else>Đang tải dữ liệu...</p>
    </div>
</template>

<script>
import DocGiaForm from "@/components/docgia/DocGiaForm.vue";
import DocGiaService from "@/services/docgia.service";
import Swal from "sweetalert2";

export default {
    name: "DocGiaEdit",
    components: { DocGiaForm },
    data() {
        return {
            docGia: null,
        };
    },
    methods: {
        async loadDocGia() {
            try {
                this.docGia = await DocGiaService.get(this.$route.params.id);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không thể tải dữ liệu Độc Giả.',
                });
                console.error(error);
            }
        },
        async updateDocGia(updatedDocGia) {
            try {
                await DocGiaService.update(this.$route.params.id, updatedDocGia);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Cập nhật Độc Giả thành công.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    this.$router.push({ name: "docgia.list" });
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Cập nhật thất bại. Vui lòng thử lại!',
                });
                console.error(error);
            }
        },
    },
    mounted() {
        this.loadDocGia();
    },
};
</script>