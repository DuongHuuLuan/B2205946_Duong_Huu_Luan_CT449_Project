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

<script>
import DocGiaForm from "@/components/docgia/DocGiaForm.vue";
import DocGiaService from "@/services/docgia.service";
import Swal from "sweetalert2";

export default {
    components: { DocGiaForm },
    methods: {
        async addDocGia(docGiaData) {
            // Trường hợp KHÔNG có file → dùng route không multer
            try {
                await DocGiaService.create(docGiaData);
                Swal.fire("Thành công!", "Thêm độc giả thành công", "success");
                this.$router.push({ name: "docgia.list" });
            } catch (err) {
                Swal.fire("Lỗi", err.response?.data?.message || "Thêm thất bại", "error");
            }
        },

        // TRƯỜNG HỢP CÓ FILE → dùng route /with-avatar
        async addDocGiaWithFile({ docGia, file }) {
            try {
                await DocGiaService.createWithAvatar(docGia, file);
                Swal.fire("Thành công!", "Thêm độc giả mới thành công", "success");
                this.$router.push({ name: "docgia.list" });
            } catch (err) {
                Swal.fire("Lỗi", err.response?.data?.message || "Upload avatar thất bại", "error");
            }
        },
    },
};
</script>

<template>
    <div class="container mt-4">
        <h2>Thêm Độc Giả</h2>
        <DocGiaForm :docGia="{}" @submit:docgia="addDocGia" @submit:docgia-with-file="addDocGiaWithFile" />
    </div>
</template>