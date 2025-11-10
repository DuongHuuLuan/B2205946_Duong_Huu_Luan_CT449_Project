<template>
    <form @submit.prevent="submitDocGia" enctype="multipart/form-data">
        <div class="mb-3 avatar-section">
            <label class="form-label d-block">Ảnh Đại Diện (Avatar):</label>

            <div class="current-avatar-wrapper">
                <img v-if="docGiaLocal.Avatar" :src="docGiaLocal.Avatar" alt="Avatar hiện tại" class="current-avatar" />
                <div v-else class="default-avatar">DG</div>
            </div>

            <input type="file" id="AvatarFile" class="form-control mt-2" @change="handleAvatarChange"
                accept="image/*" />
            <small class="form-text text-muted">Chọn ảnh mới để thay đổi Avatar.</small>
        </div>
        <div class="mb-3">
            <label for="MaDocGia" class="form-label">Mã Độc Giả:</label>
            <input type="text" id="MaDocGia" class="form-control" v-model="docGiaLocal.MaDocGia" required />
        </div>

        <div class="mb-3">
            <label for="HoLot" class="form-label">Họ Lót:</label>
            <input type="text" id="HoLot" class="form-control" v-model="docGiaLocal.HoLot" required />
        </div>

        <div class="mb-3">
            <label for="Ten" class="form-label">Tên:</label>
            <input type="text" id="Ten" class="form-control" v-model="docGiaLocal.Ten" required />
        </div>

        <div class="mb-3">
            <label for="NgaySinh" class="form-label">Ngày Sinh:</label>
            <input type="date" id="NgaySinh" class="form-control" v-model="docGiaLocal.NgaySinh" required />
        </div>

        <div class="mb-3">
            <label for="Phai" class="form-label">Phái:</label>
            <select id="Phai" class="form-control" v-model="docGiaLocal.Phai" required>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="DiaChi" class="form-label">Địa Chỉ:</label>
            <input type="text" id="DiaChi" class="form-control" v-model="docGiaLocal.DiaChi" />
        </div>

        <div class="mb-3">
            <label for="DienThoai" class="form-label">Điện Thoại:</label>
            <input type="text" id="DienThoai" class="form-control" v-model="docGiaLocal.DienThoai" />
        </div>

        <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> {{ docGiaLocal._id ? "Cập Nhật" : "Lưu" }}
        </button>
    </form>
</template>

<script>
export default {
    name: "DocGiaForm",
    props: { docGia: { type: Object, required: true } },
    // Cần thay đổi emit để có thể gửi kèm cả file
    emits: ["submit:docgia", "submit:docgia-with-file"],
    data() {
        return {
            docGiaLocal: {},
            newAvatarFile: null, // <-- Thêm biến lưu file mới
        };
    },
    watch: {
        docGia: {
            handler(newVal) {
                // Đảm bảo reset newAvatarFile khi docGia thay đổi
                this.docGiaLocal = newVal ? JSON.parse(JSON.stringify(newVal)) : {};
                this.newAvatarFile = null;
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        handleAvatarChange(event) {
            // Lưu file được chọn
            this.newAvatarFile = event.target.files[0];

            // Tùy chọn: Cập nhật ngay ảnh hiển thị (preview)
            if (this.newAvatarFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Cập nhật đường dẫn tạm thời cho mục đích preview
                    this.docGiaLocal.Avatar = e.target.result;
                };
                reader.readAsDataURL(this.newAvatarFile);
            }
        },
        submitDocGia() {
            // Nếu có file mới được chọn, chúng ta emit sự kiện khác 
            // để component cha biết và xử lý upload file riêng.
            if (this.newAvatarFile) {
                // Gửi docGiaLocal và file
                this.$emit("submit:docgia-with-file", {
                    docGia: { ...this.docGiaLocal, Avatar: undefined }, // Xóa Avatar cũ khỏi object docGia
                    file: this.newAvatarFile
                });
            } else {
                // Nếu không có file mới, gửi docGiaLocal như cũ
                this.$emit("submit:docgia", { ...this.docGiaLocal });
            }
        },
    },
};
</script>
