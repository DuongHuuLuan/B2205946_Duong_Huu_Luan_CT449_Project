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

            <div v-if="isAuthenticated" :class="['hv-center', { open: mobileOpen }]" @click="mobileOpen = false">
                <RouterLink class="hv-link" :class="{ active: routeName === 'home' }" to="/">Trang chủ</RouterLink>
                <RouterLink class="hv-link" :class="{ active: routeName === 'sach.list' }" to="/sach">Sách</RouterLink>

                <RouterLink v-if="isDocGia" class="hv-link" :class="{ active: routeName === 'docgia.profile' }"
                    :to="{ name: 'docgia.profile' }">
                    Hồ sơ của tôi
                </RouterLink>

                <RouterLink v-if="isDocGia" class="hv-link" :class="{ active: routeName === 'borrowed.list' }"
                    to="/reader/borrowed">
                    Phiếu Mượn
                </RouterLink>

                <RouterLink v-if="isStaff" class="hv-link" to="/admin">Quản trị</RouterLink>
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
                            <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="Avatar" class="hv-avatar-img" />
                            <div v-else class="hv-avatar">{{ userInitial }}</div>
                        </RouterLink>
                        <div v-else class="hv-avatar-wrapper">
                            <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="Avatar" class="hv-avatar-img" />
                            <div v-else class="hv-avatar">{{ userInitial }}</div>
                        </div>

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

// --> LOGIC MỚI CHO AVATAR URL <--
const userAvatarUrl = computed(() => {
    // Giả sử tên trường trong đối tượng user là 'Avatar'
    return user.value?.Avatar || user.value?.avatarUrl || null;
});
// ----------------------------------

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

<style scoped>
/* Lưu ý: Phần lớn CSS được đặt trong "@/assets/css/header.css".
    Đây là style bổ sung/ghi đè cho ảnh Avatar.
*/

/* Đảm bảo ảnh Avatar có kích thước và hình dạng giống hệt div hv-avatar cũ */
.hv-avatar-img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
}

/* Ghi đè hiệu ứng hover cho link bao quanh ảnh Avatar của Độc Giả */
.hv-avatar-link:hover .hv-avatar-img {
    border-color: #f3f4f6;
    /* Màu nhạt khi hover */
}

/* Wrapper cho staff/default avatar để căn chỉnh nếu cần */
.hv-avatar-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
}

/* Đảm bảo hv-avatar (chữ cái đầu) giữ nguyên style cũ */
.hv-avatar {
    /* (Giả định style này đã có trong header.css: background, text-color, v.v.) */
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    background-color: #3b82f6;
    /* Ví dụ: blue-500 */
    color: white;
}
</style>