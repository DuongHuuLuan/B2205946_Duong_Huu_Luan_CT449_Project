// File: src/views/docgia/DocGiaAdd.vue
<template>
    <div class="container mt-4">
        <h2 class="mb-3">Thêm Độc Giả</h2>

        <DocGiaForm :docGia="{}" @submit:docgia="addDocGia" />
    </div>
</template>

<script>
import DocGiaForm from "@/components/docgia/DocGiaForm.vue";
import DocGiaService from "@/services/docgia.service";
import Swal from "sweetalert2";

export default {
    name: "DocGiaAdd",
    components: { DocGiaForm },
    methods: {
        async addDocGia(newDocGia) {
            try {
                await DocGiaService.create(newDocGia);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Thêm mới Độc Giả thành công.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    this.$router.push({ name: "docgia.list" });
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thêm mới thất bại. Vui lòng kiểm tra dữ liệu và thử lại.',
                });
                console.error(error);
            }
        },
    },
};
</script>