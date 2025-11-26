<!-- <template>
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
</script> -->


<template>
    <form @submit.prevent="submitDocGia" enctype="multipart/form-data">
        <div class="mb-3 avatar-section">
            <label class="form-label d-block">Ảnh Đại Diện (Avatar):</label>

            <div class="current-avatar-wrapper">
                <!-- Hiển thị ảnh Avatar hiện tại (docGiaLocal.Avatar chứa URL hoặc DataURL tạm thời) -->
                <img v-if="docGiaLocal.Avatar" :src="docGiaLocal.Avatar" alt="Avatar hiện tại" class="current-avatar" />
                <div v-else class="default-avatar">DG</div>
            </div>

            <!-- Input để chọn file mới -->
            <input type="file" id="AvatarFile" class="form-control mt-2" @change="handleAvatarChange"
                accept="image/*" />
            <small class="form-text text-muted">Chọn ảnh mới để thay đổi Avatar.</small>
            <small v-if="docGiaLocal.Avatar && !newAvatarFile" class="form-text text-info d-block">Ảnh hiện tại sẽ được
                giữ lại nếu bạn không chọn tệp mới.</small>
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

        <!-- Trường Mật Khẩu (Chỉ cần trong Edit Form nếu API yêu cầu) -->
        <!-- Tôi thêm trường này và để trống (nếu không đổi mật khẩu) hoặc nhập mật khẩu mới -->
        <div v-if="docGiaLocal._id" class="mb-3">
            <label for="Password" class="form-label">Mật Khẩu (Để trống nếu không đổi):</label>
            <!-- Lưu ý: Dùng v-model riêng cho mật khẩu, không đưa vào docGiaLocal ban đầu -->
            <input type="password" id="Password" class="form-control" v-model="password" />
        </div>


        <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> {{ docGiaLocal._id ? "Cập Nhật" : "Lưu" }}
        </button>
    </form>
</template>

<script>
// Giả lập styling Bootstrap và Font Awesome
// Thêm style cho component này
// NOTE: Bạn sẽ cần đảm bảo CSS của Bootstrap được tải trong dự án Vue của mình.
const style = document.createElement('style');
style.innerHTML = `
.current-avatar-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10px;
    border: 2px solid #0d6efd;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
}
.current-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.default-avatar {
    font-size: 2rem;
    color: #495057;
    font-weight: bold;
}
.btn-success {
    background-color: #198754;
    border-color: #198754;
    color: white;
}
.btn-success:hover {
    background-color: #157347;
    border-color: #146c43;
}
`;
document.head.appendChild(style);

export default {
    name: "DocGiaForm",
    // docGia prop có thể là object rỗng {} khi thêm mới
    props: { docGia: { type: Object, required: true } },
    // Thêm event mới để xử lý form có file
    emits: ["submit:docgia", "submit:docgia-with-file"],
    data() {
        return {
            docGiaLocal: {},
            newAvatarFile: null, // Biến lưu file mới được chọn
            password: '', // Biến tạm thời để nhập mật khẩu mới
        };
    },
    watch: {
        docGia: {
            handler(newVal) {
                // Reset form và file khi prop docGia thay đổi (khi chuyển từ Edit sang Add)
                this.docGiaLocal = newVal ? JSON.parse(JSON.stringify(newVal)) : {};
                this.newAvatarFile = null;
                this.password = '';

                // Xử lý NgaySinh từ định dạng ISO sang YYYY-MM-DD nếu cần
                if (this.docGiaLocal.NgaySinh && this.docGiaLocal.NgaySinh.includes('T')) {
                    this.docGiaLocal.NgaySinh = this.docGiaLocal.NgaySinh.split('T')[0];
                }
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
            // Chuẩn bị dữ liệu form để gửi
            const docGiaData = {
                ...this.docGiaLocal,
                // Thêm trường Mật Khẩu (chỉ khi có giá trị)
                ...(this.password.trim() && { Password: this.password.trim() })
            };

            // Đảm bảo không gửi kèm DataURL của Avatar preview
            delete docGiaData.Avatar;

            if (this.newAvatarFile) {
                // Nếu có file mới, emit sự kiện kèm file
                this.$emit("submit:docgia-with-file", {
                    docGia: docGiaData,
                    file: this.newAvatarFile
                });
            } else {
                // Nếu không có file mới, emit sự kiện bình thường
                this.$emit("submit:docgia", docGiaData);
            }
        },
    },
};
</script>