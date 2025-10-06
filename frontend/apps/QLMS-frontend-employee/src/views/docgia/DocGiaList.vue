<template>
    <div class="container mt-4">
        <h2 class="mb-3">Danh sách Độc Giả</h2>

        <router-link to="/docgia/add" class="btn btn-primary mb-3">
            Thêm Độc Giả
        </router-link>

        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Mã Độc Giả</th>
                    <th>Họ Lót</th>
                    <th>Tên</th>
                    <th>Ngày Sinh</th>
                    <th>Phái</th>
                    <th>Địa Chỉ</th>
                    <th>Điện Thoại</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="dg in docGiaList" :key="dg._id">
                    <td>{{ dg.MaDocGia || dg._id }}</td>
                    <td>{{ dg.HoLot }}</td>
                    <td>{{ dg.Ten }}</td>
                    <td>{{ new Date(dg.NgaySinh).toLocaleDateString() }}</td>
                    <td>{{ dg.Phai }}</td>
                    <td>{{ dg.DiaChi }}</td>
                    <td>{{ dg.DienThoai }}</td>
                    <td>
                        <router-link :to="{ name: 'docgia.edit', params: { id: dg._id } }"
                            class="btn btn-warning btn-sm me-2">
                            Sửa
                        </router-link>
                        <!-- Ẩn nút Xóa nếu độc giả đang mượn sách -->
                        <button v-if="!dg.hasBorrowed" class="btn btn-danger btn-sm" @click="deleteDocGia(dg._id)">
                            Xóa
                        </button>
                        <span v-else class="text-muted">Đang mượn sách</span>
                    </td>
                </tr>
                <tr v-if="docGiaList.length === 0">
                    <td colspan="8" class="text-center">Không có dữ liệu.</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import DocGiaService from "@/services/docgia.service";
import Swal from "sweetalert2";

export default {
    name: "DocGiaList",
    data() {
        return {
            docGiaList: [],
        };
    },
    methods: {
        async loadDocGia() {
            try {
                this.docGiaList = await DocGiaService.getAll();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi tải dữ liệu!',
                    text: 'Không thể tải danh sách Độc Giả. Vui lòng kiểm tra Server!',
                });
                console.error(error);
            }
        },
        async deleteDocGia(id) {
            const result = await Swal.fire({
                title: 'Xác nhận xóa?',
                text: "Bạn có chắc muốn xóa Độc Giả này? Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                try {
                    await DocGiaService.delete(id);
                    this.docGiaList = this.docGiaList.filter((dg) => dg._id !== id);
                    Swal.fire('Đã xóa!', 'Độc Giả đã được xóa thành công.', 'success');
                } catch (error) {
                    Swal.fire(
                        'Lỗi!',
                        error.response?.data?.message || 'Xóa thất bại. Vui lòng thử lại!',
                        'error'
                    );
                    console.error(error);
                }
            }
        },
    },
    mounted() {
        this.loadDocGia();
    },
};
</script>
