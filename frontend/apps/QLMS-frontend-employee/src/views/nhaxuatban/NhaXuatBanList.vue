// File: src/views/nhaxuatban/NhaXuatBanList.vue
<template>
    <div class="container mt-4">
        <h2 class="mb-3">Danh sách Nhà Xuất Bản</h2>

        <router-link to="/nhaxuatban/add" class="btn btn-primary mb-3">
            Thêm Nhà Xuất Bản
        </router-link>

        <NhaXuatBanTable :nxbList="nxbList" @delete="deleteNXB" />

        <p v-if="nxbList.length === 0">Không có Nhà Xuất Bản nào.</p>
    </div>
</template>

<script>
import NhaXuatBanService from "@/services/nhaxuatban.service";
import NhaXuatBanTable from "@/components/nhaxuatban/NhaXuatBanTable.vue";
import Swal from "sweetalert2";

export default {
    name: "NhaXuatBanList",
    components: { NhaXuatBanTable },
    data() {
        return {
            nxbList: [],
        };
    },
    methods: {
        async loadNXB() {
            try {
                const data = await NhaXuatBanService.getAll();
                this.nxbList = data;
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi tải dữ liệu!',
                    text: 'Không thể tải danh sách Nhà Xuất Bản. Vui lòng kiểm tra Server!',
                });
                console.error(error);
            }
        },
        async deleteNXB(id) {
            const result = await Swal.fire({
                title: 'Xác nhận xóa?',
                text: "Bạn có chắc muốn xóa Nhà Xuất Bản này? Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                try {
                    await NhaXuatBanService.delete(id);
                    this.nxbList = this.nxbList.filter((nxb) => nxb._id !== id);
                    Swal.fire(
                        'Đã xóa!',
                        'Nhà Xuất Bản đã được xóa thành công.',
                        'success'
                    );
                } catch (error) {
                    Swal.fire(
                        'Lỗi!',
                        error.response?.data?.message || 'Xóa thất bại. Vui lòng thử l',
                        'error'
                    );
                    console.error(error);
                }
            }
        },
    },
    mounted() {
        this.loadNXB();
    },
};
</script>