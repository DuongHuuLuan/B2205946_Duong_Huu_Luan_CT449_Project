<template>
    <div class="card profile-card">
        <div class="top">
            <div class="avatar-wrap">
                <div class="avatar-ring">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="avatar" />
                    <div v-else class="avatar-empty">{{ initials }}</div>
                </div>
            </div>

            <div class="info">
                <h3 class="name">{{ fullName }}</h3>
                <p class="muted">Mã: <strong>{{ profile?.MaDocGia || "—" }}</strong></p>
                <p class="muted">{{ profile?.DienThoai || "Chưa có số điện thoại" }}</p>
            </div>
        </div>

        <div class="meta">
            <div class="meta-row"><span class="label">Địa chỉ</span><span>{{ profile?.DiaChi || "—" }}</span></div>
            <div class="meta-row"><span class="label">Ngày sinh</span><span>{{ formattedDate }}</span></div>
        </div>

        <div class="card-actions">
            <input ref="fileInput" type="file" accept="image/*" class="visually-hidden" @change="onFileChange" />
            <button class="btn-primary" @click="openFile">Thay ảnh</button>
            <button class="btn-outline" @click="$emit('edit')">Đổi mật khẩu</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({ profile: { type: Object, default: null } });
const emit = defineEmits(["avatar-uploaded", "edit"]);
const fileInput = ref(null);

const avatarUrl = computed(() => {
    return props.profile?.Avatar || null;
});

const fullName = computed(() => {
    if (!props.profile) return "—";
    return `${props.profile.HoLot ?? ""} ${props.profile.Ten ?? ""}`.trim();
});
const initials = computed(() => {
    if (!props.profile) return "DG";
    const ten = props.profile.Ten || "";
    const holot = props.profile.HoLot || "";
    return (ten[0] || holot[0] || "D").toUpperCase();
});
const formattedDate = computed(() => {
    if (!props.profile?.NgaySinh) return "—";
    const raw = props.profile.NgaySinh;
    const d = typeof raw === "string" ? new Date(raw) : raw;
    return isNaN(new Date(d).getTime()) ? raw : new Date(d).toLocaleDateString();
});

function openFile() {
    fileInput.value?.click();
}
function onFileChange(e) {
    const file = e?.target?.files?.[0] || fileInput.value?.files?.[0];
    if (!file) return;
    emit("avatar-uploaded", file);
}
</script>

<style scoped>
.card {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 12px 32px rgba(16, 24, 40, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(16, 24, 40, 0.12);
}

.profile-card .top {
    display: flex;
    gap: 16px;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px dashed #e0e7ff;
}

.avatar-wrap {
    width: 100px;
}

.avatar-ring {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1));
    padding: 6px;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #ffffff;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
    transition: transform 0.3s ease;
}

.avatar:hover {
    transform: scale(1.05);
}

.avatar-empty {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e0e7ff, #f3f4f6);
    color: #2563eb;
    font-weight: 700;
    font-size: 22px;
    text-transform: uppercase;
}

.info .name {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
}

.muted {
    color: #64748b;
    margin: 4px 0;
    font-size: 14px;
}

.meta {
    margin-top: 16px;
    padding-top: 16px;
}

.meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 10px;
    color: #1e293b;
}

.label {
    color: #64748b;
    font-weight: 500;
}

.card-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed #e0e7ff;
}

.btn-primary {
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    color: white;
    padding: 10px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease, background 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #1d4ed8, #6b21a8);
}

.btn-outline {
    background: transparent;
    border: 1px solid #e0e7ff;
    padding: 10px 16px;
    border-radius: 10px;
    color: #1e293b;
    cursor: pointer;
    transition: transform 0.3s ease, border-color 0.3s ease;
}

.btn-outline:hover {
    transform: translateY(-2px);
    border-color: #2563eb;
    color: #2563eb;
}

.visually-hidden {
    display: none;
}
</style>