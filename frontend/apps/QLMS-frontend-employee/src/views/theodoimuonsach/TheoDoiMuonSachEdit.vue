<template>
    <div class="container mt-4">
        <h2>Cập Nhật Theo Dõi Mượn Sách</h2>

        <TheoDoiMuonSachForm v-if="td" :td="td" :docGiaList="docGiaList" :sachList="sachList"
            @submit:td="updateTheoDoi" />
        <p v-else>Đang tải dữ liệu...</p>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

    </div>
</template>

<script>
import TheoDoiMuonSachForm from "@/components/theodoimuonsach/TheoDoiMuonSachForm.vue";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";


export default {
    name: "TheoDoiMuonSachEdit",
    components: { TheoDoiMuonSachForm },
    data() {
        return {
            td: null,// dữ liệu cũ của bản ghi
            docGiaList: [], // danh sách độc giả để select
            sachList: [], // danh sách sách để select
            errorMessage: "",
            successMessage: "",
        };
    },
    setup() {
        const authStore = useAuthStore();
        return { authStore };
    },
    methods: {
        async loadData() {
            try {
                const id = this.$route.params.id;
                // Gọi API để lấy dữ liệu, bao gồm các trường tính toán tạm thời
                const data = await TheoDoiMuonSachService.get(id);
                const resDocGia = await DocGiaService.getAll();
                const resSach = await SachService.getAll();

                this.docGiaList = resDocGia.data || resDocGia;
                this.sachList = resSach.data || resSach;

                // 1. Ánh xạ MaDocGia từ _id
                const maDocGia = this.docGiaList.find(dg => dg._id === data.MaDocGia)?.MaDocGia || data.MaDocGia;

                // 2. Gán toàn bộ data và định dạng lại
                this.td = {
                    ...data, // GIỮ LẠI TẤT CẢ, BAO GỒM TIENPHATTAMTHOI VÀ TONGTHANHTOAN

                    MaDocGia: maDocGia,

                    // Định dạng ngày tháng
                    NgayMuon: data.NgayMuon ? data.NgayMuon.slice(0, 10) : "",
                    NgayTra: data.NgayTra ? data.NgayTra.slice(0, 10) : "",

                    // Đảm bảo ChiTietMuon luôn là mảng
                    ChiTietMuon: data.ChiTietMuon || [],
                };

                // 3. Loại bỏ trường MaSach cũ nếu còn tồn tại
                delete this.td.MaSach;

            } catch (error) {
                this.errorMessage = "Không thể tải dữ liệu.";
                console.error(error);
                Swal.fire("Lỗi", "Không thể tải dữ liệu chi tiết theo dõi mượn sách.", "error");
            }
        },

        async updateTheoDoi(updatedTD) {
            try {
                const payload = {
                    ...updatedTD,
                    MSNV: this.authStore.getMSNV
                };

                // Loại bỏ các trường tạm thời không cần gửi lên DB
                delete payload.TienPhatTamThoi;
                delete payload.TongThanhToan;

                await TheoDoiMuonSachService.update(this.$route.params.id, payload);

                this.successMessage = "Cập nhật thành công!";
                Swal.fire("Thành công", "Cập nhật phiếu mượn thành công!", "success");
                setTimeout(() => this.$router.push({ name: "theodoimuonsach.list" }), 1500);
            } catch (error) {
                this.errorMessage = "Cập nhật thất bại.";
                // Cố gắng lấy thông báo lỗi từ backend để hiển thị chính xác hơn
                const errorMsg = error.response?.data?.message || "Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.";
                Swal.fire("Lỗi", errorMsg, "error");
                console.error(error);
            }
        }
    },
    mounted() {
        this.loadData();
    },
};
</script>