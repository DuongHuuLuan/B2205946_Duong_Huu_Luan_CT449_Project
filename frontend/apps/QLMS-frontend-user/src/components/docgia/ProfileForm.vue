<template>
    <div class="card profile-form">
        <h3>Chỉnh sửa thông tin</h3>

        <form @submit.prevent="onSubmit" class="form-grid" novalidate>
            <div class="field">
                <label>Họ đệm</label>
                <input v-model="form.HoLot" type="text" />
            </div>

            <div class="field">
                <label>Tên <span style="color:#b91c1c">*</span></label>
                <input v-model="form.Ten" type="text" required />
            </div>

            <div class="field">
                <label>Ngày sinh</label>
                <input v-model="form.NgaySinh" type="date" />
            </div>

            <div class="field">
                <label>Giới tính</label>
                <select v-model="form.Phai">
                    <option value="">—</option>
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nữ</option>
                    <option value="Khac">Khác</option>
                </select>
            </div>

            <div class="field">
                <label>Điện thoại</label>
                <input v-model="form.DienThoai" type="text" />
            </div>

            <div class="field full">
                <label>Địa chỉ</label>
                <input v-model="form.DiaChi" type="text" />
            </div>

            <div class="actions">
                <button class="btn-primary" :disabled="saving">{{ saving ? "Đang lưu..." : "Lưu" }}</button>
                <button type="button" class="btn-outline" @click="onReset">Huỷ</button>
            </div>

            <div v-if="error" class="form-error">{{ error }}</div>
            <div v-if="success" class="form-success">{{ success }}</div>
        </form>
    </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { useDocGiaStore } from "@/stores/docgiaStore";

const props = defineProps({ initialProfile: { type: Object, required: true } });
const emit = defineEmits(["saved"]);
const store = useDocGiaStore();

const isoDate = (s) => {
    if (!s) return "";
    if (typeof s === "string") return s.split?.("T")?.[0] ?? s;
    // nếu là Date object
    try {
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split("T")[0];
        }
    } catch { }
    return "";
};

const form = reactive({
    HoLot: props.initialProfile.HoLot || "",
    Ten: props.initialProfile.Ten || "",
    NgaySinh: isoDate(props.initialProfile.NgaySinh),
    Phai: props.initialProfile.Phai || "",
    DienThoai: props.initialProfile.DienThoai || "",
    DiaChi: props.initialProfile.DiaChi || "",
});

let saving = false;
let error = null;
let success = null;

watch(
    () => props.initialProfile,
    (np) => {
        form.HoLot = np?.HoLot || "";
        form.Ten = np?.Ten || "";
        form.NgaySinh = isoDate(np?.NgaySinh);
        form.Phai = np?.Phai || "";
        form.DienThoai = np?.DienThoai || "";
        form.DiaChi = np?.DiaChi || "";
        error = null;
        success = null;
    },
    { immediate: true, deep: true }
);

function onReset() {
    form.HoLot = props.initialProfile.HoLot || "";
    form.Ten = props.initialProfile.Ten || "";
    form.NgaySinh = isoDate(props.initialProfile.NgaySinh);
    form.Phai = props.initialProfile.Phai || "";
    form.DienThoai = props.initialProfile.DienThoai || "";
    form.DiaChi = props.initialProfile.DiaChi || "";
    error = null;
    success = null;
}

async function onSubmit() {
    saving = true;
    error = null;
    success = null;

    // simple client-side validation
    if (!form.Ten || String(form.Ten).trim().length === 0) {
        error = "Tên không được để trống";
        saving = false;
        return;
    }

    try {
        const payload = {
            HoLot: form.HoLot || undefined,
            Ten: form.Ten || undefined,
            NgaySinh: form.NgaySinh || undefined, // 'YYYY-MM-DD' is fine
            Phai: form.Phai || undefined,
            DienThoai: form.DienThoai || undefined,
            DiaChi: form.DiaChi || undefined,
        };
        const updated = await store.updateProfile(payload);
        success = "Cập nhật thành công";
        emit("saved", updated);
    } catch (err) {
        console.error(err);
        error = store.error || (err?.response?.data?.message ?? "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
        saving = false;
    }
}
</script>

<style scoped>
/* giữ nguyên style cũ */
.card {
    background: white;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.06);
}

.profile-form h3 {
    margin: 0 0 12px;
    font-size: 18px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.field {
    display: flex;
    flex-direction: column;
}

.field.full {
    grid-column: 1 / -1;
}

.field label {
    font-size: 13px;
    color: #374151;
    margin-bottom: 6px;
}

.field input,
.field select {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #e6eef8;
    background: #fafcff;
}

.actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 10px;
    margin-top: 6px;
}

.btn-primary {
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    color: white;
    padding: 10px 14px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}

.btn-outline {
    background: transparent;
    border: 1px solid #e6eef8;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
}

.form-error {
    color: #b91c1c;
    margin-top: 8px;
}

.form-success {
    color: #065f46;
    margin-top: 8px;
}

@media (max-width: 720px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
