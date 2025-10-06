<template>
    <form @submit.prevent="submitSach">
        <div class="mb-3">
            <label for="MaSach" class="form-label">Mã Sách:</label>
            <input type="text" id="MaSach" class="form-control" v-model="sachLocal.MaSach" required />
        </div>

        <div class="mb-3">
            <label for="TenSach" class="form-label">Tên Sách:</label>
            <input type="text" id="TenSach" class="form-control" v-model="sachLocal.TenSach" required />
        </div>

        <div class="mb-3">
            <label for="DonGia" class="form-label">Đơn Giá:</label>
            <input type="number" id="DonGia" class="form-control" v-model.number="sachLocal.DonGia" required />
        </div>

        <div class="mb-3">
            <label for="SoQuyen" class="form-label">Số Quyển:</label>
            <input type="number" id="SoQuyen" class="form-control" v-model.number="sachLocal.SoQuyen" required />
        </div>

        <div class="mb-3">
            <label for="NamXuatBan" class="form-label">Năm Xuất Bản:</label>
            <input type="number" id="NamXuatBan" class="form-control" v-model.number="sachLocal.NamXuatBan" required />
        </div>

        <div class="mb-3">
            <label for="MaNXB" class="form-label">Mã Nhà Xuất Bản:</label>
            <select id="MaNXB" class="form-select" v-model="sachLocal.MaNXB" required>
                <option value="" disabled>-- Chọn Mã Nhà Xuất Bản --</option>
                <option v-for="n in nxbList" :key="n._id" :value="n.MaNXB">
                    {{ n.MaNXB }} - {{ n.TenNXB }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="TacGia" class="form-label">Tác Giả / Nguồn Gốc:</label>
            <input type="text" id="TacGia" class="form-control" v-model="sachLocal.TacGia" />
        </div>

        <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> {{ sachLocal._id ? "Cập Nhật" : "Lưu" }}
        </button>
    </form>
</template>

<script>
export default {
    name: "SachForm",
    props: {
        sach: { type: Object, required: true },
        nxbList: { type: Array, default: () => [] }
    },
    emits: ["submit:sach"],
    data() {
        return {
            sachLocal: {},
        };
    },
    watch: {
        sach: {
            handler(newVal) {
                if (newVal) {
                    this.sachLocal = JSON.parse(JSON.stringify(newVal));
                    if (this.sachLocal.MaNXB && typeof this.sachLocal.MaNXB !== "string") {
                        this.sachLocal.MaNXB = String(this.sachLocal.MaNXB);
                    }
                } else {
                    this.sachLocal = {};
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        submitSach() {
            if (!this.sachLocal.TenSach || !String(this.sachLocal.TenSach).trim()) {
                alert("Vui lòng nhập Tên Sách.");
                return;
            }
            if (!this.sachLocal.MaNXB) {
                alert("Vui lòng chọn Mã Nhà Xuất Bản.");
                return;
            }
            const payload = { ...this.sachLocal };
            this.$emit("submit:sach", payload);
        },
    },
};
</script>
