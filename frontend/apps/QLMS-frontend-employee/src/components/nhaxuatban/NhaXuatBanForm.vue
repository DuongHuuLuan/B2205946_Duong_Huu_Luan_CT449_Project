<template>
    <form @submit.prevent="submitNXB">

        <div class="mb-3">
            <label for="MaNXB" class="form-label">Mã Nhà Xuất Bản:</label>
            <input type="text" id="MaNXB" class="form-control" v-model="nxbLocal.MaNXB" required />
        </div>

        <div class="mb-3">
            <label for="TenNXB" class="form-label">Tên Nhà Xuất Bản:</label>
            <input type="text" id="TenNXB" class="form-control" v-model="nxbLocal.TenNXB" required />
        </div>

        <div class="mb-3">
            <label for="DiaChi" class="form-label">Địa Chỉ:</label>
            <input type="text" id="DiaChi" class="form-control" v-model="nxbLocal.DiaChi" />
        </div>

        <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> {{ nxbLocal._id ? 'Cập Nhật' : 'Lưu' }}
        </button>
    </form>
</template>

<script>
export default {
    name: "NhaXuatBanForm",
    props: { nxb: { type: Object, required: true } },
    emits: ["submit:nxb"],
    data() {
        return {
            nxbLocal: {},
        };
    },
    watch: {
        nxb: {
            handler(newVal) {
                this.nxbLocal = newVal ? JSON.parse(JSON.stringify(newVal)) : {};
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        submitNXB() {
            if (!this.nxbLocal.TenNXB || !String(this.nxbLocal.TenNXB).trim()) {
                alert("Vui lòng nhập Tên Nhà Xuất Bản.");
                return;
            }

            const payload = { ...this.nxbLocal };
            this.$emit("submit:nxb", payload);
        },
    },
};
</script>