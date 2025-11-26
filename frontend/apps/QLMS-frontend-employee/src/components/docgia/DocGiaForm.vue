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
        <div class="row g-3">
            <!-- AVATAR SECTION -->
            <div class="col-12 text-center">
                <label class="form-label d-block fw-bold">Ảnh Đại Diện</label>

                <div class="avatar-preview-wrapper mx-auto mb-3">
                    <img v-if="previewUrl" :src="previewUrl" alt="Avatar preview"
                        class="avatar-preview rounded-circle" />
                    <div v-else
                        class="avatar-preview rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center">
                        <span class="fs-3">DG</span>
                    </div>
                </div>

                <input type="file" class="form-control form-control-sm w-75 mx-auto" accept="image/*"
                    @change="handleAvatarChange" />
                <small class="text-muted">Tối đa 2MB, định dạng JPG/PNG</small>
            </div>

            <!-- FORM FIELDS -->
            <div class="col-md-6">
                <label class="form-label">Mã Độc Giả <span class="text-danger">*</span></label>
                <input v-model="docGiaLocal.MaDocGia" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Họ Lót <span class="text-danger">*</span></label>
                <input v-model="docGiaLocal.HoLot" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Tên <span class="text-danger">*</span></label>
                <input v-model="docGiaLocal.Ten" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Ngày Sinh <span class="text-danger">*</span></label>
                <input type="date" v-model="docGiaLocal.NgaySinh" class="form-control" required />
            </div>

            <div class="col-md-6">
                <label class="form-label">Phái <span class="text-danger">*</span></label>
                <select v-model="docGiaLocal.Phai" class="form-select" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>

            <div class="col-md-6">
                <label class="form-label">Địa Chỉ</label>
                <input v-model="docGiaLocal.DiaChi" class="form-control" />
            </div>

            <div class="col-md-6">
                <label class="form-label">Điện Thoại</label>
                <input v-model="docGiaLocal.DienThoai" class="form-control" />
            </div>

            <!-- Mật khẩu chỉ hiện khi tạo mới -->
            <div class="col-md-6" v-if="!docGiaLocal._id">
                <label class="form-label">Mật Khẩu Mặc Định</label>
                <input v-model="docGiaLocal.Password" type="text" class="form-control"
                    placeholder="Để trống (Mặc định = 123456)" />
            </div>
        </div>

        <div class="text-center mt-4">
            <button type="submit" class="btn btn-success px-5">
                <i class="fas fa-save me-2"></i>
                {{ docGiaLocal._id ? 'Cập Nhật' : 'Tạo Mới' }}
            </button>
        </div>
    </form>
</template>

<script>
export default {
    name: "DocGiaForm",
    props: {
        docGia: { type: Object, required: true }
    },
    emits: ["submit:docgia", "submit:docgia-with-file"],
    data() {
        return {
            docGiaLocal: {},
            newAvatarFile: null,
            previewUrl: null
        };
    },
    watch: {
        docGia: {
            handler(newVal) {
                this.docGiaLocal = newVal ? { ...newVal } : {};
                // Nếu có avatar cũ từ server → hiển thị luôn
                this.previewUrl = this.docGiaLocal.Avatar || null;
                this.newAvatarFile = null;
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handleAvatarChange(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Kiểm tra dung lượng (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB");
                e.target.value = "";
                return;
            }

            this.newAvatarFile = file;

            // Tạo preview
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.previewUrl = ev.target.result;
            };
            reader.readAsDataURL(file);
        },

        submitDocGia() {
            const cleanData = { ...this.docGiaLocal };
            delete cleanData.Avatar; // Không gửi avatar cũ (dạng data URL hoặc link)

            if (this.newAvatarFile) {
                this.$emit("submit:docgia-with-file", {
                    docGia: cleanData,
                    file: this.newAvatarFile
                });
            } else {
                this.$emit("submit:docgia", cleanData);
            }
        }
    }
};
</script>

<style scoped>
.avatar-preview-wrapper {
    width: 120px;
    height: 120px;
    margin: 0 auto 15px;
    border: 3px solid #e0e0e0;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.default-avatar {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 2rem;
    color: white;
}
</style>