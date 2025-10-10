<template>
    <div class="borrow-card">
        <div class="header-status">
            <span :class="['status-badge', borrow.TrangThai.replace(/\s/g, '-').toLowerCase()]">
                {{ borrow.TrangThai }}
            </span>
            <span class="borrow-id">Mã Phiếu: {{ borrow._id.substring(0, 8) }}</span>
        </div>

        <div class="date-info">
            <p>Ngày Mượn: <strong>{{ formatDate(borrow.NgayMuon) }}</strong></p>
            <p>Hạn Trả: <strong :class="{ 'late-return': isLate }">{{ formatDate(borrow.HanTra) }}</strong></p>

            <p v-if="borrow.NgayTra">Ngày Trả: <strong>{{ formatDate(borrow.NgayTra) }}</strong></p>
        </div>

        <div class="book-details">
            <p class="book-list-title">Danh sách sách mượn ({{ borrow.ChiTietMuon.length }})</p>
            <ul>
                <li v-for="item in borrow.ChiTietMuon" :key="item.MaSach">
                    <span>{{ getBookTitle(item.MaSach) }}</span>
                    <span> x {{ item.SoLuong }}</span>
                </li>
            </ul>
        </div>

        <div class="total-cost">
            Tổng Tiền: <span>{{ formatCurrency(borrow.TongTienHienThi) }}</span>
        </div>

        <button v-if="canRequestReturn" @click="handleRequestReturn(borrow._id)" class="btn-return"
            :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang xác nhận...' : 'Xác nhận Đã Trả' }}
        </button>

        <div v-else-if="borrow.TrangThai === 'Yêu cầu trả'" class="info-message">
            Yêu cầu trả sách đang chờ Thủ thư duyệt.
        </div>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import moment from "moment";
import Swal from 'sweetalert2';
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

const props = defineProps({
    borrow: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['borrow-updated']);
const isSubmitting = ref(false);

// Hàm hỗ trợ
function formatCurrency(amount) {
    return Number(amount || 0).toLocaleString('vi-VN');
}

// Định dạng ngày tháng
function formatDate(date) {
    return date ? moment(date).format('DD/MM/YYYY') : 'N/A';
}

function getBookTitle(maSach) {
    const bookInfo = props.borrow.SachThongTin?.find(s => s.MaSach === maSach);
    return bookInfo ? bookInfo.TenSach : `[Mã sách: ${maSach}]`;
}

// Computed properties
const isLate = computed(() => {
    const status = props.borrow.TrangThai;
    if (status !== 'Đang mượn' && status !== 'Trễ hạn') return false;

    return moment(props.borrow.HanTra).isBefore(moment(), 'day');
});

const canRequestReturn = computed(() => {
    const status = props.borrow.TrangThai;
    // Nút chỉ xuất hiện nếu đang mượn HOẶC trễ hạn. Bỏ qua Yêu cầu trả
    return status === 'Đang mượn' || status === 'Trễ hạn';
});

// Logic xác nhận trả sách ngay lập tức
async function handleRequestReturn(borrowId) {
    const result = await Swal.fire({
        title: 'Xác nhận Đã Trả Sách?',
        text: 'Bạn có chắc chắn muốn xác nhận đã trả sách này không? (Hệ thống sẽ ghi nhận ngày trả là hôm nay)',
        icon: 'warning', // Dùng warning để nhấn mạnh hành động
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ'
    });

    if (result.isConfirmed) {
        isSubmitting.value = true;
        try {
            // HỢP NHẤT: Gửi cả TrangThai và NgayTra trong MỘT lần gọi API
            await TheoDoiMuonSachService.update(borrowId, {
                TrangThai: 'Đã trả',
                NgayTra: moment().toISOString(), // Gửi format ISO 8601 để Backend dễ xử lý
            });


            Swal.fire('Thành công', 'Đã xác nhận trả sách thành công! Phiếu mượn đã chuyển sang trạng thái "Đã trả".', 'success');

            // Thông báo cho component cha để tải lại danh sách
            emit('borrow-updated');

        } catch (error) {
            console.error("Lỗi xác nhận trả sách:", error);
            Swal.fire('Thất bại', error.response?.data?.message || 'Không thể xác nhận trả sách. Vui lòng kiểm tra API Backend.', 'error');
        } finally {
            isSubmitting.value = false;
        }
    }
}
</script>

---

<style scoped>
/* CSS giữ nguyên từ phiên bản trước */
.borrow-card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #e2e8f0;
}

.borrow-id {
    font-size: 14px;
    color: #64748b;
}

.status-badge {
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
}

/* Trạng thái màu sắc */
.cho-duyet {
    background-color: #fff3cd;
    color: #ff9800;
}

.dang-muon {
    background-color: #d1e7dd;
    color: #198754;
}

.da-tra {
    background-color: #e9ecef;
    color: #6c757d;
}

.tre-han {
    background-color: #f8d7da;
    color: #dc3545;
}

.yeu-cau-tra {
    background-color: #cfe2ff;
    color: #0d6efd;
}

/* Trạng thái mới */

.date-info p {
    margin: 5px 0;
    font-size: 15px;
}

.late-return {
    color: #dc3545;
    font-weight: 700;
}

.book-details {
    margin-top: 15px;
    padding: 10px 0;
    border-top: 1px solid #f1f5f9;
}

.book-list-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: #475569;
}

.book-details ul {
    list-style: disc;
    padding-left: 20px;
    margin: 0;
}

.book-details li {
    font-size: 14px;
    line-height: 1.6;
}

.total-cost {
    margin-top: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    border-top: 1px dashed #e2e8f0;
    /* Thêm đường kẻ phân cách */
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
}

.total-cost span {
    color: #6c5ce7;
    font-size: 18px;
    font-weight: 700;
}

.btn-return {
    margin-top: 15px;
    width: 100%;
    padding: 10px;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.btn-return:hover:not(:disabled) {
    background-color: #059669;
}

.btn-return:disabled {
    background-color: #99f6e4;
    cursor: not-allowed;
}

.info-message {
    text-align: center;
    padding: 10px;
    margin-top: 15px;
    border-radius: 6px;
    background-color: #cfe2ff;
    /* Màu thông báo */
    color: #0d6efd;
    font-size: 0.9em;
}
</style>