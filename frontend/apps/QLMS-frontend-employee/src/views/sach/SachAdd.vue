<!-- <template>
    <div class="container mt-4">
        <h2 class="mb-3">Thêm Sách</h2>

        <SachForm :sach="{}" :nxbList="dsNXB" @submit:sach="addSach" />
    </div>
</template>

<script>
import SachForm from "@/components/sach/SachForm.vue";
import SachService from "@/services/sach.service";
import NxbService from "@/services/nhaxuatban.service";
import Swal from "sweetalert2";

export default {
    name: "SachAdd",
    components: { SachForm },
    data() {
        return {
            dsNXB: []
        };
    },
    async mounted() {
        try {
            this.dsNXB = await NxbService.getAll();
        } catch (error) {
            Swal.fire("Lỗi", "Không load được danh sách NXB.", "error");
            console.error("Không load được NXB:", error);
        }
    },
    methods: {
        async addSach(newSach) {
            try {
                await SachService.create(newSach);
                Swal.fire("Thành công", "Thêm mới sách thành công!", "success");
                setTimeout(() => this.$router.push({ name: "sach.list" }), 1500);
            } catch (error) {
                Swal.fire("Lỗi", "Thêm mới thất bại.", "error");
                console.error(error);
            }
        }
    }
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
        return { dsNXB: [] };
    },
    async mounted() {
        this.dsNXB = await NxbService.getAll();
    },
    methods: {
        async addSach(sachData) {
            await SachService.createWithCover(sachData, null);
            Swal.fire("Thành công!", "Thêm sách thành công", "success");
            this.$router.push({ name: "sach.list" });
        },
        async addSachWithCover({ sach, file }) {
            await SachService.createWithCover(sach, file);
            Swal.fire("Thành công!", "Thêm sách + bìa thành công", "success");
            this.$router.push({ name: "sach.list" });
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2>Thêm Sách Mới</h2>
        <SachForm :sach="{}" :nxbList="dsNXB" @submit:sach="addSach" @submit:sach-with-file="addSachWithCover" />
    </div>
</template>