<template>
    <div>
        <!-- <StatsCard :stats="store.stats" :loading="loadingStats" /> -->
        <ProfileCard :profile="store.profile" @avatar-uploaded="handleAvatarUpload" @edit="openChangePassword" />
        <ProfileForm :initialProfile="store.profile" @saved="onProfileSaved" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue"; // <-- thêm import ở đây
import { useDocGiaStore } from "@/stores/docgiaStore";
import StatsCard from "@/components/docgia/BorrowStats.vue";
import ProfileCard from "@/components/docgia/ProfileCard.vue";
import ProfileForm from "@/components/docgia/ProfileForm.vue";

export default {
    components: { StatsCard, ProfileCard, ProfileForm },
    setup() {
        const store = useDocGiaStore();
        const loadingStats = ref(false);

        onMounted(async () => {
            try {
                await store.fetchProfile();
            } catch (err) {
                console.error("fetchProfile failed:", err);
            }

            loadingStats.value = true;
            try {
                await store.fetchStats();
            } catch (err) {
                console.error("fetchStats failed:", err);
            } finally {
                loadingStats.value = false;
            }
        });

        async function handleAvatarUpload(file) {
            try {
                await store.uploadAvatar(file);
                await store.fetchProfile();
            } catch (err) {
                console.error(err);
            }
        }

        function onProfileSaved(updated) {
            // cập nhật lại thống kê sau khi profile lưu xong
            store.fetchStats().catch(() => { });
        }

        function openChangePassword() {
            console.log("openChangePassword called");
        }

        return { store, loadingStats, handleAvatarUpload, onProfileSaved, openChangePassword };
    },
};
</script>
