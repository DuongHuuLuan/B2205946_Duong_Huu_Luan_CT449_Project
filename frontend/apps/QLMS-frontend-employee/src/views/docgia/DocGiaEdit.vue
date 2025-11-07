// File: src/views/docgia/DocGiaEdit.vue
<template>
    <div class="container mt-4">
        <h2 class="mb-3">Cập Nhật Độc Giả</h2>

        <DocGiaForm v-if="docGia" :docGia="docGia" @submit:docgia="updateDocGia" />
        <p v-else>Đang tải dữ liệu...</p>
    </div>
</template>

<script>
import DocGiaForm from "@/components/docgia/DocGiaForm.vue";
import DocGiaService from "@/services/docgia.service";
import Swal from "sweetalert2";

export default {
    name: "DocGiaEdit",
    components: { DocGiaForm },
    data() {
        return {
            docGia: null,
        };
    },
    methods: {
        async loadDocGia() {
            try {
                // chú ý: DocGiaService.get(...) nên trả về object profile (không lồng data)
                this.docGia = await DocGiaService.get(this.$route.params.id);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi!",
                    text: "Không thể tải dữ liệu Độc Giả.",
                });
                console.error(error);
            }
        },

        buildUpdatePayload(form, initial) {
            const allowed = [
                "HoLot",
                "Ten",
                "NgaySinh",
                "Phai",
                "DiaChi",
                "DienThoai",
                "Password",
            ];
            const payload = {};

            for (const key of allowed) {
                // lấy giá trị, trim chuỗi nếu là string
                let newVal = form[key];
                const oldVal = initial ? initial[key] : undefined;

                if (typeof newVal === "string") newVal = newVal.trim();

                const hasValue =
                    newVal !== undefined && newVal !== null && String(newVal).trim() !== "";

                const changed =
                    String(oldVal ?? "").trim() !== String(newVal ?? "").trim();

                // nếu là Password và rỗng hoặc không thay đổi => skip luôn
                if (key === "Password") {
                    if (!hasValue) continue; // không đổi password thì không gửi
                    // nếu có giá trị thì bạn có thể thêm validate (độ dài, confirmation...) trước khi gán
                }

                if (hasValue && changed) {
                    // nếu key là NgaySinh và đang là Date object, convert sang YYYY-MM-DD
                    if (key === "NgaySinh" && newVal instanceof Date) {
                        const yyyy = newVal.getFullYear();
                        const mm = String(newVal.getMonth() + 1).padStart(2, "0");
                        const dd = String(newVal.getDate()).padStart(2, "0");
                        payload[key] = `${yyyy}-${mm}-${dd}`;
                    } else {
                        payload[key] = newVal;
                    }
                }
            }

            return payload;
        },

        async updateDocGia(updatedForm) {
            try {
                const payload = this.buildUpdatePayload(updatedForm, this.docGia);

                console.log("payload gửi lên:", payload);

                if (Object.keys(payload).length === 0) {
                    Swal.fire({
                        icon: "info",
                        title: "Không có thay đổi",
                        text: "Bạn chưa chỉnh sửa gì cả.",
                    });
                    return;
                }

                const res = await DocGiaService.update(this.$route.params.id, payload);

                // nếu service trả về data object hoặc message
                console.log("update response:", res);

                Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Cập nhật Độc Giả thành công.",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => this.$router.push({ name: "docgia.list" }));
            } catch (error) {
                console.error("Update failed error object:", error);
                // cố gắng lấy message từ response
                const msg =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Cập nhật thất bại. Vui lòng thử lại!";
                Swal.fire({ icon: "error", title: "Lỗi!", text: msg });
            }
        },
    },
    mounted() {
        this.loadDocGia();
    },
};
</script>
