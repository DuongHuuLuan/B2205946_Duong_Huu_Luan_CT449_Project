<!-- <template>
    <form @submit.prevent="submitTheoDoi">

        <div class="mb-3">
            <label for="MaDocGia" class="form-label">Mã Độc Giả:</label>
            <select name="MaDocGia" id="MaDocGia" class="form-select" v-model="tdLocal.MaDocGia" required>
                <option value="" disabled>-- Chọn Mã Độc Giả --</option>
                <option v-for="dg in docGiaList" :key="dg._id" :value="dg.MaDocGia">
                    {{ dg.MaDocGia }} - {{ dg.HoLot }} {{ dg.Ten }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="MaSach" class="form-label">Mã Sách:</label>
            <select id="MaSach" class="form-select" v-model="tdLocal.MaSach" required>
                <option value="" disabled>-- Chọn Mã Sách --</option>
                <option v-for="s in sachList" :key="s._id" :value="s.MaSach">
                    {{ s.MaSach }} - {{ s.TenSach }} (Còn: {{ s.SoQuyen }})
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="NgayMuon" class="form-label">Ngày Mượn:</label>
            <input type="date" id="NgayMuon" class="form-control" v-model="tdLocal.NgayMuon" required />
        </div>

        <div class="mb-3">
            <label for="NgayTra" class="form-label">Ngày Trả:</label>
            <input type="date" id="NgayTra" class="form-control" v-model="tdLocal.NgayTra" />
        </div>
        <div class="mb-3" v-if="tdLocal._id">
            <label for="TrangThai" class="form-label">Trạng Thái:</label>
            <select id="TrangThai" class="form-select" v-model="tdLocal.TrangThai">
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
                <option value="Trễ hạn">Trễ hạn</option>
            </select>
        </div>

        <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> {{ tdLocal._id ? "Cập Nhật" : "Lưu" }}
        </button>
    </form>
</template>

<script>
import Swal from "sweetalert2";

export default {
    name: "TheoDoiMuonSachForm",
    props: {
        td: { type: Object, required: true },
        docGiaList: { type: Array, default: () => [] },
        sachList: { type: Array, default: () => [] }
    },
    emits: ["submit:td"],
    data() {
        return {
            tdLocal: {},
        };
    },
    watch: {
        td: {
            handler(newVal) {
                if (newVal) {
                    this.tdLocal = JSON.parse(JSON.stringify(newVal));
                } else {
                    this.tdLocal = {
                        MaDocGia: "",
                        MaSach: "",
                        NgayMuon: "",
                        NgayTra: "",
                        TrangThai: "Chờ duyệt", // mặc định khi thêm mới
                    };
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        submitTheoDoi() {
            if (!this.tdLocal.MaDocGia || !this.tdLocal.MaSach) {
                Swal.fire("Lỗi", "Vui lòng nhập đầy đủ Mã Độc Giả và Mã Sách.", "error");
                return;
            }

            if (
                this.tdLocal.NgayTra &&
                new Date(this.tdLocal.NgayTra) < new Date(this.tdLocal.NgayMuon)
            ) {
                Swal.fire("Lỗi", "Ngày trả không được nhỏ hơn ngày mượn.", "error");
                return;
            }

            const sach = this.sachList.find(s => s.MaSach === this.tdLocal.MaSach);
            if (sach && sach.SoQuyen <= 0 && !this.tdLocal._id) {
                Swal.fire("Thông báo", "Sách đã hết, không thể mượn.", "warning");
                return;
            }

            const payload = { ...this.tdLocal };
            if (!payload._id) {
                payload.TrangThai = "Chờ duyệt";
            }
            this.$emit("submit:td", payload);

            Swal.fire("Thành công", "Lưu phiếu mượn thành công!", "success");
        },
    },
};
</script> -->
<template>
    <form @submit.prevent="submitTheoDoi">
        <div class="mb-3">
            <label for="MaDocGia" class="form-label">Mã Độc Giả:</label>
            <select name="MaDocGia" id="MaDocGia" class="form-select" v-model="tdLocal.MaDocGia" required>
                <option value="" disabled>-- Chọn Mã Độc Giả --</option>
                <option v-for="dg in docGiaList" :key="dg._id" :value="dg.MaDocGia">
                    {{ dg.MaDocGia }} - {{ dg.HoLot }} {{ dg.Ten }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">
                Sách Mượn (Tối đa 3 cuốn):
                <span class="badge bg-secondary">{{ tdLocal.ChiTietMuon.length || 0 }}/3</span>
            </label>

            <div v-for="(item, index) in tdLocal.ChiTietMuon" :key="index"
                class="d-flex align-items-center mb-2 p-2 border rounded">
                <div class="flex-grow-1">
                    {{ index + 1 }}. {{ getSachInfo(item.MaSach) }}
                </div>
                <button type="button" class="btn btn-danger btn-sm" @click="removeSach(index)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            <div v-if="tdLocal.ChiTietMuon.length < 3">
                <div class="input-group">
                    <select v-model="selectedNewSachMa" class="form-select"
                        :required="tdLocal.ChiTietMuon.length === 0">
                        <option value="" disabled>-- Chọn Thêm Sách --</option>
                        <option v-for="s in availableSach" :key="s._id" :value="s.MaSach" :disabled="s.SoQuyen <= 0">
                            {{ s.MaSach }} - {{ s.TenSach }} (Còn: {{ s.SoQuyen }})
                        </option>
                    </select>
                    <button type="button" class="btn btn-primary" @click="addSach" :disabled="!selectedNewSachMa">
                        Thêm
                    </button>
                </div>
            </div>
            <div v-else class="alert alert-info mt-2">Đã chọn tối đa 3 cuốn sách.</div>
        </div>
        <div class="mb-3">
            <label for="NgayMuon" class="form-label">Ngày Mượn:</label>
            <input type="date" id="NgayMuon" class="form-control" v-model="tdLocal.NgayMuon" required />
        </div>

        <div class="mb-3">
            <label for="NgayTra" class="form-label">Hạn Trả:</label>
            <input type="date" id="HanTra" class="form-control" v-model="tdLocal.HanTra" />
        </div>

        <div class="mb-3" v-if="tdLocal._id">
            <label for="TrangThai" class="form-label">Trạng Thái:</label>
            <select id="TrangThai" class="form-select" v-model="tdLocal.TrangThai">
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
                <option value="Trễ hạn">Trễ hạn</option>
            </select>
        </div>

        <div v-if="tdLocal.TrangThai === 'Trễ hạn' && tdLocal.TienPhatTamThoi > 0" class="alert alert-danger mt-3">
            <h4><i class="fas fa-exclamation-triangle"></i> CẢNH BÁO: PHIẾU MƯỢN ĐÃ TRỄ HẠN</h4>
            <p>
                <strong>Tổng tiền thuê:</strong> {{ formatCurrency(tdLocal.TongTien) }}
            </p>
            <p>
                <strong>Tiền phạt tạm tính:</strong>
                <span class="text-danger">{{ formatCurrency(tdLocal.TienPhatTamThoi) }}</span>
            </p>
            <hr>
            <p class="h5">
                <strong>TỔNG THANH TOÁN (Tạm tính):</strong>
                <span class="text-primary">{{ formatCurrency(tdLocal.TongThanhToan) }}</span>
            </p>
        </div>


        <button type="submit" class="btn btn-success">
            <i class="fas fa-save"></i> {{ tdLocal._id ? "Cập Nhật" : "Lưu" }}
        </button>
    </form>
</template>

<script>
import Swal from "sweetalert2";

export default {
    name: "TheoDoiMuonSachForm",
    props: {
        td: { type: Object, required: true },
        docGiaList: { type: Array, default: () => [] },
        sachList: { type: Array, default: () => [] }
    },
    emits: ["submit:td"],
    data() {
        return {
            tdLocal: {},
            selectedNewSachMa: "",
        };
    },
    computed: {
        availableSach() {
            // Lấy MaSach của các sách đã chọn
            const currentSach = this.tdLocal.ChiTietMuon.map(item => item.MaSach);
            // Lọc ra sách còn trong kho và chưa được chọn
            return this.sachList.filter(s =>
                s.SoQuyen > 0 && !currentSach.includes(s.MaSach)
            );
        },
    },
    watch: {
        td: {
            handler(newVal) {
                if (newVal) {
                    this.tdLocal = JSON.parse(JSON.stringify(newVal));

                    // Đảm bảo ChiTietMuon là mảng (quan trọng khi sửa bản ghi cũ)
                    if (!this.tdLocal.ChiTietMuon) {
                        this.tdLocal.ChiTietMuon = [];
                    }
                    // Loại bỏ trường MaSach cũ
                    delete this.tdLocal.MaSach;
                } else {
                    this.tdLocal = {
                        MaDocGia: "",
                        ChiTietMuon: [], // Khởi tạo mảng cho thêm mới
                        NgayMuon: new Date().toISOString().split('T')[0],
                        HanTra: "",
                        TrangThai: "Chờ duyệt",
                        TienPhatTamThoi: 0,
                        TongThanhToan: 0
                    };
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        // FIX: HÀM ĐỊNH DẠNG TIỀN TỆ ĐỂ KHẮC PHỤC LỖI "N/A"
        formatCurrency(value) {
            // Chuyển đổi giá trị sang số một cách an toàn
            const numberValue = Number(value);

            // Nếu không phải số (NaN) hoặc số <= 0
            if (isNaN(numberValue) || numberValue <= 0) {
                return 'N/A';
            }

            // Định dạng tiền tệ
            return numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' đ';
        },

        // HÀM SỬ DỤNG DonGia
        getSachInfo(maSach) {
            const sach = this.sachList.find(s => s.MaSach === maSach);

            const donGia = sach ? sach.DonGia : undefined;
            const formattedGia = this.formatCurrency(donGia);

            // Xử lý trường hợp không tìm thấy sách
            const tenSach = sach ? sach.TenSach : maSach;

            return `${tenSach} (Giá: ${formattedGia})`;
        },

        addSach() {
            if (this.selectedNewSachMa && this.tdLocal.ChiTietMuon.length < 3) {
                const sach = this.sachList.find(s => s.MaSach === this.selectedNewSachMa);

                if (sach && sach.SoQuyen > 0) {
                    // Thêm ChiTietMuon (chỉ cần MaSach)
                    this.tdLocal.ChiTietMuon.push({
                        MaSach: this.selectedNewSachMa
                    });
                    this.selectedNewSachMa = ""; // Reset vùng chọn
                } else {
                    Swal.fire("Lỗi", "Sách đã hết hoặc không hợp lệ.", "error");
                }
            }
        },

        removeSach(index) {
            this.tdLocal.ChiTietMuon.splice(index, 1);
            if (this.tdLocal.ChiTietMuon.length === 0) {
                this.selectedNewSachMa = "";
            }
        },

        submitTheoDoi() {
            // KIỂM TRA DỮ LIỆU ĐẦU VÀO
            if (!this.tdLocal.MaDocGia || this.tdLocal.ChiTietMuon.length === 0) {
                Swal.fire("Lỗi", "Vui lòng chọn Mã Độc Giả và ít nhất một cuốn Sách.", "error");
                return;
            }

            if (
                this.tdLocal.NgayTra &&
                new Date(this.tdLocal.NgayTra) < new Date(this.tdLocal.NgayMuon)
            ) {
                Swal.fire("Lỗi", "Ngày trả không được nhỏ hơn ngày mượn.", "error");
                return;
            }

            const payload = { ...this.tdLocal };

            if (!payload._id) {
                delete payload.TrangThai; // Để Backend tự set "Chờ duyệt"
            }

            // loại bỏ các trường tạm thời trước khi gửi lên API
            delete payload.TienPhatTamThoi;
            delete payload.TongThanhToan;

            this.$emit("submit:td", payload);

            // Thông báo thành công (Nên chuyển logic này sang component cha sau khi gọi API)
            // Swal.fire("Thành công", `${payload._id ? "Cập nhật" : "Lưu"} phiếu mượn thành công!`, "success");
        },
    },
};
</script>