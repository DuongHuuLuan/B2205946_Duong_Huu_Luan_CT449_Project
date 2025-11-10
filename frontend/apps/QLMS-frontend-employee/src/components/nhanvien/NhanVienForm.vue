<template>
    <form @submit.prevent="submitNhanVien" enctype="multipart/form-data">
        <div class="mb-3">
            <label for="MSNV" class="form-label">Mã Số Nhân Viên (MSNV):</label>
            <input type="text" id="MSNV" class="form-control" v-model="nhanVienLocal.MSNV" required />
        </div>

        <div class="mb-3">
            <label for="HoTenNV" class="form-label">Họ Tên Nhân Viên:</label>
            <input type="text" id="HoTenNV" class="form-control" v-model="nhanVienLocal.HoTenNV" required />
        </div>

        <div class="mb-3 avatar-section">
            <label class="form-label d-block">Ảnh Đại Diện (Avatar):</label>

            <div class="current-avatar-wrapper">
                <img v-if="nhanVienLocal.Avatar" :src="nhanVienLocal.Avatar" alt="Avatar hiện tại"
                    class="current-avatar" />
                <div v-else class="default-avatar">{{ getInitial(nhanVienLocal) }}</div>
            </div>

            <input type="file" id="AvatarFile" class="form-control mt-2" @change="handleAvatarChange"
                accept="image/*" />
            <small class="form-text text-muted">Chọn ảnh mới để thay đổi Avatar.</small>
        </div>
        <div class="mb-3">
            <label for="Password" class="form-label">
                Mật Khẩu:
                <span v-if="nhanVienLocal._id" class="text-muted">(Để trống nếu không đổi)</span>
            </label>
            <input type="password" id="Password" class="form-control" v-model="nhanVienLocal.Password"
                :required="!nhanVienLocal._id" />
        </div>

        <div class="mb-3">
            <label for="ChucVu" class="form-label">Chức Vụ:</label>
            <select id="ChucVu" class="form-control" v-model="nhanVienLocal.ChucVu" required>
                <option value="Admin">Admin</option>
                <option value="QuanLy">Quản Lý</option>
                <option value="ThuThu">Thủ Thư</option>
                <option value="HoTro">Hỗ Trợ</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="DiaChi" class="form-label">Địa Chỉ:</label>
            <input type="text" id="DiaChi" class="form-control" v-model="nhanVienLocal.DiaChi" />
        </div>

        <div class="mb-3">
            <label for="SoDienThoai" class="form-label">Số Điện Thoại:</label>
            <input type="text" id="SoDienThoai" class="form-control" v-model="nhanVienLocal.SoDienThoai" />
        </div>

        <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> {{ nhanVienLocal._id ? "Cập Nhật" : "Lưu" }}
        </button>
    </form>
</template>

<script>
export default {
    name: "NhanVienForm",
    props: { nhanVien: { type: Object, required: true } },
    emits: ["submit:nhanvien", "submit:nhanvien-with-file"],
    data() {
        return {
            nhanVienLocal: {},
            newAvatarFile: null, // Lưu trữ file ảnh mới được chọn
        };
    },
    watch: {
        nhanVien: {
            handler(newVal) {
                this.nhanVienLocal = newVal ? JSON.parse(JSON.stringify(newVal)) : {};
                this.newAvatarFile = null; // Reset file khi prop thay đổi

                // Luôn reset trường password khi tải dữ liệu
                if (this.nhanVienLocal.Password) {
                    this.nhanVienLocal.Password = "";
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        getInitial(nhanVien) {
            // Lấy chữ cái đầu của Họ Tên hoặc MSNV
            return (nhanVien.HoTenNV || nhanVien.MSNV || "?").charAt(0).toUpperCase();
        },
        handleAvatarChange(event) {
            const file = event.target.files[0];
            this.newAvatarFile = file;

            // Tạo preview ảnh ngay lập tức
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.nhanVienLocal.Avatar = e.target.result; // Cập nhật tạm thời cho mục đích hiển thị
                };
                reader.readAsDataURL(file);
            }
        },
        submitNhanVien() {
            const payload = { ...this.nhanVienLocal };

            if (this.newAvatarFile) {
                // Gửi sự kiện riêng kèm theo file mới được chọn
                this.$emit("submit:nhanvien-with-file", {
                    // Loại bỏ Avatar URL khỏi object nhân viên
                    nhanVien: { ...payload, Avatar: undefined },
                    file: this.newAvatarFile
                });
            } else {
                // Gửi sự kiện cập nhật thông thường
                this.$emit("submit:nhanvien", payload);
            }
        },
    },
};
</script>

<style scoped>
.avatar-section {
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px dashed #d1e7dd;
    /* Dùng màu xanh nhẹ của success/thành công */
    border-radius: 0.5rem;
    background-color: #f6fff8;
}

.current-avatar-wrapper {
    width: 80px;
    height: 80px;
    margin: 0.5rem 0 1rem 0;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #198754;
    /* Màu xanh lá cây đậm */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.current-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.default-avatar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #d1e7dd;
    color: #198754;
    font-size: 20px;
    font-weight: bold;
}

#AvatarFile {
    max-width: 300px;
}
</style>