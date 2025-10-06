<template>
    <div class="register-container">
        <div class="card register-card shadow-lg">
            <div class="card-body">
                <h3 class="card-title text-center mb-4 fw-bold text-primary">
                    Đăng Ký Tài Khoản Độc Giả
                </h3>

                <div v-if="errorMessage" class="alert alert-danger text-center">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleRegister">
                    <div class="mb-3">
                        <label for="MaDocGia" class="form-label">Mã Độc Giả (*):</label>
                        <input type="text" id="MaDocGia" class="form-control" v-model="registerData.MaDocGia"
                            required />
                    </div>

                    <div class="mb-3">
                        <label for="HoLot" class="form-label">Họ Lót (*):</label>
                        <input type="text" id="HoLot" class="form-control" v-model="registerData.HoLot" required />
                    </div>

                    <div class="mb-3">
                        <label for="Ten" class="form-label">Tên (*):</label>
                        <input type="text" id="Ten" class="form-control" v-model="registerData.Ten" required />
                    </div>

                    <div class="mb-3">
                        <label for="NgaySinh" class="form-label">Ngày Sinh:</label>
                        <input type="date" id="NgaySinh" class="form-control" v-model="registerData.NgaySinh" />
                    </div>

                    <div class="mb-3">
                        <label for="Phai" class="form-label">Giới Tính:</label>
                        <select id="Phai" class="form-control" v-model="registerData.Phai">
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nu">Nữ</option>
                            <option value="Khac">Khác</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="DiaChi" class="form-label">Địa Chỉ:</label>
                        <input type="text" id="DiaChi" class="form-control" v-model="registerData.DiaChi" />
                    </div>

                    <div class="mb-3">
                        <label for="DienThoai" class="form-label">Điện Thoại:</label>
                        <input type="text" id="DienThoai" class="form-control" v-model="registerData.DienThoai" />
                    </div>

                    <div class="mb-3">
                        <label for="Password" class="form-label">Mật Khẩu (*):</label>
                        <input type="password" id="Password" class="form-control" v-model="registerData.Password"
                            required />
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Đăng Ký</button>
                </form>

                <p class="mt-3 text-center">
                    Đã có tài khoản?
                    <router-link to="/login">Đăng nhập ngay</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import Swal from "sweetalert2";

export default {
    name: "RegisterForm",
    data() {
        return {
            registerData: {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "",
                DiaChi: "",
                DienThoai: "",
                Password: "",
            },
            errorMessage: null,
        };
    },
    methods: {
        async handleRegister() {
            try {
                const response = await AuthService.register(this.registerData);

                Swal.fire({
                    icon: "success",
                    title: "Đăng ký thành công",
                    text: "Bạn có thể đăng nhập ngay bây giờ",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    this.$router.push({ name: "login" });
                });
            } catch (error) {
                console.error("Lỗi đăng ký:", error);

                const errorMessage =
                    error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.";

                Swal.fire({
                    icon: "error",
                    title: "Đăng ký thất bại",
                    text: errorMessage,
                    showConfirmButton: true,
                });

                this.errorMessage = errorMessage;
            }
        },
    },
};
</script>

<style scoped>
.register-container {
    max-width: 400px;
    margin: 50px auto;
}
</style>
