<template>
    <form @submit.prevent="submitDocGia">
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
    emits: ["submit:docgia"],
    data() {
        return { docGiaLocal: {} };
    },
    watch: {
        docGia: {
            handler(newVal) {
                this.docGiaLocal = newVal ? JSON.parse(JSON.stringify(newVal)) : {};
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        submitDocGia() {
            this.$emit("submit:docgia", { ...this.docGiaLocal });
        },
    },
};
</script>
