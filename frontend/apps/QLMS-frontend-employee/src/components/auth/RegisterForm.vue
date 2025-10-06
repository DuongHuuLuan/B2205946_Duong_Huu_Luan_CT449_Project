<template>
    <div class="register-container">
        <div class="card register-card shadow-lg">
            <div class="card-body">
                <h3 class="card-title text-center mb-4 fw-bold text-primary">
                    Đăng Ký Tài Khoản Nhân Viên
                </h3>

                <div v-if="errorMessage" class="alert alert-danger text-center">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="alert alert-success text-center">
                    {{ successMessage }}
                </div>

                <form @submit.prevent="handleRegister">
                    <div class="mb-3">
                        <label for="msnv" class="form-label">Mã Số NV (*):</label>
                        <input type="text" id="msnv" class="form-control" v-model="user.MSNV" required />
                    </div>

                    <div class="mb-3">
                        <label for="hoten" class="form-label">Họ Tên:</label>
                        <input type="text" id="hoten" class="form-control" v-model="user.HoTenNV" required />
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Mật Khẩu (*):</label>
                        <input type="password" id="password" class="form-control" v-model="user.Password" required />
                    </div>

                    <div class="mb-3">
                        <label for="chucvu" class="form-label">Chức Vụ:</label>
                        <select id="chucvu" class="form-control" v-model="user.ChucVu" required>
                            <option value="">-- Chọn chức vụ --</option>
                            <option value="Admin">Admin</option>
                            <option value="QuanLy">Quản lý</option>
                            <option value="ThuThu">Thủ Thư</option>
                            <option value="HoTro">Hỗ Trợ</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="diachi" class="form-label">Địa Chỉ:</label>
                        <input type="text" id="diachi" class="form-control" v-model="user.DiaChi" />
                    </div>

                    <div class="mb-3">
                        <label for="sdt" class="form-label">Số Điện Thoại:</label>
                        <input type="tel" id="sdt" class="form-control" v-model="user.SoDienThoai" />
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Đăng Ký</button>
                </form>

                <p class="mt-3 text-center">
                    Đã có tài khoản?
                    <router-link to="/login">Đăng nhập</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import "@/assets/LoginForm.css";
export default {
    name: "Register",
    data() {
        return {
            user: {
                MSNV: "",
                HoTenNV: "",
                Password: "",
                ChucVu: "",
                DiaChi: "",
                SoDienThoai: "",
            },
            errorMessage: "",
            successMessage: "",
        };
    },
    methods: {
        async handleRegister() {
            this.errorMessage = "";
            this.successMessage = "";

            try {
                const payload = Object.fromEntries(
                    Object.entries(this.user).filter(([_, v]) => v !== "")
                );

                const response = await AuthService.register(payload);

                this.successMessage = response.message || "Đăng ký thành công!";
                setTimeout(() => {
                    this.$router.push({ name: "login" });
                }, 1500);
            } catch (error) {
                const serverError = error.response && error.response.data.message;
                if (serverError && serverError.includes("MSNV already exists")) {
                    this.errorMessage = "Mã Số Nhân Viên này đã tồn tại.";
                } else {
                    this.errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
                }
                console.error("Lỗi đăng ký:", error);
            }
        },
    },
};
</script>
