<template>
    <div class="login-container">
        <div class="card login-card shadow-lg">
            <div class="card-body">
                <h3 class="card-title text-center mb-4 fw-bold text-primary">
                    Đăng Nhập Tài Khoản Độc Giả
                </h3>

                <div v-if="errorMessage" class="alert alert-danger text-center">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="MaDocGia" class="form-label">Mã Độc Giả (*):</label>
                        <input type="text" id="MaDocGia" class="form-control" v-model="loginData.MaDocGia" required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Mật Khẩu (*):</label>
                        <input type="password" id="password" class="form-control" v-model="loginData.Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">
                        Đăng nhập
                    </button>
                </form>

                <p class="mt-3 text-center">
                    Chưa có tài khoản?
                    <router-link to="/register">Đăng ký ngay</router-link>
                </p>

            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";

export default {
    name: "LoginForm",
    data() {
        return {
            loginData: {
                MaDocGia: "",
                Password: "",
            },
            errorMessage: null,
        };
    },
    methods: {
        async handleLogin() {
            const authStore = useAuthStore(); // Pinia store
            try {
                // Gọi login service
                await authStore.login(this.loginData); // store đã lưu token + user

                // Thông báo thành công
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    text: `Chào mừng, ${authStore.user.HoLot} ${authStore.user.Ten}.`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    this.$router.push({ name: "home" });
                });

            } catch (error) {
                console.error("Lỗi đăng nhập:", error);

                const errorMessage =
                    error.response?.data?.message ||
                    "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.";

                Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    text: errorMessage,
                    showConfirmButton: true
                });

                this.errorMessage = errorMessage;
            }
        },
    },
};
</script>