<template>
    <div class="borrow-card">
        <div class="header-status">
            <span :class="['status-badge', statusClass]">
                {{ borrow.TrangThai }}
            </span>
            <span class="borrow-id">Mã Phiếu: {{ shortId }}</span>
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
            <div class="amounts">
                <div>Tổng Tiền: <strong>{{ formatCurrency(borrow.TongTien) }}</strong></div>
                <div v-if="borrow.TienPhat && borrow.TienPhat > 0" class="fine">
                    Tiền phạt: <strong>{{ formatCurrency(borrow.TienPhat) }}</strong>
                </div>
            </div>

            <div class="total-final">
                Tổng Phải Thanh Toán: <strong>{{ formatCurrency(borrow.TongThanhToan ?? borrow.TongTien) }}</strong>
            </div>
        </div>

        <div v-if="showStaffNotice" class="info-message staff-note">
            Xác nhận trả sách sẽ được nhân viên thư viện xử lý. Nếu bạn đã trả sách trực tiếp tại thư viện, vui lòng
            liên hệ thủ thư để xác nhận.
        </div>

        <div v-else-if="borrow.TrangThai === 'Yêu cầu trả'" class="info-message">
            Yêu cầu trả sách đang chờ thủ thư duyệt.
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import moment from "moment";

const props = defineProps({
    borrow: {
        type: Object,
        required: true
    }
});

function formatCurrency(amount) {
    return Number(amount || 0).toLocaleString('vi-VN');
}
function formatDate(date) {
    return date ? moment(date).format('DD/MM/YYYY') : 'N/A';
}
function getBookTitle(maSach) {
    const bookInfo = props.borrow.SachThongTin?.find(s => s.MaSach === maSach);
    return bookInfo ? bookInfo.TenSach : `[Mã sách: ${maSach}]`;
}

const isLate = computed(() => {
    const status = props.borrow.TrangThai;
    if (status !== 'Đang mượn' && status !== 'Trễ hạn') return false;
    return moment(props.borrow.HanTra).isBefore(moment(), 'day');
});

const shortId = computed(() => {
    try {
        return (props.borrow._id || '').toString().substring(0, 8);
    } catch {
        return '';
    }
});

const statusClass = computed(() => {
    const map = {
        'Chờ duyệt': 'cho-duyet',
        'Đang mượn': 'dang-muon',
        'Đã trả': 'da-tra',
        'Trễ hạn': 'tre-han',
        'Yêu cầu trả': 'yeu-cau-tra'
    };
    return (map[props.borrow.TrangThai] || '').toLowerCase();
});

const showStaffNotice = computed(() => {
    return ['Đang mượn', 'Trễ hạn'].includes(props.borrow.TrangThai);
});
</script>

<style scoped>
/* giữ style cũ + bổ sung .staff-note, .fine */
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
    color: #1e40af;
}

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
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-cost .amounts {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.total-cost .fine {
    color: #dc2626;
    font-weight: 700;
}

.total-final {
    color: #1e40af;
    font-size: 18px;
    font-weight: 700;
}

.info-message {
    text-align: center;
    padding: 10px;
    margin-top: 15px;
    border-radius: 6px;
    background-color: #cfe2ff;
    color: #1e40af;
    font-size: 0.95em;
}

.staff-note {
    background: #fff7ed;
    color: #92400e;
    border: 1px solid #fbbf24;
    padding: 10px;
    margin-top: 12px;
    border-radius: 6px;
    text-align: center;
    font-weight: 600;
}
</style>
