<template>
    <div class="auth-layout-bg">
        <div class="card register-card shadow-lg p-3">
            <div class="card-body p-4">
                <div class="text-center mb-3"> <i class="fas fa-user-plus fa-2x text-primary mb-2"></i>
                    <h3 class="card-title text-center mb-3 fw-bold text-primary"> Đăng Ký Tài Khoản Độc Giả
                    </h3>
                    <p class="text-muted">Tạo tài khoản mới để bắt đầu khám phá</p>
                </div>

                <div v-if="errorMessage" class="alert alert-danger text-center">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleRegister">
                    <div class="mb-2 input-group"> <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                        <input type="text" id="MaDocGia" class="form-control" v-model="registerData.MaDocGia"
                            placeholder="Mã Độc Giả (*)" required />
                    </div>

                    <div class="mb-2 input-group">
                        <span class="input-group-text"><i class="fas fa-signature"></i></span>
                        <input type="text" id="HoLot" class="form-control" v-model="registerData.HoLot"
                            placeholder="Họ Lót (*)" required />
                    </div>

                    <div class="mb-2 input-group">
                        <span class="input-group-text"><i class="fas fa-font"></i></span>
                        <input type="text" id="Ten" class="form-control" v-model="registerData.Ten"
                            placeholder="Tên (*)" required />
                    </div>

                    <div class="mb-2 input-group">
                        <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                        <input type="date" id="NgaySinh" class="form-control" v-model="registerData.NgaySinh"
                            placeholder="Ngày Sinh" />
                    </div>

                    <div class="mb-2 input-group">
                        <span class="input-group-text"><i class="fas fa-venus-mars"></i></span>
                        <select id="Phai" class="form-control" v-model="registerData.Phai">
                            <option value="" disabled>Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nu">Nữ</option>
                            <option value="Khac">Khác</option>
                        </select>
                    </div>

                    <div class="mb-2 input-group">
                        <span class="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                        <input type="text" id="DiaChi" class="form-control" v-model="registerData.DiaChi"
                            placeholder="Địa Chỉ" />
                    </div>

                    <div class="mb-2 input-group">
                        <span class="input-group-text"><i class="fas fa-phone"></i></span>
                        <input type="text" id="DienThoai" class="form-control" v-model="registerData.DienThoai"
                            placeholder="Điện Thoại" />
                    </div>

                    <div class="mb-3 input-group"> <span class="input-group-text"><i class="fas fa-key"></i></span>
                        <input type="password" id="Password" class="form-control" v-model="registerData.Password"
                            placeholder="Mật Khẩu (*)" required />
                    </div>

                    <button type="submit" class="btn btn-primary w-100 fw-semibold mb-3">
                        <i class="fas fa-user-plus me-2"></i> Đăng Ký
                    </button>
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
// (Phần script giữ nguyên vì logic vẫn đúng)
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

<style>
/* Đảm bảo đường dẫn import trỏ đến file CSS mới của bạn */
@import "@/assets/styles/login-register.css";
/* Nếu bạn đổi tên thành auth-forms.css thì phải đổi lại đường dẫn */
</style>