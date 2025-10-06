<!-- <template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow-lg">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">Đăng Ký Tài Khoản Nhân Viên</h4>
                    </div>
                    <div class="card-body">
                        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

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
                                <input type="password" id="password" class="form-control" v-model="user.Password"
                                    required />
                            </div>

                            <div class="mb-3">
                                <label for="chucvu" class="form-label">Chức Vụ:</label>
                                <input type="text" id="chucvu" class="form-control" v-model="user.Chucvu" />
                            </div>

                            <div class="mb-3">
                                <label for="diachi" class="form-label">Địa Chỉ:</label>
                                <input type="text" id="diachi" class="form-control" v-model="user.Diachi" />
                            </div>

                            <div class="mb-3">
                                <label for="sdt" class="form-label">Số Điện Thoại:</label>
                                <input type="tel" id="sdt" class="form-control" v-model="user.SoDienThoai" />
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Đăng Ký</button>
                        </form>

                        <p class="mt-3 text-center">
                            Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service"; //Nhập Frontend Service

export default {
    name: "Register",
    data() {
        return {
            user: {
                MSNV: "",
                HoTenNV: "",
                Password: "",
                Chucvu: "",
                Diachi: "",
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
                // Lọc bỏ các trường rỗng không cần thiết
                const payload = Object.fromEntries(
                    Object.entries(this.user).filter(([_, v]) => v !== "")
                );

                // Gọi hàm register từ Frontend AuthService
                const response = await AuthService.register(payload);

                this.successMessage = response.message || "Đăng ký thành công!";

                // Chuyển hướng sau 1.5 giây
                setTimeout(() => {
                    this.$router.push({ name: "login" });
                }, 1500);

            } catch (error) {
                // Xử lý lỗi từ Backend (ví dụ: "MSNV already exists")
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
</script> -->




<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <RegisterForm />
            </div>
        </div>
    </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue';

export default {
    name: "Register",
    components: { RegisterForm },
};
</script>