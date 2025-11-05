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

                <RouterLink v-if="isAuthenticated && isDocGia" class="hv-link"
                    :class="{ active: routeName === 'docgia.profile' }" :to="{ name: 'docgia.profile' }">
                    Hồ sơ của tôi
                </RouterLink>

                <RouterLink v-if="isAuthenticated && isDocGia" class="hv-link"
                    :class="{ active: routeName === 'borrowed.list' }" to="/reader/borrowed">
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
                        <RouterLink v-if="isDocGia" :to="{ name: 'docgia.profile' }" class="hv-avatar-link"
                            title="Xem hồ sơ">
                            <div class="hv-avatar">{{ userInitial }}</div>
                        </RouterLink>
                        <div v-else class="hv-avatar">{{ userInitial }}</div>

                        <div class="hv-userinfo">
                            <RouterLink v-if="isDocGia" :to="{ name: 'docgia.profile' }" class="hv-name-link"
                                title="Xem hồ sơ">
                                <div class="hv-name">{{ userDisplay }}</div>
                                <div class="hv-role">{{ userRole }}</div>
                            </RouterLink>
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

const userDisplay = computed(() => {
    if (user.value?.HoLot && user.value?.Ten) {
        return `${user.value.HoLot} ${user.value.Ten}`;
    }
    return user.value?.HoTenNV || user.value?.MaDocGia || "Người dùng";
});

const userInitial = computed(() =>
    (user.value?.Ten || user.value?.MaDocGia || "?").charAt(0).toUpperCase()
);

const isDocGia = computed(() => !!user.value?.MaDocGia);

const userRole = computed(() => (isDocGia.value ? "Độc giả" : (user.value?.ChucVu || "")));

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