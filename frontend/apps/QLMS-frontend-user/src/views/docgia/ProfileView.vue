<template>
        <div class="profile-page">
               
        <ProfileCard :profile="store.profile" @avatar-uploaded="handleAvatarUpload" @edit="openChangePassword" />
               
        <ProfileForm :initialProfile="store.profile" @saved="onProfileSaved" />
           
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useDocGiaStore } from "@/stores/docgiaStore";
import ProfileCard from "@/components/docgia/ProfileCard.vue";
import ProfileForm from "@/components/docgia/ProfileForm.vue";
import Swal from 'sweetalert2'; // Import SweetAlert2

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

        // Sử dụng Swal để thông báo kết quả upload avatar
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

        // Logic onProfileSaved chỉ tập trung vào đồng bộ dữ liệu
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
    margin: 0 auto;
    padding: 20px;
    background-color: #FFF2D7;
    max-width: 800px;
}

.profile-card+.profile-form {
    margin-top: 24px;
}
</style>