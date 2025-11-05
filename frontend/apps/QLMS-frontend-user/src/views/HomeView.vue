<template>
    <div class="page-wrapper">
        <div class="home-container">
            <!-- Tiêu đề và lời chào -->
            <header class="home-header">
                <h1 class="header-title">
                    <svg xmlns="http://www.w3.org/2000/svg" class="header-icon" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path
                            d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13M4 19h16M4 19a2 2 0 002 2h12a2 2 0 002-2M8 6v1M16 6v1" />
                    </svg>
                    Chào mừng, Độc Giả {{ currentUser.HoTen || currentUser.MaDocGia }}
                </h1>
                <p class="header-subtitle">Trang tổng quan về hoạt động mượn sách của bạn.</p>
            </header>

            <!-- Loading / Error State -->
            <div v-if="isLoading" class="state-message loading-state">
                <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="loading-text">Đang tải thông tin tài khoản...</p>
            </div>

            <div v-else-if="error" class="state-message error-state" role="alert">
                <p class="error-title">Lỗi tải dữ liệu</p>
                <p>{{ error }}</p>
            </div>

            <!-- Nội dung chính (Hiển thị sau khi tải xong) -->
            <div v-else class="main-content-grid">
                <!-- Thông tin cá nhân -->
                <div class="info-card personal-info-card">
                    <h2 class="card-title info-title">Thông tin tài khoản</h2>
                    <dl class="info-list">
                        <div class="info-row">
                            <dt class="info-label">Mã Độc Giả</dt>
                            <dd class="info-value">{{ currentUser.MaDocGia }}</dd>
                        </div>
                        <div class="info-row">
                            <dt class="info-label">Họ và Tên</dt>
                            <dd class="info-value">{{ currentUser.HoLot }} {{ currentUser.Ten }}</dd>
                        </div>
                        <div class="info-row">
                            <dt class="info-label">Điện thoại</dt>
                            <dd class="info-value">{{ currentUser.DienThoai }}</dd>
                        </div>
                        <div class="info-row">
                            <dt class="info-label">Địa chỉ</dt>
                            <dd class="info-value">{{ currentUser.DiaChi }}</dd>
                        </div>
                    </dl>
                    <router-link to="/docgia/profile" class="update-link">
                        Cập nhật thông tin →
                    </router-link>
                </div>

                <!-- Các thẻ thống kê nhanh -->
                <div class="stats-grid">
                    <!-- Sách đang mượn -->
                    <div class="stat-card border-yellow">
                        <div class="stat-content">
                            <div class="stat-icon-wrapper yellow-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stat-icon yellow-text" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332-.477-4.5-1.253" />
                                </svg>
                            </div>
                            <div class="stat-details">
                                <p class="stat-label">Sách đang mượn</p>
                                <p class="stat-value">{{ stat.dangMuon }}</p>
                            </div>
                        </div>
                        <router-link to="/reader/borrowed" class="stat-link yellow-text-link">
                            Xem chi tiết →
                        </router-link>
                    </div>

                    <!-- Phiếu mượn Chờ duyệt -->
                    <div class="stat-card border-indigo">
                        <div class="stat-content">
                            <div class="stat-icon-wrapper indigo-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stat-icon indigo-text" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 3.04A12.012 12.012 0 003 12c0 3.072 1.146 5.945 3.03 8.188A11.99 11.99 0 0012 22c4.257 0 8.072-2.19 10.26-5.556l-1.64-1.64c-1.205 1.055-2.618 1.83-4.12 2.215a7.986 7.986 0 01-8.5-14.86c1.543-.37 3.125-.49 4.71-.345" />
                                </svg>
                            </div>
                            <div class="stat-details">
                                <p class="stat-label">Phiếu chờ duyệt</p>
                                <p class="stat-value">{{ stat.choDuyet }}</p>
                            </div>
                        </div>
                        <router-link to="/reader/borrowed" class="stat-link indigo-text-link">
                            Xem chi tiết →
                        </router-link>
                    </div>

                    <!-- Sách Trễ hạn -->
                    <div class="stat-card border-red">
                        <div class="stat-content">
                            <div class="stat-icon-wrapper red-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stat-icon red-text" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="stat-details">
                                <p class="stat-label">Sách trễ hạn</p>
                                <p class="stat-value">{{ stat.treHan }}</p>
                            </div>
                        </div>
                        <router-link to="/reader/borrowed" class="stat-link red-text-link">
                            Giải quyết ngay →
                        </router-link>
                    </div>

                    <!-- Tổng sách đã mượn -->
                    <div class="stat-card border-green">
                        <div class="stat-content">
                            <div class="stat-icon-wrapper green-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stat-icon green-text" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div class="stat-details">
                                <p class="stat-label">Tổng sách đã mượn</p>
                                <p class="stat-value">{{ stat.tongSachDaMuon }}</p>
                            </div>
                        </div>
                        <router-link to="/reader/borrowed" class="stat-link green-text-link">
                            Lịch sử mượn →
                        </router-link>
                    </div>
                </div>

                <!-- Khu vực thông báo (Tùy chọn) -->
                <div class="full-width-section info-card notification-card">
                    <h2 class="card-title notification-title">Thông báo quan trọng</h2>
                    <div class="notification-box">
                        <svg xmlns="http://www.w3.org/2000/svg" class="notification-icon" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="notification-text">
                            Vui lòng kiểm tra mục **"Sách đang mượn"** thường xuyên. Nếu bạn đã hoàn tất việc trả sách
                            tại thư viện, hãy đảm bảo trạng thái đã được cập nhật thành **"Đã trả"**.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DocGiaService from "@/services/docgia.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user || {});

const isLoading = ref(true);
const error = ref(null);
const borrowList = ref([]);
const stat = ref({
    dangMuon: 0,
    choDuyet: 0,
    treHan: 0,
    tongSachDaMuon: 0,
});

async function fetchBorrowData() {
    isLoading.value = true;
    error.value = null;
    try {
        if (!currentUser.value.MaDocGia) {
            throw new Error("Không tìm thấy Mã Độc Giả. Vui lòng đăng nhập lại.");
        }

        const response = await TheoDoiMuonSachService.findByDocGia();
        borrowList.value = response;

        let totalBorrowed = 0;
        let dangMuonCount = 0;
        let choDuyetCount = 0;
        let treHanCount = 0;

        borrowList.value.forEach(item => {
            totalBorrowed += item.ChiTietMuon.reduce((sum, book) => sum + book.SoLuong, 0);

            if (item.TrangThai === 'Đang mượn' || item.TrangThai === 'Yêu cầu trả') {
                dangMuonCount++;
            } else if (item.TrangThai === 'Chờ duyệt') {
                choDuyetCount++;
            } else if (item.TrangThai === 'Trễ hạn') {
                treHanCount++;
            }
        });

        stat.value = {
            dangMuon: dangMuonCount,
            choDuyet: choDuyetCount,
            treHan: treHanCount,
            tongSachDaMuon: totalBorrowed,
        };

    } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        error.value = err.response?.data?.message || "Không thể tải dữ liệu mượn sách. Vui lòng kiểm tra kết nối API.";
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    if (currentUser.value.MaDocGia) {
        fetchBorrowData();
    } else {
        isLoading.value = false;
        error.value = "Thông tin độc giả chưa sẵn sàng.";
    }
});
</script>

<style scoped>
.home-container {
    padding: 1.5rem 1rem;
    min-height: 100vh;
    /* Đảm bảo chiếm toàn bộ chiều cao màn hình */
}

.page-wrapper {
    min-height: 100vh;
    /* Đảm bảo toàn bộ màn hình được phủ */
    background-color: #FFF2D7;
    /* Áp dụng màu nền trực tiếp */
}

/* HEADER */
.home-header {
    margin-bottom: 2rem;
}

.header-title {
    font-size: 1.875rem;
    /* 3xl */
    font-weight: 700;
    /* bold */
    color: #111827;
    /* gray-900 */
    display: flex;
    align-items: center;
}

@media (min-width: 640px) {
    .header-title {
        font-size: 2.25rem;
        /* 4xl */
    }
}

.header-icon {
    height: 2rem;
    width: 2rem;
    color: #4f46e5;
    /* indigo-600 */
    margin-right: 0.75rem;
}

.header-subtitle {
    margin-top: 0.5rem;
    font-size: 1.125rem;
    color: #4b5563;
}

/* STATE MESSAGES (Loading/Error) */
.state-message {
    text-align: center;
    padding: 2.5rem 0;
}

.loading-state .loading-spinner {
    animation: spin 1s linear infinite;
    height: 2rem;
    width: 2rem;
    color: #6366f1;
    /* indigo-500 */
    margin: 0 auto;
    display: block;
}

.loading-state .loading-text {
    margin-top: 1rem;
    color: #4b5563;
    /* gray-600 */
}

.error-state {
    background-color: #fee2e2;
    /* red-100 */
    border-left: 4px solid #ef4444;
    /* red-500 */
    color: #b91c1c;
    /* red-700 */
    padding: 1rem;
    border-radius: 0.5rem;
}

.error-state .error-title {
    font-weight: 700;
}

/* MAIN CONTENT GRID */
.main-content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .main-content-grid {
        grid-template-columns: 1fr 2fr;
        /* 1 col for info, 2 cols for stats */
    }

    .personal-info-card {
        grid-column: span 1;
    }

    .stats-grid {
        grid-column: span 2;
    }

    .full-width-section {
        grid-column: span 3;
    }
}

/* INFO CARD BASE STYLE */
.info-card {
    background-color: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    /* shadow-xl */
    border-radius: 0.75rem;
    /* rounded-xl */
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    /* border-gray-200 */
    height: fit-content;
}

.card-title {
    font-size: 1.25rem;
    /* xl */
    font-weight: 600;
    /* semibold */
    color: #4f46e5;
    /* indigo-600 */
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
}

.personal-info-card .card-title {
    font-size: 1.5rem;
    /* 2xl */
}

/* INFO LIST */
.info-list {
    border-top: 1px solid #f3f4f6;
    /* divide-y divide-gray-100 */
}

.info-row {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
}

@media (min-width: 640px) {
    .info-row {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
}

.info-label {
    font-size: 0.875rem;
    /* sm */
    font-weight: 500;
    /* medium */
    color: #6b7280;
    /* gray-500 */
}

.info-value {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    /* sm */
    color: #111827;
    /* gray-900 */
}

@media (min-width: 640px) {
    .info-value {
        grid-column: span 2;
        margin-top: 0;
    }
}

.update-link {
    margin-top: 1.5rem;
    display: block;
    text-align: center;
    color: #4f46e5;
    /* indigo-600 */
    font-weight: 500;
    transition: color 0.15s ease-in-out;
}

.update-link:hover {
    color: #3730a3;
    /* indigo-800 */
}

/* STATS GRID */
.stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 640px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* STAT CARD */
.stat-card {
    background-color: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 0.75rem;
    padding: 1.5rem;
    border-left: 4px solid;
}

.border-yellow {
    border-left-color: #f59e0b;
    /* yellow-500 */
}

.border-indigo {
    border-left-color: #6366f1;
    /* indigo-500 */
}

.border-red {
    border-left-color: #ef4444;
    /* red-500 */
}

.border-green {
    border-left-color: #10b981;
    /* green-500 */
}

.stat-content {
    display: flex;
    align-items: center;
}

.stat-icon-wrapper {
    padding: 0.75rem;
    border-radius: 9999px;
    /* full rounded */
}

.yellow-bg {
    background-color: #fffbeb;
    /* yellow-100 */
}

.indigo-bg {
    background-color: #eef2ff;
    /* indigo-100 */
}

.red-bg {
    background-color: #fee2e2;
    /* red-100 */
}

.green-bg {
    background-color: #ecfdf5;
    /* green-100 */
}

.stat-icon {
    height: 1.5rem;
    width: 1.5rem;
}

.yellow-text {
    color: #d97706;
    /* yellow-600 */
}

.indigo-text {
    color: #4f46e5;
    /* indigo-600 */
}

.red-text {
    color: #dc2626;
    /* red-600 */
}

.green-text {
    color: #059669;
    /* green-600 */
}

.stat-details {
    margin-left: 1rem;
}

.stat-label {
    font-size: 0.875rem;
    /* sm */
    font-weight: 500;
    color: #6b7280;
    /* gray-500 */
}

.stat-value {
    font-size: 1.875rem;
    /* 3xl */
    font-weight: 700;
    color: #111827;
    /* gray-900 */
}

.stat-link {
    margin-top: 1rem;
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.15s ease-in-out;
}

.yellow-text-link {
    color: #d97706;
}

.yellow-text-link:hover {
    color: #b45309;
    /* yellow-800 */
}

.indigo-text-link {
    color: #4f46e5;
}

.indigo-text-link:hover {
    color: #3730a3;
    /* indigo-800 */
}

.red-text-link {
    color: #dc2626;
}

.red-text-link:hover {
    color: #991b1b;
    /* red-800 */
}

.green-text-link {
    color: #059669;
}

.green-text-link:hover {
    color: #065f46;
    /* green-800 */
}

/* NOTIFICATION SECTION */
.notification-card {
    margin-top: 1rem;
}

.notification-title {
    color: #374151;
    /* gray-700 */
}

.notification-box {
    display: flex;
    align-items: flex-start;
    padding: 0.75rem;
    background-color: #eff6ff;
    /* blue-50 */
    border-radius: 0.5rem;
}

.notification-icon {
    height: 1.5rem;
    width: 1.5rem;
    color: #3b82f6;
    /* blue-500 */
    flex-shrink: 0;
    margin-top: 0.25rem;
}

.notification-text {
    margin-left: 0.75rem;
    font-size: 0.875rem;
    /* sm */
    color: #1e40af;
    /* blue-800 */
}

/* Keyframe for loading spinner */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>