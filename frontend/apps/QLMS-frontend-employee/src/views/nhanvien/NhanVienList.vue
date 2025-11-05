<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h3 class="fw-bold text-primary">Danh sách Nhân Viên</h3>
                    <div class="d-flex gap-2 align-items-center">
                        <RouterLink :to="{ name: 'nhanvien.add' }" class="btn btn-success">
                            <i class="fas fa-plus"></i> Thêm mới
                        </RouterLink>
                    </div>
                </div>
                <!-- Search -->
                <div class="mb-3">
                    <InputSearch v-model="searchKeyword" @submit="onSearch" />
                </div>

                <table class="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>MSNV</th>
                            <th>Họ Tên</th>
                            <th>Chức Vụ</th>
                            <th>Địa Chỉ</th>
                            <th>Số Điện Thoại</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="nv in displayedList" :key="nv._id">
                            <td>{{ nv.MSNV }}</td>
                            <td>{{ nv.HoTenNV }}</td>
                            <td>{{ nv.ChucVu }}</td>
                            <td>{{ nv.DiaChi }}</td>
                            <td>{{ nv.SoDienThoai }}</td>
                            <td>
                                <RouterLink :to="{ name: 'nhanvien.edit', params: { id: nv._id } }"
                                    class="btn btn-warning btn-sm me-2">
                                    <i class="fas fa-edit"></i>
                                </RouterLink>
                                <button @click="deleteNhanVien(nv._id)" class="btn btn-danger btn-sm">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>

                        <tr v-if="displayedList.length === 0">
                            <td colspan="6" class="text-center text-muted">Không có nhân viên nào.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import InputSearch from "@/components/InputSearch.vue";
import NhanVienService from "@/services/nhanvien.service";
import Swal from "sweetalert2";

export default {
    name: "NhanVienList",
    components: {
        InputSearch,
    },
    data() {
        return {
            nhanVienList: [],
            searchKeyword: "",
        };
    },
    computed: {
        displayedList() {
            const kw = String(this.searchKeyword || "").trim().toLowerCase();
            if (!kw) return this.nhanVienList;

            return this.nhanVienList.filter(nv => {
                const fields = [
                    nv.MSNV,
                    nv.HoTenNV,
                    nv.ChucVu,
                    nv.DiaChi,
                    nv.SoDienThoai,
                    nv._id,
                ];
                return fields.some(f => (f || "").toString().toLowerCase().includes(kw));
            });
        }
    },
    methods: {
        async loadNhanVien() {
            try {
                const res = await NhanVienService.getAll();
                // support both axios style (res.data) and direct array
                this.nhanVienList = res?.data ?? res ?? [];
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Không thể tải danh sách nhân viên.',
                });
                console.error(error);
            }
        },

        async deleteNhanVien(id) {
            const result = await Swal.fire({
                title: 'Xác nhận xóa?',
                text: "Bạn có chắc muốn xóa nhân viên này? Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Có, xóa!',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                try {
                    await NhanVienService.delete(id);
                    this.nhanVienList = this.nhanVienList.filter((nv) => nv._id !== id);
                    Swal.fire('Đã xóa!', 'Nhân viên đã được xóa thành công.', 'success');
                } catch (error) {
                    Swal.fire('Lỗi!', 'Xóa thất bại. Vui lòng thử lại!', 'error');
                    console.error(error);
                }
            }
        },

        onSearch() {
            // gọi khi nhấn Enter hoặc click nút tìm — hiện chỉ log
            console.log("Tìm nhân viên:", this.searchKeyword);
            // nếu muốn search server-side, gọi API ở đây và cập nhật nhanVienList
        },
    },
    created() {
        this.loadNhanVien();
    },
};
</script>
