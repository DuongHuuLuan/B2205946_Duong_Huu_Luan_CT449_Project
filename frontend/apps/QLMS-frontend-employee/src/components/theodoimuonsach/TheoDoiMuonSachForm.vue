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
</script> -->


<template>
    <div class="container py-4">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="card-header bg-primary text-white py-4">
                <h4 class="mb-0 text-center fw-bold">
                    <i class="fas fa-book-reader me-2"></i>
                    {{ tdLocal._id ? 'CẬP NHẬT PHIẾU MƯỢN' : 'TẠO PHIẾU MƯỢN MỚI' }}
                </h4>
            </div>

            <div class="card-body p-5">
                <form @submit.prevent="submitTheoDoi">

                    <!-- Mã độc giả -->
                    <div class="mb-4">
                        <label class="form-label fw-bold text-primary">
                            <i class="fas fa-user me-2"></i>Mã Độc Giả <span class="text-danger">*</span>
                        </label>
                        <select v-model="tdLocal.MaDocGia" class="form-select form-select-lg border-primary shadow-sm"
                            required>
                            <option value="" disabled>-- Chọn độc giả --</option>
                            <option v-for="dg in docGiaList" :key="dg._id" :value="dg.MaDocGia">
                                {{ dg.MaDocGia }} - {{ dg.HoLot }} {{ dg.Ten }}
                            </option>
                        </select>
                    </div>

                    <!-- Tiêu đề sách -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="mb-0 text-primary fw-bold">
                            <i class="fas fa-book me-2"></i>Sách mượn
                        </h5>
                        <span class="badge bg-primary fs-5 px-4 py-2 rounded-pill shadow">{{ totalBooks }}/3 cuốn</span>
                    </div>

                    <!-- Danh sách sách đã chọn -->
                    <div v-for="(item, index) in tdLocal.ChiTietMuon" :key="index"
                        class="d-flex align-items-center gap-3 p-3 mb-3 border border-primary rounded-3 bg-light shadow-sm">
                        <div class="flex-grow-1">
                            <strong class="text-primary">{{ index + 1 }}.</strong>
                            <span class="text-dark fw-bold">{{ getTenSach(item.MaSach) }}</span>
                            <span class="text-primary ms-2">× {{ item.SoLuong || 1 }}</span>
                        </div>
                        <input type="number" v-model.number="item.SoLuong" min="1" :max="getSoQuyenCon(item.MaSach)"
                            class="form-control w-25 border-primary shadow-sm" />
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="xoaSach(index)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>

                    <!-- Thêm sách mới -->
                    <div v-if="totalBooks < 3" class="input-group mb-4">
                        <select v-model="sachMoi" class="form-select border-primary shadow-sm">
                            <option :value="null" disabled>-- Chọn sách để thêm --</option>
                            <option v-for="s in sachList" :key="s.MaSach" :value="s" :disabled="s.SoQuyen <= 0">
                                {{ s.MaSach }} - {{ s.TenSach }} (Còn: {{ s.SoQuyen }} cuốn)
                            </option>
                        </select>
                        <input type="number" v-model.number="soLuongMoi" min="1" max="3" placeholder="SL"
                            class="form-control border-primary shadow-sm" style="max-width: 100px;" />
                        <button type="button" class="btn btn-primary fw-bold shadow" @click="themSach"
                            :disabled="!sachMoi || totalBooks + soLuongMoi > 3">
                            <i class="fas fa-plus me-1"></i> Thêm
                        </button>
                    </div>

                    <div v-if="totalBooks >= 3" class="alert alert-primary border-primary">
                        <i class="fas fa-info-circle"></i> <strong>Đã đạt giới hạn 3 cuốn sách!</strong>
                    </div>

                    <!-- Ngày mượn & hạn trả -->
                    <div class="row g-4 mb-4">
                        <div class="col-md-6">
                            <label class="form-label fw-bold text-primary">
                                <i class="fas fa-calendar-alt me-2"></i>Ngày mượn <span class="text-danger">*</span>
                            </label>
                            <input type="date" v-model="tdLocal.NgayMuon"
                                class="form-control form-control-lg border-primary shadow-sm" required />
                        </div>
                        <div class="col-md-6">
                            <div class="col-md-6">
                                <label class="form-label fw-bold text-primary">
                                    <i class="fas fa-calendar-check me-2"></i>Hạn trả
                                </label>
                                <input type="date" v-model="tdLocal.HanTra"
                                    class="form-control form-control-lg border-primary shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <!-- Trạng thái (khi sửa) -->
                    <div class="mb-4" v-if="tdLocal._id">
                        <label class="form-label fw-bold text-primary">
                            <i class="fas fa-tasks me-2"></i>Trạng thái
                        </label>
                        <select v-model="tdLocal.TrangThai" class="form-select form-select-lg border-primary shadow-sm">
                            <option value="Chờ duyệt">Chờ duyệt</option>
                            <option value="Đang mượn">Đang mượn</option>
                            <option value="Đã trả">Đã trả</option>
                            <option value="Trễ hạn">Trễ hạn</option>
                        </select>
                    </div>

                    <div v-if="tdLocal.TrangThai === 'Trễ hạn'" class="alert alert-danger border-danger shadow-sm">
                        <h5 class="alert-heading">PHIẾU ĐÃ TRỄ HẠN</h5>
                        <hr>
                        <p class="mb-2">Tiền thuê: <strong>{{ formatTien(tdLocal.TongTien) }}</strong></p>
                        <p class="mb-2 text-danger h5">
                            Phạt trễ hạn: <strong>{{ formatTien(tdLocal.TienPhat) }}</strong>
                        </p>
                        <p class="mb-0 h4 text-primary">
                            Tổng phải trả: <strong>{{ formatTien(tdLocal.TongThanhToan) }}</strong>
                        </p>
                    </div>

                    <!-- Nút submit -->
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-primary btn-lg fw-bold shadow-lg rounded-pill py-3">
                            <i class="fas fa-save me-2"></i>
                            {{ tdLocal._id ? 'CẬP NHẬT PHIẾU MƯỢN' : 'TẠO PHIẾU MƯỢN MỚI' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
    name: "TheoDoiMuonSachForm",
    props: {
        td: { type: Object, default: () => ({}) },
        docGiaList: { type: Array, default: () => [] },
        sachList: { type: Array, default: () => [] }
    },
    emits: ["submit:td"],
    data() {
        return {
            tdLocal: {
                MaDocGia: "",
                ChiTietMuon: [],
                NgayMuon: new Date().toISOString().split("T")[0],
                HanTra: "",
                TrangThai: "Chờ duyệt"
            },
            sachMoi: null,
            soLuongMoi: 1
        };
    },
    computed: {
        totalBooks() {
            return this.tdLocal.ChiTietMuon.reduce((sum, item) => sum + (item.SoLuong || 1), 0);
        }
    },
    watch: {
        td: {
            handler(newVal) {
                this.tdLocal = {
                    ...newVal,
                    MaDocGia: newVal.MaDocGia || "",
                    ChiTietMuon: (newVal.ChiTietMuon || []).map(item => ({
                        MaSach: item.MaSach,
                        SoLuong: item.SoLuong || 1
                    })),
                    NgayMuon: newVal.NgayMuon ? newVal.NgayMuon.slice(0, 10) : new Date().toISOString().split("T")[0],
                    HanTra: newVal.HanTra ? newVal.HanTra.slice(0, 10) : "",
                    TrangThai: newVal.TrangThai || "Chờ duyệt"
                };
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        formatTien(value) {
            const num = Number(value);
            if (isNaN(num) || num <= 0) return "0 đ";
            return num.toLocaleString("vi-VN") + " đ";
        },
        getTenSach(maSach) {
            const s = this.sachList.find(x => x.MaSach === maSach);
            return s ? s.TenSach : "Không tìm thấy";
        },
        getSoQuyenCon(maSach) {
            const s = this.sachList.find(x => x.MaSach === maSach);
            return s ? s.SoQuyen : 1;
        },
        themSach() {
            if (!this.sachMoi) return;
            if (this.totalBooks + this.soLuongMoi > 3) {
                Swal.fire("Lỗi", "Chỉ được mượn tối đa 3 cuốn!", "warning");
                return;
            }
            const exist = this.tdLocal.ChiTietMuon.find(x => x.MaSach === this.sachMoi.MaSach);
            if (exist) {
                exist.SoLuong += this.soLuongMoi;
            } else {
                this.tdLocal.ChiTietMuon.push({
                    MaSach: this.sachMoi.MaSach,
                    SoLuong: this.soLuongMoi
                });
            }
            this.sachMoi = null;
            this.soLuongMoi = 1;
        },
        xoaSach(index) {
            this.tdLocal.ChiTietMuon.splice(index, 1);
        },
        submitTheoDoi() {
            if (!this.tdLocal.MaDocGia) return Swal.fire("Lỗi", "Chọn độc giả!", "warning");
            if (this.tdLocal.ChiTietMuon.length === 0) return Swal.fire("Lỗi", "Chọn ít nhất 1 sách!", "warning");
            if (this.totalBooks > 3) return Swal.fire("Lỗi", "Tối đa 3 cuốn!", "warning");

            const payload = {
                ...this.tdLocal,
                ChiTietMuon: this.tdLocal.ChiTietMuon.map(x => ({
                    MaSach: x.MaSach,
                    SoLuong: x.SoLuong
                }))
            };
            delete payload.TienPhatTamThoi;
            delete payload.TongThanhToan;

            this.$emit("submit:td", payload);
        }
    }
};
</script>

<style scoped>
.card {
    border-radius: 20px !important;
}

.card-header {
    background: linear-gradient(135deg, #007bff, #0056b3) !important;
    border-bottom: 5px solid #0056b3;
}

.btn-primary {
    background: linear-gradient(135deg, #007bff, #0056b3) !important;
    border: none !important;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #0056b3, #004085) !important;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 123, 255, 0.4) !important;
}

.border-primary {
    border-color: #007bff !important;
}

.form-control:focus,
.form-select:focus {
    border-color: #007bff !important;
    box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, .25) !important;
}

.badge {
    background: linear-gradient(135deg, #007bff, #0056b3) !important;
}

.alert-primary {
    background-color: #e7f3ff !important;
    border-color: #007bff !important;
    color: #004085 !important;
}
</style>