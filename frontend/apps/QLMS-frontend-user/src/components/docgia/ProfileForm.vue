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

    if (!form.Ten || String(form.Ten).trim().length === 0) {
        error = "Tên không được để trống";
        saving = false;
        return;
    }

    try {
        const payload = {
            HoLot: form.HoLot || undefined,
            Ten: form.Ten || undefined,
            NgaySinh: form.NgaySinh || undefined,
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
.card {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 12px 32px rgba(16, 24, 40, 0.08);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
}

.profile-form h3 {
    margin: 0 0 16px;
    font-size: 20px;
    color: #1e293b;
    font-weight: 700;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.field {
    display: flex;
    flex-direction: column;
}

.field.full {
    grid-column: 1 / -1;
}

.field label {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 8px;
    font-weight: 500;
}

.field input,
.field select {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #e0e7ff;
    background: #fafcff;
    font-size: 14px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.field input:focus,
.field select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    outline: none;
}

.actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

.btn-primary {
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    color: white;
    padding: 12px 18px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    transition: transform 0.3s ease, background 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    background: linear-gradient(90deg, #1d4ed8, #6b21a8);
}

.btn-primary:disabled {
    background: #93c5fd;
    cursor: not-allowed;
}

.btn-outline {
    background: transparent;
    border: 1px solid #e0e7ff;
    padding: 12px 18px;
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

.form-error {
    color: #b91c1c;
    margin-top: 12px;
    font-size: 14px;
}

.form-success {
    color: #065f46;
    margin-top: 12px;
    font-size: 14px;
}

@media (max-width: 720px) {
    .form-grid {
        grid-template-columns: 1fr;
    }

    .field input,
    .field select {
        padding: 10px 12px;
    }

    .actions {
        flex-direction: column;
    }

    .btn-primary,
    .btn-outline {
        width: 100%;
    }
}
</style>