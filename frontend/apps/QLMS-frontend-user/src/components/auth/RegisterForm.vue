<!-- <template>
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
</style> -->

<template>
    <div class="auth-page register-page">
        <div class="auth-container">
            <!-- Bên trái -->
            <div class="auth-left">
                <h1>Khám phá<br>Thế giới<br>Tri Thức</h1>
                <p>Học hỏi, kết nối, và phát triển không ngừng</p>
            </div>

            <!-- Bên phải -->
            <div class="auth-right">
                <h2>THƯ VIỆN TRỰC TUYẾN</h2>

                <!-- Progress Bar 2 bước -->
                <div class="register-steps">
                    <div class="step" :class="{ active: step === 1 }">
                        <div class="step-number">1</div>
                        <span>Tài khoản</span>
                        <div class="step-line"></div>
                    </div>
                    <div class="step" :class="{ active: step === 2 }">
                        <div class="step-number">2</div>
                        <span>Cá nhân</span>
                    </div>
                </div>

                <p class="step-desc">Chỉ với 2 bước đơn giản để tham gia cộng đồng</p>

                <form @submit.prevent="handleRegister" class="auth-form">

                    <!-- BƯỚC 1: Tài khoản -->
                    <div v-if="step === 1">
                        <div class="row g-3">
                            <div class="col-md-7">
                                <input type="text" class="form-control" placeholder="Họ lót *" v-model="form.HoLot"
                                    required />
                            </div>
                            <div class="col-md-5">
                                <input type="text" class="form-control" placeholder="Tên *" v-model="form.Ten"
                                    required />
                            </div>
                        </div>

                        <input type="text" class="form-control mt-3" placeholder="Mã Độc Giả *" v-model="form.MaDocGia"
                            required />

                        <input type="password" class="form-control mt-3" placeholder="Mật khẩu *"
                            v-model="form.Password" required />
                        <input type="password" class="form-control mt-3" placeholder="Nhập lại mật khẩu *"
                            v-model="form.ConfirmPassword" required />

                        <div class="btn-group mt-4">
                            <button type="button" class="btn-back" @click="$router.push('/login')">Quay lại</button>
                            <button type="button" class="btn-register" @click="nextStep">Tiếp theo</button>
                        </div>
                    </div>

                    <!-- BƯỚC 2: Thông tin cá nhân -->
                    <div v-if="step === 2">
                        <div class="mb-4">
                            <label class="form-label fw-semibold text-dark">Giới tính *</label>
                            <div class="d-flex gap-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="nam" value="Nam"
                                        v-model="form.Phai" required />
                                    <label class="form-check-label" for="nam">Nam</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="nu" value="Nữ" v-model="form.Phai"
                                        required />
                                    <label class="form-check-label" for="nu">Nữ</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" id="khac" value="Khác"
                                        v-model="form.Phai" />
                                    <label class="form-check-label" for="khac">Khác</label>
                                </div>
                            </div>
                        </div>

                        <input type="date" class="form-control" v-model="form.NgaySinh" required />
                        <input type="text" class="form-control mt-3" placeholder="Ví dụ: 123 Đường ABC, Quận XYZ"
                            v-model="form.DiaChi" />
                        <input type="text" class="form-control mt-3" placeholder="Ví dụ: 0901234567"
                            v-model="form.DienThoai" />

                        <div class="btn-group mt-4">
                            <button type="button" class="btn-back" @click="step = 1">Quay lại</button>
                            <button type="submit" class="btn-register">Đăng ký tài khoản</button>
                        </div>
                    </div>

                </form>

                <div class="register-link">
                    Đã có tài khoản? <router-link to="/login">Đăng nhập ngay</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/auth.service'
import Swal from 'sweetalert2'

const router = useRouter()
const step = ref(1)
const loading = ref(false)

const form = reactive({
    MaDocGia: '',
    HoLot: '',
    Ten: '',
    Phai: 'Nam',
    NgaySinh: '',
    DiaChi: '',
    DienThoai: '',
    Password: '',
    ConfirmPassword: ''
})

const nextStep = () => {
    if (!form.HoLot || !form.Ten || !form.MaDocGia || !form.Password) {
        Swal.fire('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc', 'warning')
        return
    }
    if (form.Password.length < 6) {
        Swal.fire('Mật khẩu yếu', 'Mật khẩu phải có ít nhất 6 ký tự', 'warning')
        return
    }
    if (form.Password !== form.ConfirmPassword) {
        Swal.fire('Lỗi', 'Mật khẩu nhập lại không khớp!', 'error')
        return
    }
    step.value = 2
}

const handleRegister = async () => {
    if (!form.NgaySinh) {
        Swal.fire('Thiếu thông tin', 'Vui lòng chọn ngày sinh', 'warning')
        return
    }

    loading.value = true

    try {
        await AuthService.register({
            MaDocGia: form.MaDocGia.trim(),
            HoLot: form.HoLot.trim(),
            Ten: form.Ten.trim(),
            Phai: form.Phai,
            NgaySinh: form.NgaySinh,
            DiaChi: form.DiaChi || null,
            DienThoai: form.DienThoai || null,
            Password: form.Password
        })

        // Thông báo đẹp + tự động chuyển sang trang đăng nhập sau 2 giây
        await Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            text: 'Chuyển đến trang đăng nhập trong giây lát...',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        })

        // CHUYỂN NGAY VỀ TRANG ĐĂNG NHẬP
        router.push('/login')

    } catch (err) {
        const msg = err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại'
        let title = 'Lỗi'

        if (err.response?.status === 409 || msg.includes('tồn tại')) {
            title = 'Mã độc giả đã được sử dụng!'
        }

        Swal.fire(title, msg, 'error')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@import '@/assets/styles/login-register.css';

/* Đẹp hóa giao diện */
.step-desc {
    text-align: center;
    color: #10b981;
    font-size: 0.95rem;
    margin: 0.5rem 0 1.8rem;
    font-weight: 500;
}

.register-steps {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    margin-bottom: 1rem;
}

.step-line {
    flex: 1;
    height: 3px;
    background: #e2e8f0;
    border-radius: 2px;
}

.step.active .step-line {
    background: #10b981;
}

.step-number {
    width: 40px;
    height: 40px;
    background: #e2e8f0;
    color: #64748b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
}

.step.active .step-number {
    background: #10b981;
    color: white;
}

.form-check-input:checked {
    background-color: #1e293b;
    border-color: #1e293b;
}
</style>