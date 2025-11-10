<template>
    <div v-if="nhanVien" class="page row justify-content-center">
        <div class="col-md-6">
            <h4 class="text-center fw-bold text-primary">Hiệu chỉnh Nhân Viên</h4>
            <NhanVienForm :nhanVien="nhanVien" @submit:nhanvien="updateNhanVien"
                @submit:nhanvien-with-file="updateNhanVienWithFile" />
        </div>
    </div>
</template>

<script>
import NhanVienForm from "@/components/nhanvien/NhanVienForm.vue"; // Đã sửa tên component
import NhanVienService from "@/services/nhanvien.service";
import FileService from "@/services/file.service"; // *GIẢ ĐỊNH*: Bạn có FileService để upload ảnh
import Swal from "sweetalert2";

export default {
    components: {
        NhanVienForm,
    },
    data() {
        return {
            nhanVien: null,
            isUploading: false, // Thêm biến trạng thái để tránh người dùng thao tác trong khi upload
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

        // Phương thức xử lý CẬP NHẬT THÔNG THƯỜNG (không có file mới)
        async updateNhanVien(data) {
            try {
                await NhanVienService.update(this.nhanVien._id, data);
                this.showSuccessAlert();
            } catch (error) {
                this.showErrorAlert();
                console.error(error);
            }
        },

        // PHƯƠNG THỨC MỚI: Xử lý CẬP NHẬT CÓ KÈM AVATAR
        async updateNhanVienWithFile({ nhanVien, file }) {
            if (this.isUploading) return;
            this.isUploading = true;

            let avatarUrl = this.nhanVien.Avatar; // Lấy URL cũ từ state

            try {
                // ===================================
                // BƯỚC 1: XỬ LÝ UPLOAD FILE
                // ===================================
                if (file) {
                    try {
                        const uploadRes = await FileService.upload(file, 'avatars');
                        avatarUrl = uploadRes.url; // Lấy URL mới
                    } catch (uploadError) {
                        console.error("Lỗi Upload File:", uploadError);
                        this.showErrorAlert("Lỗi Upload Ảnh: Không thể tải Avatar lên server. Vui lòng thử lại.");
                        return; // Dừng lại nếu upload thất bại
                    }
                }

                // ===================================
                // BƯỚC 2: CẬP NHẬT THÔNG TIN NHÂN VIÊN (API)
                // ===================================
                const dataToUpdate = {
                    ...nhanVien,
                    Avatar: avatarUrl,
                };

                await NhanVienService.update(this.nhanVien._id, dataToUpdate);
                this.showSuccessAlert();

            } catch (apiError) {
                // Bắt lỗi CẬP NHẬT API (BƯỚC 2)
                const errorMessage = apiError.response?.data?.message || "Lỗi Cập Nhật Dữ liệu: Vui lòng kiểm tra các trường thông tin và kết nối API.";
                console.error("Lỗi Cập Nhật API:", apiError);
                this.showErrorAlert(errorMessage);
            } finally {
                this.isUploading = false;
            }
        },
        showSuccessAlert() {
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Cập nhật nhân viên thành công.',
                timer: 1500,
                showConfirmButton: false,
            });
            this.$router.push({ name: "nhanvien.list" });
        },

        showErrorAlert(message = 'Cập nhật nhân viên thất bại. Vui lòng kiểm tra lại.') {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: message,
            });
        }
    },
    created() {
        this.loadNhanVien();
    },
};
</script>