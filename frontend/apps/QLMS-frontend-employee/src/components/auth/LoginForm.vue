<template>
    <div class="login-container">
        <div class="card login-card shadow-lg p-4">
            <div class="card-body">
                <h3 class="card-title text-center mb-4 fw-bold text-primary">
                    Đăng nhập
                </h3>

                <form @submit.prevent="handleLogin">
                    <div class="mb-3 input-group">
                        <span class="input-group-text">
                            <i class="fas fa-user"></i>
                        </span>
                        <input type="text" id="username" class="form-control" placeholder="Mã Nhân Viên"
                            v-model="loginData.MSNV" required />
                    </div>

                    <div class="mb-3 input-group">
                        <span class="input-group-text">
                            <i class="fas fa-lock"></i>
                        </span>
                        <input type="password" id="password" class="form-control" placeholder="Mật khẩu"
                            v-model="loginData.Password" required />
                    </div>

                    <button type="submit" class="btn btn-primary w-100 fw-semibold">
                        <i class="fas fa-sign-in-alt me-2"></i> Đăng Nhập
                    </button>
                </form>
                <p class="mt-3 text-center">
                    Chưa có tài khoản? <Router-link to="/register">Đăng ký ngay</Router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";
import "@/assets/LoginForm.css";
import Swal from "sweetalert2";

export default {
    name: "LoginForm",
    data() {
        return {
            loginData: {
                MSNV: "",
                Password: "",
            },
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await AuthService.login(this.loginData);

                AuthService.saveToken(response.token);
                const authStore = useAuthStore();
                authStore.setUser(response.user);

                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công! 🎉',
                    text: `Chào mừng, ${response.user.HoTenNV} (${response.user.ChucVu}).`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    this.$router.push({ name: "home" });
                });

            } catch (err) {
                console.error("Lỗi đăng nhập:", err);

                const errorMessage =
                    err.response?.data?.message ||
                    "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.";

                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: errorMessage,
                    showConfirmButton: true
                });
            }
        },
    },
};
</script>
