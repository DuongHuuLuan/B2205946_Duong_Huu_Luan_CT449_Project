<template>
    <div v-if="nhanVien" class="page row justify-content-center">
        <div class="col-md-6">
            <h4 class="text-center fw-bold text-primary">Hiệu chỉnh Nhân Viên</h4>
            <NhanVienForm :nhanVien="nhanVien" @submit:nhanvien="updateNhanVien" />
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
    data() {
        return {
            nhanVien: null,
        };
    },
    methods: {
        async loadNhanVien() {
            try {
                this.nhanVien = await NhanVienService.getById(this.$route.params.id);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không thể tải thông tin nhân viên.',
                });
                console.error(error);
                this.$router.push({ name: "nhanvien.list" });
            }
        },
        async updateNhanVien(data) {
            try {
                await NhanVienService.update(this.nhanVien._id, data);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Cập nhật nhân viên thành công.',
                    timer: 1500,
                    showConfirmButton: false,
                });
                this.$router.push({ name: "nhanvien.list" });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Cập nhật nhân viên thất bại. Vui lòng kiểm tra lại.',
                });
                console.error(error);
            }
        },
    },
    created() {
        this.loadNhanVien();
    },
};
</script>