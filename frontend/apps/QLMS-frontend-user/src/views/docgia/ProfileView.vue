<template>
    <div class="profile-page">
        <header class="profile-header">
            <div class="header-inner">
                <div>
                    <h1>Hồ sơ độc giả</h1>
                    <p class="subtitle">Quản lý thông tin cá nhân &amp; lịch sử mượn sách</p>
                </div>
                <div class="actions">
                    <button class="btn ghost" @click="loadAll" :disabled="refreshing">
                        {{ refreshing ? "Đang làm mới..." : "Làm mới" }}
                    </button>
                </div>
            </div>
        </header>

        <main class="profile-main">
            <aside class="left-col">
                <ProfileCard :profile="profile" @avatar-uploaded="onAvatarUploaded" />
                <BorrowStats :stats="stats" />
            </aside>

            <section class="right-col">
                <ProfileForm v-if="profile" :initialProfile="profile" @saved="onSaved" />
                <div v-else class="card">Không có dữ liệu hồ sơ.</div>
            </section>
        </main>

        <!-- small floating global loading indicator (show when store.loading true) -->
        <div v-if="loading" class="loading-overlay">Đang tải...</div>

        <!-- error toast -->
        <div v-if="errorMessage" class="error-toast">{{ errorMessage }}</div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useDocGiaStore } from "@/stores/docgiaStore";
import ProfileCard from "@/components/docgia/ProfileCard.vue";
import ProfileForm from "@/components/docgia/ProfileForm.vue";
import BorrowStats from "@/components/docgia/BorrowStats.vue";

const store = useDocGiaStore();

const profile = computed(() => store.profile);
const stats = computed(() => store.stats);
const loading = computed(() => store.loading);
const errorMessage = computed(() => {
    // store.error có thể là string hoặc object Error/Response
    if (!store.error) return null;
    return store.error?.message ?? store.error;
});

const refreshing = ref(false);

async function loadAll() {
    // nếu chưa đăng nhập thì không fetch profile (tránh lỗi)
    if (!store.token) {
        // optional: set friendly error
        return;
    }

    refreshing.value = true;
    try {
        // fetch profile và stats (song song)
        await Promise.all([store.fetchProfile(), store.fetchStats()]);
    } catch (err) {
        // lỗi đã được lưu trong store.error; log thêm nếu cần
        console.error("loadAll error:", err);
    } finally {
        refreshing.value = false;
    }
}

onMounted(() => {
    // chỉ load nếu có token
    if (store.token) {
        loadAll();
    }
});

function onSaved(updated) {
    // updated thường đã được set trong store.updateProfile,
    // nhưng để chắc chắn trigger reactivity ở mọi nơi ta replace object:
    if (updated && typeof updated === "object") {
        store.profile = { ...updated };
        localStorage.setItem("docgiaUser", JSON.stringify(store.profile));
    } else {
        // fallback: refetch profile
        store.fetchProfile().catch(() => { });
    }
}

async function onAvatarUploaded(file) {
    try {
        await store.uploadAvatar(file);
        // uploadAvatar đã cập nhật store.profile
    } catch (err) {
        console.error("Upload avatar error:", err);
    }
}
</script>

<style scoped>
/* Layout */
.profile-page {
    min-height: 100vh;
    background: #f6f8fb;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #1f2937;
}

/* Header */
.profile-header {
    background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
    color: white;
    padding: 28px 0;
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.12);
}

.header-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-inner h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
}

.subtitle {
    margin-top: 6px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
}

/* Main grid */
.profile-main {
    max-width: 1100px;
    margin: 24px auto;
    padding: 0 20px 60px;
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 24px;
}

/* Responsive */
@media (max-width: 900px) {
    .profile-main {
        grid-template-columns: 1fr;
    }
}

/* Left / Right */
.left-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.right-col {}

/* Buttons */
.btn {
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.btn.ghost {
    background: rgba(255, 255, 255, 0.12);
    color: white;
}

.btn.ghost:hover {
    background: rgba(255, 255, 255, 0.18);
}

/* Loading & error */
.loading-overlay {
    position: fixed;
    right: 20px;
    bottom: 20px;
    background: rgba(31, 41, 55, 0.95);
    color: white;
    padding: 10px 14px;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.2);
    z-index: 9999;
}

.error-toast {
    position: fixed;
    left: 20px;
    bottom: 20px;
    background: #fee2e2;
    color: #991b1b;
    padding: 10px 14px;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
    z-index: 9999;
}
</style>
