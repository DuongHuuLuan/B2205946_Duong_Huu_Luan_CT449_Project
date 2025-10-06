<template>
    <div class="container mt-4">
        <h2 class="mb-3">Danh sách Sách</h2>

        <router-link to="/sach/add" class="btn btn-primary mb-3">
            Thêm Sách
        </router-link>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Mã Sách</th>
                    <th>Tên Sách</th>
                    <th>Đơn Giá</th>
                    <th>Số Quyển</th>
                    <th>Năm XB</th>
                    <th>Mã NXB</th>
                    <th>Tác Giả</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="sach in sachList" :key="sach._id">
                    <td>{{ sach.MaSach || sach._id }}</td>
                    <td>{{ sach.TenSach }}</td>
                    <td>{{ sach.DonGia }}</td>
                    <td>{{ sach.SoQuyen }}</td>
                    <td>{{ sach.NamXuatBan }}</td>
                    <td>{{ sach.MaNXB }}</td>
                    <td>{{ sach.TacGia || sach.NguonGoc }}</td>
                    <td>
                        <router-link :to="{ name: 'sach.edit', params: { id: sach._id } }"
                            class="btn btn-warning btn-sm me-2">
                            Sửa
                        </router-link>
                        <button v-if="!sach.isBorrowed" class="btn btn-danger btn-sm" @click="deleteSach(sach._id)">
                            Xóa
                        </button>
                        <span v-else class="text-muted">Đang được mượn</span>
                    </td>
                </tr>
                <tr v-if="sachList.length === 0">
                    <td colspan="8" class="text-center">Không có dữ liệu.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import SachService from "@/services/sach.service";
import Swal from "sweetalert2";

export default {
    name: "SachList",
    data() {
        return {
            sachList: [],
            errorMessage: "",
        };
    },
    methods: {
        async loadSach() {
            try {
                const res = await SachService.getAll();
                this.sachList = res.data;
            } catch (error) {
                this.errorMessage = "Không thể tải danh sách Sách.";
                console.error(error);
            }
        },
        async deleteSach(id) {
            const confirm = await Swal.fire({
                title: "Bạn có chắc muốn xóa?",
                text: "Dữ liệu sẽ bị mất vĩnh viễn!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy",
            });

            if (confirm.isConfirmed) {
                try {
                    const res = await SachService.delete(id);
                    this.sachList = this.sachList.filter((s) => s._id !== id);
                    Swal.fire("Thành công", res.message, "Xóa thành công");
                } catch (error) {
                    const errMsg = error.response?.data?.message || "Xóa thất bại.";
                    Swal.fire("Lỗi", errMsg, "error");
                    console.error(error);
                }
            }
        }
    },
    mounted() {
        this.loadSach();
    },
};
</script>
