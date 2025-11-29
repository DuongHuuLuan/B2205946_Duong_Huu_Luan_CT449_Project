<template>
    <nav class="hv-header">
        <div class="hv-inner">
            <!-- Logo -->
            <div class="hv-left">
                <RouterLink to="/" class="hv-brand">Thư Viện</RouterLink>
            </div>

            <!-- Burger menu (mobile) -->
            <button class="hv-burger" @click="mobileOpen = !mobileOpen" aria-label="Open menu">
                <span class="burger-line" :class="{ open: mobileOpen }"></span>
                <span class="burger-line" :class="{ open: mobileOpen }"></span>
                <span class="burger-line" :class="{ open: mobileOpen }"></span>
            </button>

            <!-- Menu chính (chỉ hiện khi đã đăng nhập) -->
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

            <!-- Phần bên phải: Đăng nhập / Avatar + Dropdown -->
            <div class="hv-right">
                <!-- Chưa đăng nhập -->
                <template v-if="!isAuthenticated">
                    <RouterLink to="/login" class="hv-ghost">Đăng nhập</RouterLink>
                    <RouterLink to="/register" class="hv-primary">Đăng ký</RouterLink>
                </template>

                <!-- Đã đăng nhập → Dropdown hiện đại -->
                <template v-else>
                    <div class="hv-user-dropdown" ref="dropdownRef">
                        <!-- Nút chính (click để mở dropdown) -->
                        <div class="hv-user-preview" @click="toggleDropdown">
                            <img v-if="userAvatarUrl" :src="userAvatarUrl" alt="Avatar" class="hv-avatar-img" />
                            <div v-else class="hv-avatar">{{ userInitial }}</div>

                            <div class="hv-userinfo-preview">
                                <div class="hv-name">{{ userDisplay }}</div>
                                <div class="hv-role">{{ userRole }}</div>
                            </div>

                            <svg class="hv-dropdown-icon" :class="{ open: dropdownOpen }" width="16" height="16"
                                viewBox="0 0 20 20">
                                <path fill="currentColor"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>

                        <!-- Dropdown menu -->
                        <div v-if="dropdownOpen" class="hv-dropdown-menu" @click.stop>
                            <RouterLink v-if="isDocGia" :to="{ name: 'docgia.profile' }" class="hv-dropdown-item"
                                @click="dropdownOpen = false">
                                Hồ sơ của tôi
                            </RouterLink>
                            <hr class="hv-divider" />
                            <button class="hv-dropdown-item hv-logout-item" @click="logout">
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="mobileOpen" class="hv-mobile-backdrop" @click="mobileOpen = false"></div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { onClickOutside } from "@vueuse/core";
import "@/assets/css/header.css";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

// Mobile menu
const mobileOpen = ref(false);

// Dropdown
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
};

// Đóng dropdown khi click bên ngoài
onClickOutside(dropdownRef, () => {
    dropdownOpen.value = false;
});

// Đóng khi chuyển trang
const closeAll = () => {
    mobileOpen.value = false;
    dropdownOpen.value = false;
};
onMounted(() => router.afterEach(closeAll));
onBeforeUnmount(() => router.afterEach(() => { }));

// Computed
const isAuthenticated = computed(() => auth.isLoggedIn);
const user = computed(() => auth.user || {});

const userAvatarUrl = computed(() => {
    return user.value?.Avatar || user.value?.avatarUrl || null;
});

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
const userRole = computed(() =>
    isDocGia.value ? "Độc giả" : user.value?.ChucVu || "Nhân viên"
);

const isStaff = computed(() =>
    ["admin", "quanly", "thuthu", "hotro"].includes(
        (user.value?.ChucVu || "").toLowerCase()
    )
);

const routeName = computed(() => route.name);

function logout() {
    dropdownOpen.value = false;
    auth.logout();
    router.push({ name: "login" });
}
</script>

<style scoped>
/* ──────────────── DROPDOWN USER ──────────────── */
.hv-user-dropdown {
    position: relative;
    user-select: none;
}

.hv-user-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.hv-user-preview:hover {
    background-color: rgba(0, 0, 0, 0.06);
}

.hv-avatar-img,
.hv-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.hv-avatar {
    background-color: #1e40af;
    color: white;
    font-weight: 600;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hv-userinfo-preview {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
}

.hv-name {
    font-weight: 600;
    font-size: 16px;
    color: #171e28;
}

.hv-role {
    font-size: 14px;
    color: #6b7280;
    text-transform: capitalize;
}

.hv-dropdown-icon {
    color: #6b7280;
    transition: transform 0.25s ease;
}

.hv-dropdown-icon.open {
    transform: rotate(180deg);
}

/* Dropdown menu */
.hv-dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    min-width: 180px;
    z-index: 1000;
    overflow: hidden;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

.hv-dropdown-item {
    display: block;
    width: 100%;
    padding: 11px 16px;
    text-align: left;
    font-size: 16px;
    color: #374151;
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
}

.hv-dropdown-item:hover {
    background-color: #f3f4f6;
}

.hv-logout-item {
    color: #dc2626 !important;
    font-weight: 500;
}

.hv-logout-item:hover {
    background-color: #fee2e2 !important;
}

.hv-divider {
    margin: 6px 0;
    border: none;
    border-top: 1px solid #e5e7eb;
}

/* Mobile */
@media (max-width: 768px) {
    .hv-user-preview {
        gap: 8px;
        padding: 6px;
    }

    .hv-dropdown-menu {
        right: auto;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>