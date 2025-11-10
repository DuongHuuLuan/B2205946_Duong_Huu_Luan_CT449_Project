<template>
    <form @submit.prevent="submitSach" enctype="multipart/form-data">
        <div class="mb-3">
            <label for="MaSach" class="form-label">Mã Sách:</label>
            <input type="text" id="MaSach" class="form-control" v-model="sachLocal.MaSach" required />
        </div>

        <div class="mb-3">
            <label for="TenSach" class="form-label">Tên Sách:</label>
            <input type="text" id="TenSach" class="form-control" v-model="sachLocal.TenSach" required />
        </div>

        <div class="mb-3 cover-section">
            <label class="form-label d-block">Ảnh Bìa Sách (BiaSach):</label>

            <div class="current-cover-wrapper">
                <img v-if="sachLocal.BiaSach" :src="sachLocal.BiaSach" alt="Bìa Sách hiện tại"
                    class="current-cover-img" />
                <div v-else class="default-cover">Không có ảnh</div>
            </div>

            <input type="file" id="BiaSachFile" class="form-control mt-2" @change="handleBiaSachChange"
                accept="image/*" />
            <small class="form-text text-muted">Chọn ảnh mới để thay đổi Bìa Sách (tỷ lệ 2:3 là tốt nhất).</small>
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
    emits: ["submit:sach", "submit:sach-with-file"],
    data() {
        return {
            sachLocal: {},
            newBiaSachFile: null, // Lưu trữ file ảnh bìa mới được chọn
        };
    },
    watch: {
        sach: {
            handler(newVal) {
                if (newVal) {
                    this.sachLocal = JSON.parse(JSON.stringify(newVal));
                    this.newBiaSachFile = null; // Reset file

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
        handleBiaSachChange(event) {
            const file = event.target.files[0];
            this.newBiaSachFile = file;

            // Tạo preview ảnh ngay lập tức
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.sachLocal.BiaSach = e.target.result; // Cập nhật tạm thời cho mục đích hiển thị
                };
                reader.readAsDataURL(file);
            }
        },
        submitSach() {
            if (!this.sachLocal.TenSach || !String(this.sachLocal.TenSach).trim()) {
                alert("Vui lòng nhập Tên Sách.");
                return;
            }
            if (!this.sachLocal.MaNXB) {
                alert("Vui lòng chọn Mã Nhà Xuất Bản.");
                return;
            }

            if (this.newBiaSachFile) {
                // Gửi sự kiện riêng kèm theo file mới được chọn
                this.$emit("submit:sach-with-file", {
                    // Loại bỏ BiaSach URL khỏi object sach
                    sach: { ...this.sachLocal, BiaSach: undefined },
                    file: this.newBiaSachFile
                });
            } else {
                // Gửi sự kiện cập nhật thông thường
                const payload = { ...this.sachLocal };
                this.$emit("submit:sach", payload);
            }
        },
    },
};
</script>

<style scoped>
.cover-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px dashed #ccc;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
}

.current-cover-wrapper {
    /* Tỷ lệ 2:3 - Phổ biến cho bìa sách */
    width: 100px;
    height: 150px;
    margin: 0.5rem 0 1rem 0;
    overflow: hidden;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.current-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.default-cover {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f8ff;
    /* Alice Blue */
    color: #4682b4;
    /* Steel Blue text */
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    padding: 10px;
}

#BiaSachFile {
    max-width: 400px;
}

.form-label {
    font-weight: 500;
}
</style>