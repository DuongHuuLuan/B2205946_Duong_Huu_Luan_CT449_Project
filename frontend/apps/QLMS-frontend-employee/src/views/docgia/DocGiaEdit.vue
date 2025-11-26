<!-- // File: src/views/docgia/DocGiaEdit.vue
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
</script> -->

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Cập Nhật Độc Giả</h2>

        <DocGiaForm v-if="docGia" :docGia="docGia" @submit:docgia="updateDocGia"
            @submit:docgia-with-file="updateDocGiaWithFile" />
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
                this.docGia = await DocGiaService.get(this.$route.params.id);
                // đảm bảo normalize Avatar path nếu cần
                if (this.docGia && this.docGia.Avatar) {
                    this.docGia.Avatar = this.getAvatarUrl(this.docGia.Avatar);
                }
            } catch (error) {
                Swal.fire({ icon: "error", title: "Lỗi!", text: "Không thể tải dữ liệu Độc Giả." });
                console.error("loadDocGia error:", error);
            }
        },

        // CHÚ Ý: buildUpdatePayload PHẢI nằm trong methods để this có thể gọi.
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
                let newVal = form[key];
                const oldVal = initial ? initial[key] : undefined;

                if (typeof newVal === "string") newVal = newVal.trim();

                const hasValue =
                    newVal !== undefined && newVal !== null && String(newVal).trim() !== "";

                const changed =
                    String(oldVal ?? "").trim() !== String(newVal ?? "").trim();

                if (key === "Password") {
                    if (!hasValue) continue;
                    // thêm validate password nếu muốn
                }

                if (hasValue && changed) {
                    if (key === "NgaySinh") {
                        // nếu trường gửi lên là string yyyy-mm-dd, giữ nguyên
                        if (newVal instanceof Date) {
                            const yyyy = newVal.getFullYear();
                            const mm = String(newVal.getMonth() + 1).padStart(2, "0");
                            const dd = String(newVal.getDate()).padStart(2, "0");
                            payload[key] = `${yyyy}-${mm}-${dd}`;
                        } else {
                            payload[key] = newVal;
                        }
                    } else {
                        payload[key] = newVal;
                    }
                }
            }

            return payload;
        },

        // Update without file (giữ logic cũ)
        async updateDocGia(updatedForm) {
            try {
                const payload = this.buildUpdatePayload(updatedForm, this.docGia);
                if (Object.keys(payload).length === 0) {
                    Swal.fire({ icon: "info", title: "Không có thay đổi", text: "Bạn chưa chỉnh sửa gì cả." });
                    return;
                }
                await DocGiaService.update(this.$route.params.id, payload);
                Swal.fire({ icon: "success", title: "Thành công!", text: "Cập nhật Độc Giả thành công.", timer: 1500, showConfirmButton: false })
                    .then(() => this.$router.push({ name: "docgia.list" }));
            } catch (error) {
                console.error("Update failed error object:", error);
                const msg = error?.response?.data?.message || error?.message || "Cập nhật thất bại.";
                Swal.fire({ icon: "error", title: "Lỗi!", text: msg });
            }
        },

        // Update WITH file (đây là chỗ lỗi trước đó)
        async updateDocGiaWithFile(payloadObj) {
            try {
                // payloadObj = { docGia: {...}, file: File }
                console.log("updateDocGiaWithFile called, payloadObj:", payloadObj);
                const { docGia, file } = payloadObj || {};

                // Sanity check: ensure buildUpdatePayload exists
                if (typeof this.buildUpdatePayload !== "function") {
                    console.error("buildUpdatePayload is not a function", this.buildUpdatePayload);
                    throw new Error("Internal error: buildUpdatePayload missing");
                }

                // Build payload (các trường thay đổi)
                const payload = this.buildUpdatePayload(docGia, this.docGia);
                // NOTE: nếu payload rỗng nhưng có file (chỉ update Avatar) thì vẫn gửi file
                console.log("Built payload to send:", payload, "file:", file);

                await DocGiaService.updateWithAvatar(this.$route.params.id, payload, file);

                Swal.fire({ icon: "success", title: "Thành công!", text: "Cập nhật Độc Giả (có ảnh) thành công.", timer: 1500, showConfirmButton: false })
                    .then(() => this.$router.push({ name: "docgia.list" }));
            } catch (error) {
                console.error("Update with file failed:", error);
                const msg = error?.response?.data?.message || error?.message || "Cập nhật thất bại. Vui lòng thử lại.";
                Swal.fire({ icon: "error", title: "Lỗi!", text: msg });
            }
        },

        // Bình thường dùng để chuẩn hoá đường dẫn Avatar để tránh backslash và thiếu leading slash
        getAvatarUrl(avatarPath) {
            if (!avatarPath) return null;
            let p = String(avatarPath).replace(/\\/g, "/").trim();
            if (!p.startsWith("/")) p = "/" + p;
            // nếu backend host khác, thêm base url bằng env var:
            // if (p.startsWith('/uploads')) return (process.env.VUE_APP_API_BASE_URL || '') + p;
            return p;
        }
    },

    mounted() {
        this.loadDocGia();
    },
};
</script>
