<!-- <template>
    <div class="auth-page-bg d-flex justify-content-center align-items-center min-vh-100">
        <div class="card auth-card shadow-xl border-0 rounded-4">
            <div class="card-body p-5">
                <div class="text-center mb-4">
                    <i class="fas fa-lock fa-3x text-primary mb-2 auth-icon-bounce"></i>
                    <h3 class="auth-title fw-bolder mt-2">
                        Đăng Nhập <span class="text-primary">Độc Giả</span>
                    </h3>
                    <p class="auth-subtitle">Chào mừng trở lại, độc giả thân mến!</p>
                </div>

                <div v-if="errorMessage" class="alert alert-danger text-center animated-fade-in">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="MaDocGia" class="form-label visually-hidden">Mã Độc Giả (*)</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-user-circle"></i>
                            </span>
                            <input type="text" id="MaDocGia" class="form-control form-control-lg"
                                v-model="loginData.MaDocGia" placeholder="Mã Độc Giả (*)" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="password" class="form-label visually-hidden">Mật Khẩu (*)</label>
                        <div class="input-group input-group-lg">
                            <span class="input-group-text">
                                <i class="fas fa-key"></i>
                            </span>
                            <input type="password" id="password" class="form-control form-control-lg"
                                v-model="loginData.Password" placeholder="Mật Khẩu (*)" required>
                        </div>
                    </div>

                    <button type="submit" class="btn auth-btn-primary w-100 mb-3">
                        <i class="fas fa-sign-in-alt me-2"></i> Đăng Nhập
                    </button>
                </form>

                <p class="mt-4 text-center text-muted">
                    Chưa có tài khoản?
                    <router-link to="/register" class="auth-link-hover">
                        Đăng ký ngay
                    </router-link>
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
            const authStore = useAuthStore();
            try {
                await authStore.login(this.loginData);
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

<style>
@import "@/assets/styles/login-register.css";
</style> -->
<template>
    <div class="auth-layout-bg">
        <div class="card login-card shadow-lg p-4">
            <div class="card-body">
                <div class="text-center mb-4">
                    <i class="fas fa-lock fa-3x text-primary mb-2"></i>
                    <h3 class="card-title text-center mb-4 fw-bold text-primary">
                        Đăng Nhập Tài Khoản Độc Giả
                    </h3>
                    <p class="text-muted">Chào mừng trở lại, độc giả thân mến!</p>
                </div>
                <form @submit.prevent="handleLogin">
                    <div class="mb-3 input-group">
                        <span class="input-group-text">
                            <i class="fas fa-user"></i>
                        </span>
                        <input type="text" id="MaDocGia" class="form-control" placeholder="Mã Độc Giả"
                            v-model="loginData.MaDocGia" required />
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
                    Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link>
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
            const authStore = useAuthStore();
            try {
                await authStore.login(this.loginData);
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
<style>
/* Đảm bảo import file CSS dùng chung đã được điều chỉnh */
@import "@/assets/styles/login-register.css";
</style>