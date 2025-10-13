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

            <div :class="['hv-center', { open: mobileOpen }]" @click="mobileOpen = false">
                <RouterLink class="hv-link" :class="{ active: routeName === 'home' }" to="/">Trang chủ</RouterLink>
                <RouterLink class="hv-link" :class="{ active: routeName === 'sach.list' }" to="/sach">Sách</RouterLink>

                <!-- Link đến profile độc giả (chỉ hiển thị khi là Độc giả đã đăng nhập) -->
                <RouterLink v-if="isAuthenticated && isDocGia" class="hv-link"
                    :class="{ active: routeName === 'docgia.profile' }" :to="{ name: 'docgia.profile' }">
                    Hồ sơ của tôi
                </RouterLink>

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
                        <!-- Click avatar -> đến profile (nếu là độc giả) -->
                        <RouterLink v-if="isDocGia" :to="{ name: 'docgia.profile' }" class="hv-avatar-link"
                            title="Xem hồ sơ">
                            <div class="hv-avatar">{{ userInitial }}</div>
                        </RouterLink>

                        <!-- Nếu không phải độc giả vẫn show avatar không link -->
                        <div v-else class="hv-avatar">{{ userInitial }}</div>

                        <div class="hv-userinfo">
                            <!-- Tên dẫn tới profile nếu là độc giả -->
                            <RouterLink v-if="isDocGia" :to="{ name: 'docgia.profile' }" class="hv-name-link"
                                title="Xem hồ sơ">
                                <div class="hv-name">{{ userDisplay }}</div>
                                <div class="hv-role">{{ userRole }}</div>
                            </RouterLink>

                            <!-- Nếu không phải độc giả, chỉ show tên/role (nhân viên) -->
                            <div v-else>
                                <div class="hv-name">{{ userDisplay }}</div>
                                <div class="hv-role">{{ userRole }}</div>
                            </div>
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
import "@/assets/css/header.css";
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

// LOGIC MỚI CHO INITIAL: Lấy ký tự đầu tiên của Ten hoặc MaDocGia
const userInitial = computed(() =>
    (user.value?.Ten || user.value?.MaDocGia || "?").charAt(0).toUpperCase()
);

// Xác định Độc giả bằng cách kiểm tra sự tồn tại của MaDocGia
const isDocGia = computed(() => !!user.value?.MaDocGia);

// LOGIC VAI TRÒ: Nếu là Độc giả (có MaDocGia) thì trả về "Độc giả", nếu không thì lấy ChucVu (cho nhân viên)
const userRole = computed(() => (isDocGia.value ? "Độc giả" : (user.value?.ChucVu || "")));

// Logic kiểm tra Staff (Nhân viên/Admin) dựa vào ChucVu
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
