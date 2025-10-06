<template>
    <form @submit.prevent="submitNhanVien">
        <div class="mb-3">
            <label for="MSNV" class="form-label">Mã Số Nhân Viên (MSNV):</label>
            <input type="text" id="MSNV" class="form-control" v-model="nhanVienLocal.MSNV" required />
        </div>

        <div class="mb-3">
            <label for="HoTenNV" class="form-label">Họ Tên Nhân Viên:</label>
            <input type="text" id="HoTenNV" class="form-control" v-model="nhanVienLocal.HoTenNV" required />
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
    emits: ["submit:nhanvien"],
    data() {
        return {
            nhanVienLocal: {}
        };
    },
    watch: {
        nhanVien: {
            handler(newVal) {
                this.nhanVienLocal = newVal ? JSON.parse(JSON.stringify(newVal)) : {};

                if (this.nhanVienLocal.Password) {
                    this.nhanVienLocal.Password = "";
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        submitNhanVien() {
            this.$emit("submit:nhanvien", { ...this.nhanVienLocal });
        },
    },
};
</script>