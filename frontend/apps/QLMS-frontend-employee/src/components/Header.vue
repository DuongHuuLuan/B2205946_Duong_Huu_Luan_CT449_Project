<!-- <template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg sticky-top border-bottom border-secondary">
        <div class="container-fluid">
            <RouterLink class="navbar-brand fw-bold fs-5 text-warning" to="/">
                <i class="fas fa-book-open me-2"></i> QL Mượn Sách
            </RouterLink>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto" v-if="authStore.isAuthenticated">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/docgia">
                            <i class="fas fa-user-friends me-1"></i> Độc giả
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/sach">
                            <i class="fas fa-book me-1"></i> Sách
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/nhaxuatban">
                            <i class="fas fa-industry me-1"></i> NXB
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/theodoimuonsach">
                            <i class="fas fa-exchange-alt me-1"></i> Theo dõi Mượn
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/nhanvien">
                            <i class="fas fa-user-tie me-1"></i> Nhân viên
                        </RouterLink>
                    </li>

                    <li class="nav-item" v-if="isAdminOrManager">
                        <RouterLink class="nav-link text-info fw-bold" to="/thongke">
                            <i class="fas fa-chart-bar me-1"></i> THỐNG KÊ
                        </RouterLink>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto">
                    <template v-if="authStore.isAuthenticated">
                        <li class="nav-item me-3 d-flex align-items-center">
                            <span class="nav-link text-white bg-secondary px-3 rounded-pill fw-bold">
                                <i class="fas fa-user-circle me-1"></i>
                                {{ authStore.user.HoTenNV || authStore.user.MSNV }} ({{ authStore.user.ChucVu }})
                            </span>
                        </li>
                        <li class="nav-item d-flex align-items-center">
                            <button @click="handleLogout" class="btn btn-danger btn-sm">
                                <i class="fas fa-sign-out-alt me-1"></i> Đăng Xuất
                            </button>
                        </li>
                    </template>

                    <template v-else>
                        <li class="nav-item">
                            <RouterLink class="btn btn-success" to="/login">
                                <i class="fas fa-sign-in-alt me-1"></i> Đăng Nhập Hệ Thống
                            </RouterLink>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { computed } from "vue";

const router = useRouter();
const authStore = useAuthStore();
const isAdminOrManager = computed(() => {
    if (!authStore.user) {
        return false;
    }
    const role = authStore.user.ChucVu;
    return role === 'Admin' || role === 'QuanLy';
});


function handleLogout() {
    authStore.logout();
    router.push({ name: 'login' });
}
</script>

<style scoped>
/* Giảm bớt CSS tùy chỉnh, giữ lại logic hover */
.navbar-brand {
    letter-spacing: 1px;
}

/* Đảm bảo màu hover nổi bật trên nền tối */
.navbar-nav .nav-link:hover {
    color: var(--bs-info) !important;
    /* Đổi màu hover thành màu sáng hơn (info/warning) */
}
</style> -->

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg sticky-top border-bottom border-secondary">
        <div class="container-fluid">
            <RouterLink class="navbar-brand fw-bold fs-5 text-warning" to="/">
                <i class="fas fa-book-open me-2"></i> Quản Lý Mượn Sách
            </RouterLink>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto" v-if="authStore.isAuthenticated">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/docgia">
                            <i class="fas fa-user-friends me-1"></i> Độc giả
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/sach">
                            <i class="fas fa-book me-1"></i> Sách
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/nhaxuatban">
                            <i class="fas fa-industry me-1"></i> NXB
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/theodoimuonsach">
                            <i class="fas fa-exchange-alt me-1"></i> Theo dõi Mượn
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/nhanvien">
                            <i class="fas fa-user-tie me-1"></i> Nhân viên
                        </RouterLink>
                    </li>
                    <li class="nav-item" v-if="isAdminOrManager">
                        <RouterLink class="nav-link text-info fw-bold" to="/thongke">
                            <i class="fas fa-chart-bar me-1"></i> THỐNG KÊ
                        </RouterLink>
                    </li>
                </ul>

                <ul class="navbar-nav ms-auto">
                    <template v-if="authStore.isAuthenticated">
                        <li class="nav-item me-2 d-flex align-items-center">
                            <span class="nav-link text-white bg-secondary px-3 rounded-pill fw-bold">
                                <i class="fas fa-user-circle me-1"></i>
                                {{ authStore.user.HoTenNV || authStore.user.MSNV }} ({{ authStore.user.ChucVu }})
                            </span>
                        </li>
                        <li class="nav-item d-flex align-items-center">
                            <button @click="handleLogout" class="btn btn-danger btn-sm">
                                <i class="fas fa-sign-out-alt me-1"></i> Đăng Xuất
                            </button>
                        </li>
                    </template>

                    <template v-else>
                        <li class="nav-item">
                            <RouterLink class="btn btn-success" to="/login">
                                <i class="fas fa-sign-in-alt me-1"></i> Đăng Nhập Hệ Thống
                            </RouterLink>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { computed } from "vue";

const router = useRouter();
const authStore = useAuthStore();

const isAdminOrManager = computed(() => {
    if (!authStore.user) {
        return false;
    }
    const role = authStore.user.ChucVu;
    return role === 'Admin' || role === 'QuanLy';
});


function handleLogout() {
    authStore.logout();
    router.push({ name: 'login' });
}
</script>

<style scoped>
.navbar-brand {
    letter-spacing: 1px;
}

.navbar-nav .nav-link:hover {
    color: var(--bs-info) !important;
}
</style>