<!-- // File: src/views/docgia/DocGiaAdd.vue
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
</script> -->

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Thêm Độc Giả</h2>

        <DocGiaForm :docGia="{}" @submit:docgia="addDocGia" @submit:docgia-with-file="addDocGiaWithFile" />
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
                Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Thêm mới Độc Giả thành công.', timer: 1500, showConfirmButton: false })
                    .then(() => { this.$router.push({ name: "docgia.list" }); });
            } catch (error) {
                console.error(error);
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Thêm mới thất bại. Vui lòng kiểm tra dữ liệu và thử lại.' });
            }
        },

        // NEW: handle create with Avatar file
        async addDocGiaWithFile({ docGia, file }) {
            try {
                await DocGiaService.createWithAvatar(docGia, file);
                Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Thêm mới Độc Giả (có ảnh) thành công.', timer: 1500, showConfirmButton: false })
                    .then(() => { this.$router.push({ name: "docgia.list" }); });
            } catch (error) {
                console.error("Create with file error:", error);
                const msg = error?.response?.data?.message || "Thêm mới thất bại. Vui lòng thử lại.";
                Swal.fire({ icon: 'error', title: 'Lỗi!', text: msg });
            }
        },
    },
};
</script>
