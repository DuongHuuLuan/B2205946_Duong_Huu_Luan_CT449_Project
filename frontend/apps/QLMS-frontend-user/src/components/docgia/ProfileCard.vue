<template>
    <div class="card profile-card">
        <div class="top">
            <div class="avatar-wrap">
                <div class="avatar-ring">
                    <img v-if="profile?.avatar" :src="profile.avatar" alt="avatar" class="avatar" />
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
    const d = new Date(raw);
    return isNaN(d.getTime()) ? raw : d.toLocaleDateString();
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
    background: white;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
}

.profile-card .top {
    display: flex;
    gap: 14px;
    align-items: center;
}

.avatar-wrap {
    width: 96px;
}

.avatar-ring {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, rgba(124, 58, 237, 0.12), rgba(37, 99, 235, 0.08));
    padding: 6px;
}

.avatar {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
}

.avatar-empty {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e6e9f2;
    color: #475569;
    font-weight: 700;
    font-size: 20px;
}

/* info */
.info .name {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
}

.muted {
    color: #6b7280;
    margin: 4px 0;
    font-size: 13px;
}

/* meta */
.meta {
    margin-top: 12px;
    border-top: 1px dashed #edf2f7;
    padding-top: 12px;
}

.meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 8px;
}

.label {
    color: #6b7280;
}

/* actions */
.card-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}

.btn-primary {
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}

.btn-primary:hover {
    transform: translateY(-1px);
}

.btn-outline {
    background: transparent;
    border: 1px solid #e6e9f2;
    padding: 8px 12px;
    border-radius: 8px;
    color: #374151;
    cursor: pointer;
}

/* utilities */
.visually-hidden {
    display: none;
}
</style>
