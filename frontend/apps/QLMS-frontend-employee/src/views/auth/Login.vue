<!-- <template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-5">
                <div class="card shadow-lg">
                    <div class="card-header bg-success text-white">
                        <h4 class="mb-0">Đăng Nhập Tài Khoản</h4>
                    </div>
                    <div class="card-body">
                        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

                        <form @submit.prevent="handleLogin">

                            <div class="mb-3">
                                <label for="msnv" class="form-label">Mã Số NV:</label>
                                <input type="text" id="msnv" class="form-control" v-model="credentials.MSNV" required />
                            </div>

                            <div class="mb-3">
                                <label for="password" class="form-label">Mật Khẩu:</label>
                                <input type="password" id="password" class="form-control" v-model="credentials.Password"
                                    required />
                            </div>

                            <button type="submit" class="btn btn-success w-100">Đăng Nhập</button>
                        </form>

                        <p class="mt-3 text-center">
                            Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AuthService from "@/services/auth.service";
import { useAuthStore } from "@/stores/authStore";
import LoginForm from "@/components/LoginForm.vue";
export default {
    name: "Login",
    components: { LoginForm },
    data() {
        return {
            credentials: {
                MSNV: "",
                Password: "",
            },
            errorMessage: "",
        };
    },
    methods: {
        async handleLogin() {
            this.errorMessage = "";

            try {
                // 1. Gọi hàm login từ Frontend AuthService
                const response = await AuthService.login(this.credentials);
                const authStore = useAuthStore(); // Khởi tạo Store

                // 2. Lưu token vào localStorage
                AuthService.saveToken(response.token);

                // 3. LƯU THÔNG TIN USER VÀO PINIA STORE
                // Lưu user và đặt trạng thái isLoggedIn = true
                authStore.setUser(response.user);

                // 4. Chuyển hướng đến trang chính
                // Đảm bảo route "nxb:list" tồn tại trong Vue Router
                this.$router.push({ name: "home" });

            } catch (error) {
                // Xử lý lỗi từ Backend (ví dụ: Sai MSNV hoặc mật khẩu)
                const serverError = error.response && error.response.data.message;

                if (serverError) {
                    // Hiển thị lỗi cụ thể từ Server (ví dụ: "Sai MSNV hoặc mật khẩu")
                    this.errorMessage = serverError;
                } else {
                    // Lỗi kết nối mạng hoặc lỗi không xác định
                    this.errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
                }
                console.error("Lỗi đăng nhập:", error);
            }
        },
    },
};
</script> -->

<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <!-- Gọi component LoginForm -->
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from "@/components/auth/LoginForm.vue";

export default {
    name: "login",
    components: { LoginForm },
};
</script>
