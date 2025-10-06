<template>
    <div class="page row justify-content-center">
        <div class="col-md-6">
            <h4 class="text-center fw-bold text-primary">Thêm Nhân Viên Mới</h4>
            <NhanVienForm :nhanVien="{}" @submit:nhanvien="addNhanVien" />
        </div>
    </div>
</template>

<script>
import NhanVienForm from "@/components/nhanvien/NhanVienFrom.vue";
import NhanVienService from "@/services/nhanvien.service";
import Swal from "sweetalert2";

export default {
    components: {
        NhanVienForm,
    },
    methods: {
        async addNhanVien(data) {
            try {
                await NhanVienService.create(data);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Thêm mới nhân viên thành công.',
                    timer: 1500,
                    showConfirmButton: false,
                });
                this.$router.push({ name: "nhanvien.list" });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thêm mới nhân viên thất bại. Vui lòng kiểm tra lại.',
                });
                console.error(error);
            }
        },
    },
};
</script>