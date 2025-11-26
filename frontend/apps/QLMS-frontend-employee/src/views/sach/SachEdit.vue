<!-- <template>
    <div class="container mt-4">
        <h2 class="mb-3">Cập Nhật Sách</h2>

        <SachForm v-if="sach" :sach="sach" :nxbList="nxbList" @submit:sach="updateSach" />
        <p v-else>Đang tải dữ liệu...</p>
    </div>
</template>

<script>
import SachForm from "@/components/sach/SachForm.vue";
import SachService from "@/services/sach.service";
import NxbService from "@/services/nhaxuatban.service";
import Swal from "sweetalert2";

export default {
    name: "SachEdit",
    components: { SachForm },
    data() {
        return {
            sach: null,
            nxbList: [],
        };
    },
    methods: {
        async loadData() {
            try {
                const resNxb = await NxbService.getAll();
                this.nxbList = resNxb.data || resNxb;
                const resSach = await SachService.get(this.$route.params.id);
                const dataSach = resSach.data || resSach;

                const maNxbHienThi = this.nxbList.find(nxb => nxb._id === dataSach.MaNXB)?.MaNXB || dataSach.MaNXB;
                this.sach = {
                    ...dataSach,
                    MaNXB: maNxbHienThi,
                };
            } catch (error) {
                Swal.fire("Lỗi", "Không thể tải dữ liệu.", "error");
                console.error(error);
            }
        },
        async updateSach(updatedSach) {
            try {
                const res = await SachService.update(this.$route.params.id, updatedSach);
                Swal.fire("Thành công", res.message, "success");
                setTimeout(() => this.$router.push({ name: "sach.list" }), 1500);
            } catch (error) {
                Swal.fire("Lỗi", "Cập nhật thất bại.", "error");
                console.error(error);
            }
        },
    },
    mounted() {
        this.loadData();
    },
};
</script> -->

<script>
import SachForm from "@/components/sach/SachForm.vue";
import SachService from "@/services/sach.service";
import NxbService from "@/services/nhaxuatban.service";
import Swal from "sweetalert2";

export default {
    components: { SachForm },
    data() {
        return { sach: null, nxbList: [] };
    },
    methods: {
        async loadData() {
            const [resNxb, resSach] = await Promise.all([
                NxbService.getAll(),
                SachService.get(this.$route.params.id)
            ]);
            this.nxbList = resNxb.data || resNxb;
            const data = resSach.data || resSach;
            this.sach = data;
        },
        async updateSach(data) {
            await SachService.updateWithCover(this.$route.params.id, data, null);
            Swal.fire("Thành công!", "Cập nhật thành công", "success");
            this.$router.push({ name: "sach.list" });
        },
        async updateSachWithCover({ sach, file }) {
            await SachService.updateWithCover(this.$route.params.id, sach, file);
            Swal.fire("Thành công!", "Cập nhật bìa sách thành công", "success");
            this.$router.push({ name: "sach.list" });
        }
    },
    mounted() {
        this.loadData();
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2>Cập Nhật Sách</h2>
        <SachForm v-if="sach" :sach="sach" :nxbList="nxbList" @submit:sach="updateSach"
            @submit:sach-with-file="updateSachWithCover" />
    </div>
</template>