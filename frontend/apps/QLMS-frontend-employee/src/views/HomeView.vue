<template>
    <div class="welcome-container d-flex flex-column align-items-center justify-content-center text-center p-5">
        <div class="welcome-card card shadow-lg p-5">
            <div class="card-body">
                <h1 class="display-4 fw-bold text-primary mb-4 animate__animated animate__fadeInDown">
                    Chào mừng, {{ userFullName }}
                </h1>
                <p class="lead text-muted animate__animated animate__fadeInUp">
                    Hệ thống quản lý thư viện của bạn đã sẵn sàng.
                </p>
                <p class="text-secondary animate__animated animate__fadeInUp animate__delay-1s">
                    Khám phá các tính năng quản lý sách, độc giả, và nhân viên ngay bây giờ.
                </p>

                <div class="row mt-5 gx-4 gy-4">
                    <div class="col-md-4 animate__animated animate__zoomIn">
                        <div class="feature-box p-4 rounded shadow-sm">
                            <i class="fas fa-book-open fa-3x text-info mb-3"></i>
                            <h5 class="fw-bold">Quản lý Sách</h5>
                            <p class="text-muted">Thêm, sửa, xóa thông tin sách.</p>
                            <RouterLink :to="{ name: 'sach.list' }" class="btn btn-outline-info btn-sm mt-2">
                                Chi tiết
                            </RouterLink>
                        </div>
                    </div>

                    <div class="col-md-4 animate__animated animate__zoomIn animate__delay-1s">
                        <div class="feature-box p-4 rounded shadow-sm">
                            <i class="fas fa-users fa-3x text-success mb-3"></i>
                            <h5 class="fw-bold">Quản lý Độc giả</h5>
                            <p class="text-muted">Quản lý hồ sơ và thẻ độc giả.</p>
                            <RouterLink :to="{ name: 'docgia.list' }" class="btn btn-outline-success btn-sm mt-2">
                                Chi tiết
                            </RouterLink>
                        </div>
                    </div>

                    <div class="col-md-4 animate__animated animate__zoomIn animate__delay-2s">
                        <div class="feature-box p-4 rounded shadow-sm">
                            <i class="fas fa-exchange-alt fa-3x text-warning mb-3"></i>
                            <h5 class="fw-bold">Theo dõi Mượn sách</h5>
                            <p class="text-muted">Quản lý việc mượn và trả sách.</p>
                            <RouterLink :to="{ name: 'theodoimuonsach.list' }"
                                class="btn btn-outline-warning btn-sm mt-2">
                                Chi tiết
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import "@/assets/HomePage.css";
export default {
    computed: {
        userFullName() {
            const authStore = useAuthStore();
            return authStore.user?.HoTenNV || 'Bạn';
        }
    }
};
</script>
