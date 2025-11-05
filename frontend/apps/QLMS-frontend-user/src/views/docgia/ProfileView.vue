<template>
    <div class="profile-page">
        <ProfileCard :profile="store.profile" @avatar-uploaded="handleAvatarUpload" @edit="openChangePassword" />
        <ProfileForm :initialProfile="store.profile" @saved="onProfileSaved" />
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
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
            store.fetchStats().catch(() => { });
        }

        function openChangePassword() {
            console.log("openChangePassword called");
        }

        return { store, loadingStats, handleAvatarUpload, onProfileSaved, openChangePassword };
    },
};
</script>

<style scoped>
.profile-page {
    min-height: 100vh;
    margin: 0 auto;
    padding: 20px;
    background-color: #FFF2D7;
    max-width: 800px;
}

.profile-card+.profile-form {
    margin-top: 24px;
}
</style>