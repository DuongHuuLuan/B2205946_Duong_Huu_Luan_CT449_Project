<template>
    <div class="card stats-card">
        <h4>Thống kê mượn sách</h4>

        <div class="stats-grid">
            <div class="stat">
                <div class="num">{{ formatNumber(normalized.currentBorrowed) }}</div>
                <div class="label">Đang mượn</div>
            </div>

            <div class="stat">
                <div class="num">{{ formatNumber(normalized.totalBorrowed) }}</div>
                <div class="label">Tổng mượn</div>
            </div>

            <div class="stat">
                <div class="num">{{ formatNumber(normalized.overdueCount) }}</div>
                <div class="label">Quá hạn</div>
            </div>
        </div>

        <div v-if="debug" class="debug-box">
            <strong>Raw stats prop:</strong>
            <pre>{{ stats }}</pre>
        </div>

        <div v-if="loading" class="debug-box">
            Đang tải...
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    stats: { type: Object, default: () => ({}) },
    debug: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
});

// lấy giá trị theo nhiều tên có thể có (hỗ trợ backend cũ/ mới)
const getFirst = (obj, keys) => {
    if (!obj) return 0;
    for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null) {
            const n = Number(obj[k]);
            return Number.isFinite(n) ? n : 0;
        }
    }
    return 0;
};

const normalized = computed(() => {
    const s = props.stats ?? {};

    return {
        currentBorrowed: getFirst(s, [
            "currentBorrowed",
            "dangMuon",
            "dangMuonCount",
            "dang_muon",
            "dang_muon_count",
        ]),
        totalBorrowed: getFirst(s, [
            "totalBorrowed",
            "tongSachDaMuon",
            "tongSach",
            "total",
            "tong_sach_da_muon",
            "tongMuon",
        ]),
        overdueCount: getFirst(s, [
            "overdueCount",
            "treHan",
            "treHanCount",
            "overdue",
            "quaHan",
            "quahan",
            "qua_han",
        ]),
    };
});

// format number (nhỏ gọn)
const formatNumber = (n) => {
    try {
        return Number(n).toLocaleString();
    } catch {
        return n ?? 0;
    }
};
</script>

<style scoped>
/* giữ nguyên style cũ */
.card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.05);
}

.stats-grid {
    display: flex;
    gap: 12px;
    margin-top: 12px;
}

.stat {
    flex: 1;
    background: linear-gradient(180deg, #f8fafc, #fff);
    border-radius: 10px;
    padding: 12px;
    text-align: center;
}

.num {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
}

.label {
    font-size: 13px;
    color: #6b7280;
    margin-top: 6px;
}

.debug-box {
    margin-top: 12px;
    padding: 10px;
    background: #f3f4f6;
    border-radius: 8px;
    font-size: 12px;
    color: #111827;
    max-height: 220px;
    overflow: auto;
}
</style>
