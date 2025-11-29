<template>
    <div class="profile-page">
        <div class="profile-container">
            <ProfileCard :profile="store.profile" @avatar-uploaded="handleAvatarUpload" @edit="openChangePassword" />
            <ProfileForm :initialProfile="store.profile" @saved="onProfileSaved" />
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useDocGiaStore } from "@/stores/docgiaStore";
import ProfileCard from "@/components/docgia/ProfileCard.vue";
import ProfileForm from "@/components/docgia/ProfileForm.vue";
import Swal from 'sweetalert2';

export default {
    components: { ProfileCard, ProfileForm },
    setup() {
        const store = useDocGiaStore();

        onMounted(async () => {
            try {
                await store.fetchProfile();
            } catch (err) {
                console.error("fetchProfile failed:", err);
            }
        });

        async function handleAvatarUpload(file) {
            try {
                await store.uploadAvatar(file);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Cập nhật ảnh đại diện thành công.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: store.error || "Upload ảnh thất bại.",
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000
                });
            }
        }

        function onProfileSaved(updatedProfile) {
            console.log("Profile saved! New data:", updatedProfile);
            if (updatedProfile && Object.keys(updatedProfile).length > 0) {
                store.setProfile(updatedProfile);
            } else {
                store.fetchProfile();
            }
        }

        function openChangePassword() {
            console.log("openChangePassword called");
        }

        return { store, handleAvatarUpload, onProfileSaved, openChangePassword };
    },
};
</script>

<style scoped>
.profile-page {
    min-height: 100vh;
    padding: 20px 0;
    background-color: #FFF2D7;
}


.profile-container {
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>