<!-- <template>
    <div class="container mt-4">
        <h2 class="mb-3">Thêm Nhà Xuất bản</h2>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

        <NhaXuatBanForm :nxb="{}" @submit:nxb="addNXB" />
    </div>
</template>

<script>
import NhaXuatBanForm from '@/components/nhaxuatban/NhaXuatBanForm.vue';
import nhaxuatbanService from '@/services/nhaxuatban.service';

export default {
    name: "NhaXuatBanAdd",
    components: { NhaXuatBanForm },
    data() {
        return {
            errorMessage: "",
            successMessage: "",
        };
    },
    methods: {
        async addNXB(nxb) {
            try {
                await nhaxuatbanService.create(nxb);
                this.successMessage = "Thêm mới thành công!";
                setTimeout(() => this.$router.push({ name: "nxb.list" }), 1500);
            } catch (error) {
                this.errorMessage = "Không thể thêm mới. Vui lòng thử lại!";
                console.error(error);
            }
        },
    },
};
</script> -->

// File: src/views/nhaxuatban/NhaXuatBanAdd.vue
<template>
    <div class="container mt-4">
        <h2 class="mb-3">Thêm Nhà Xuất bản</h2>
        <NhaXuatBanForm :nxb="{}" @submit:nxb="addNXB" />
    </div>
</template>

<script>
import NhaXuatBanForm from '@/components/nhaxuatban/NhaXuatBanForm.vue';
import nhaxuatbanService from '@/services/nhaxuatban.service';
import Swal from "sweetalert2";

export default {
    name: "NhaXuatBanAdd",
    components: { NhaXuatBanForm },
    methods: {
        async addNXB(nxb) {
            try {
                const res = await nhaxuatbanService.create(nxb);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Thêm mới Nhà Xuất Bản thành công.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    this.$router.push({ name: "nxb.list" });
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không thể thêm mới. Vui lòng kiểm tra dữ liệu và thử lại.',
                });
                console.error(error);
            }
        },
    },
};
</script>