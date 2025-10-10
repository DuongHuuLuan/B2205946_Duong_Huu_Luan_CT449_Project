<template>
    <nav class="hv-header">
        <div class="hv-inner">
            <div class="hv-left">
                <RouterLink to="/" class="hv-brand">
                    Thư Viện
                </RouterLink>
            </div>

            <button class="hv-burger" @click="mobileOpen = !mobileOpen" aria-label="Open menu">
                <span class="burger-line" :class="{ open: mobileOpen }"></span>
                <span class="burger-line" :class="{ open: mobileOpen }"></span>
                <span class="burger-line" :class="{ open: mobileOpen }"></span>
            </button>

            <div :class="['hv-center', { 'open': mobileOpen }]" @click="mobileOpen = false">
                <RouterLink class="hv-link" :class="{ active: routeName === 'home' }" to="/">Trang chủ</RouterLink>
                <RouterLink class="hv-link" :class="{ active: routeName === 'sach.list' }" to="/sach">Sách</RouterLink>

                <RouterLink v-if="isAuthenticated && isDocGia" class="hv-link" to="/reader/borrowed"
                    :class="{ active: routeName === 'borrowed.list' }">
                    Phiếu Mượn
                </RouterLink>

                <RouterLink v-if="isAuthenticated && isStaff" class="hv-link" to="/admin">Quản trị</RouterLink>
            </div>

            <div class="hv-right">
                <template v-if="!isAuthenticated">
                    <RouterLink to="/login" class="hv-ghost">Đăng nhập</RouterLink>
                    <RouterLink to="/register" class="hv-primary">Đăng ký</RouterLink>
                </template>

                <template v-else>
                    <div class="hv-user">
                        <div class="hv-avatar">{{ userInitial }}</div>
                        <div class="hv-userinfo">
                            <div class="hv-name">{{ userDisplay }}</div>
                            <div class="hv-role">{{ userRole }}</div>
                        </div>
                        <button class="hv-logout" @click="logout">Đăng xuất</button>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="mobileOpen" class="hv-mobile-backdrop" @click="mobileOpen = false"></div>
    </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const mobileOpen = ref(false);

const isAuthenticated = computed(() => auth.isLoggedIn);
const user = computed(() => auth.user || {});

// LOGIC MỚI CHO TÊN: Ưu tiên HoLot + Ten, sau đó là MaDocGia
const userDisplay = computed(() => {
    if (user.value?.HoLot && user.value?.Ten) {
        return `${user.value.HoLot} ${user.value.Ten}`;
    }
    return user.value?.HoTenNV || user.value?.MaDocGia || "Người dùng";
});

// LOGIC MỚI CHO INITIAL: Lấy ký tự đầu tiên của Ten
const userInitial = computed(() =>
    (user.value?.Ten || user.value?.MaDocGia || "?").charAt(0).toUpperCase()
);

// SỬA ĐỔI QUAN TRỌNG: Xác định Độc giả bằng cách kiểm tra sự tồn tại của MaDocGia
const isDocGia = computed(() => !!user.value?.MaDocGia);

// LOGIC VAI TRÒ: Nếu là Độc giả (có MaDocGia) thì trả về "Độc giả", nếu không thì lấy ChucVu (cho nhân viên)
const userRole = computed(() => isDocGia.value ? "Độc giả" : (user.value?.ChucVu || ""));


// Logic kiểm tra Staff (Nhân viên/Admin) vẫn dựa vào ChucVu, đã được tối ưu hóa
const isStaff = computed(() =>
    ["admin", "quanly", "thuthu", "hotro"].includes((user.value?.ChucVu || "").toLowerCase())
);

const routeName = computed(() => route.name);

function logout() {
    auth.logout();
    router.push({ name: "login" });
    mobileOpen.value = false;
}
</script>

<style scoped>
/* Cập nhật CSS để hiển thị user info trên màn hình lớn */

.hv-header {
    border-bottom: 1px solid #e6e6f0;
    background: linear-gradient(180deg, #fff, #fbfbff);
    position: sticky;
    top: 0;
    z-index: 50;
}

.hv-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
}

/* brand */
.hv-brand {
    font-weight: 700;
    color: #334155;
    text-decoration: none;
    font-size: 18px;
    display: inline-block;
}

/* burger mobile */
.hv-burger {
    display: none;
    background: transparent;
    border: none;
    padding: 6px;
    cursor: pointer;
}

.burger-line {
    display: block;
    width: 18px;
    height: 2px;
    background: #475569;
    margin: 3px 0;
    transition: transform .18s, opacity .18s;
}

.burger-line.open:nth-child(1) {
    transform: translateY(5px) rotate(45deg);
}

.burger-line.open:nth-child(2) {
    opacity: 0;
}

.burger-line.open:nth-child(3) {
    transform: translateY(-5px) rotate(-45deg);
}

/* center nav */
.hv-center {
    display: flex;
    gap: 14px;
    align-items: center;
    flex: 1;
    margin-left: 16px;
}

.hv-link {
    color: #2563eb;
    text-decoration: none;
    font-size: 14px;
    padding: 6px 8px;
    border-radius: 6px;
}

.hv-link:hover {
    background: #f2f6ff;
    color: #12335a;
}

.hv-link.active {
    color: #6c5ce7;
    font-weight: 700;
}

/* right group */
.hv-right {
    display: flex;
    gap: 10px;
    align-items: center;
}

/* auth buttons */
.hv-ghost {
    color: #374151;
    text-decoration: none;
    padding: 6px 8px;
}

.hv-primary {
    background: #6c5ce7;
    color: white;
    padding: 7px 12px;
    border-radius: 8px;
    text-decoration: none;
}

/* user */
.hv-user {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 4px 10px 4px 4px;
    /* Thêm padding cho vùng user */
    border: 1px solid #e2e8f0;
    border-radius: 9999px;
}

.hv-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #eef2ff;
    color: #6c5ce7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
}

/* SỬA ĐỔI: Hiển thị user info mặc định */
.hv-userinfo {
    display: block;
    text-align: left;
    line-height: 1.2;
}

.hv-name {
    color: #1f2937;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
}

.hv-role {
    color: #9aa0c7;
    font-size: 11px;
    font-weight: 500;
}

.hv-logout {
    border: none;
    background: transparent;
    color: #ef4444;
    cursor: pointer;
    padding: 6px;
    margin-left: 5px;
    flex-shrink: 0;
}

/* mobile backdrop */
.hv-mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 12, 20, 0.35);
    z-index: 40;
}

/* responsive */
@media (max-width: 900px) {
    .hv-center {
        display: none;
    }

    .hv-burger {
        display: inline-block;
    }

    /* SỬA ĐỔI: Ẩn user info trên di động */
    .hv-userinfo {
        display: none;
    }

    .hv-user {
        border: none;
        padding: 0;
    }
}

/* mobile menu open: show center as column */
.hv-center.open {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: #fff;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 8px 20px rgba(20, 24, 60, 0.08);
    z-index: 45;
}

.hv-center.open .hv-link {
    padding: 10px;
    display: block;
    border-radius: 8px;
}
</style>