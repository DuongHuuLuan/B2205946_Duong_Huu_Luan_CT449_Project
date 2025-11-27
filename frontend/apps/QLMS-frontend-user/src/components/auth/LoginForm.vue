<!-- <template>
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
</style> -->
<template>
    <div class="auth-page">
        <div class="auth-container">
            <!-- Bên trái: ảnh + chữ -->
            <div class="auth-left">
                <h1>Khám phá<br>Thế giới<br>Tri Thức</h1>
                <p>Học hỏi, kết nối, và phát triển không ngừng</p>
            </div>
            <div class="auth-right">
                <h2>THƯ VIỆN TRỰC TUYẾN</h2>
                <p class="login-subtitle">Đăng nhập tài khoản</p>

                <form @submit.prevent="handleLogin" class="auth-form">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Mã Độc Giả" v-model="loginData.MaDocGia"
                            required autocomplete="username" />
                    </div>

                    <div class="input-group">
                        <input type="password" class="form-control" placeholder="Mật khẩu" v-model="loginData.Password"
                            required autocomplete="current-password" />
                    </div>

                    <button type="submit" class="btn-login w-100">
                        Đăng nhập
                    </button>
                </form>

                <div class="register-link">
                    Chưa có tài khoản?
                    <router-link to="/register">Đăng ký tài khoản mới</router-link>
                </div>
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

<style scoped>
@import '@/assets/styles/login-register';

/* CĂN ĐỀU ĐẸP CHO FORM ĐĂNG NHẬP */
.login-subtitle {
    text-align: center;
    color: #64748b;
    font-size: 1.05rem;
    margin: 0 0 2.5rem 0;
    font-weight: 500;
}

.input-group {
    margin-bottom: 1.5rem;
}

.input-group .form-control {
    height: 58px;
    border-radius: 16px;
    border: 1.8px solid #e2e8f0;
    padding: 0 1.5rem;
    font-size: 1.05rem;
    background: #fafafa;
    transition: all 0.3s;
}

.input-group .form-control:focus {
    border-color: #7c3aed;
    background: white;
    box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.15);
    outline: none;
}

.btn-login {
    height: 58px;
    border-radius: 16px;
    background: #1e293b;
    color: white;
    font-weight: 700;
    font-size: 1.15rem;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 0.8rem;
}

.btn-login:hover {
    background: #0f172a;
    transform: translateY(-2px);
}

.register-link {
    margin-top: 2rem;
    font-size: 1rem;
}
</style>