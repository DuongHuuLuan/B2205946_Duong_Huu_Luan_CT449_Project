<!-- <template>
    <div class="container mt-4">
        <h2>Thêm Theo Dõi Mượn Sách</h2>

        <TheoDoiMuonSachForm :td="{}" :docGiaList="docGiaList" :sachList="sachList" @submit:td="createTheoDoi" />

        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script>
import TheoDoiMuonSachForm from "@/components/theodoimuonsach/TheoDoiMuonSachForm.vue";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";

export default {
    name: "TheoDoiMuonSachAdd",
    components: { TheoDoiMuonSachForm },
    data() {
        return {
            errorMessage: "",
            docGiaList: [],
            sachList: [],
        };
    },
    async created() {
        try {
            const resDocGia = await DocGiaService.getAll();
            const resSach = await SachService.getAll();

            // Lấy dữ liệu mảng, dù nó nằm trực tiếp hay trong thuộc tính 'data'
            this.docGiaList = resDocGia.data || resDocGia;
            this.sachList = resSach.data || resSach;

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            this.errorMessage = "Không thể tải danh sách độc giả hoặc sách. Vui lòng kiểm tra server.";
        }
    },
    methods: {
        async createTheoDoi(newTD) {
            try {
                await TheoDoiMuonSachService.create(newTD);

                await this.$swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Phiếu mượn sách đã được thêm.",
                    timer: 1500, // Tự động đóng sau 1.5 giây
                    timerProgressBar: true,
                    showConfirmButton: false
                });

                this.$router.push({ name: "theodoimuonsach.list" });

            } catch (error) {
                console.error("Lỗi khi thêm phiếu mượn:", error.response || error);

                // // Lấy thông báo lỗi chi tiết từ server (nếu có)
                const serverError = error.response && error.response.data
                    ? error.response.data.message || error.response.data.error || "Lỗi không xác định."
                    : "Không thể kết nối đến server.";

                this.errorMessage = `Thêm thất bại. ${serverError}`;
                this.$swal.fire("Lỗi", this.errorMessage, "error");
            }
        },
    },
};
</script> -->
<template>
    <div class="container mt-4">
        <h2>Thêm Phiếu Mượn Sách</h2>
        <TheoDoiMuonSachForm :td="{}" :docGiaList="docGiaList" :sachList="sachList" @submit:td="createTheoDoi" />
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    </div>
</template>

<script>
import TheoDoiMuonSachForm from "@/components/theodoimuonsach/TheoDoiMuonSachForm.vue";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import DocGiaService from "@/services/docgia.service";
import SachService from "@/services/sach.service";

export default {
    components: { TheoDoiMuonSachForm },
    data: () => ({
        docGiaList: [],
        sachList: [],
        errorMessage: ""
    }),
    async created() {
        try {
            const [dg, sach] = await Promise.all([
                DocGiaService.getAll(),
                SachService.getAll()
            ]);
            this.docGiaList = dg.data || dg;
            this.sachList = sach.data || sach;
        } catch (err) {
            this.errorMessage = "Không tải được danh sách độc giả hoặc sách";
        }
    },
    methods: {
        async createTheoDoi(payload) {
            try {
                await TheoDoiMuonSachService.create(payload);
                this.$swal.fire("Thành công!", "Tạo phiếu mượn thành công", "success");
                this.$router.push({ name: "theodoimuonsach.list" });
            } catch (err) {
                this.$swal.fire("Lỗi", err.response?.data?.message || "Tạo thất bại", "error");
            }
        }
    }
};
</script>