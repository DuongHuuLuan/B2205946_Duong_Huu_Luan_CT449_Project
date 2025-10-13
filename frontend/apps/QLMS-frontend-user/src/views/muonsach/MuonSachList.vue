<!-- <template>
    <div class="borrow-list-container">
        <h2 class="title">Phiếu Mượn Của Tôi</h2>

        <div v-if="loading" class="loading-state">
            <p>Đang tải danh sách phiếu mượn...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <p>Không thể tải dữ liệu: {{ error }}</p>
        </div>

        <div v-else>
            <StatusFilter :current-filter="currentFilter" :borrows="borrows" @update:filter="currentFilter = $event" />

            <div v-if="filteredBorrows.length > 0" class="borrow-cards">
                <BorrowCard v-for="borrow in filteredBorrows" :key="borrow._id" :borrow="borrow"
                    @borrow-updated="fetchBorrows" />
            </div>

            <div v-else class="no-data">
                <p>Không có phiếu mượn nào trong trạng thái "{{ currentFilter === 'all' ? 'Tất cả' : currentFilter }}".
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import { useAuthStore } from "@/stores/authStore";

// Import các component con
import StatusFilter from "@/components/phieumuon/StatusFilter.vue";
import BorrowCard from "@/components/phieumuon/BorrowCard.vue";

const authStore = useAuthStore();

const borrows = ref([]);
const loading = ref(true);  
const error = ref(null);
const currentFilter = ref('all');

// Hàm lấy dữ liệu
async function fetchBorrows() {
    if (!authStore.isLoggedIn) return;
    loading.value = true;
    error.value = null;
    try {
        const data = await TheoDoiMuonSachService.findByDocGia();
        borrows.value = data;
    } catch (err) {
        console.error("Lỗi khi tải phiếu mượn:", err);
        error.value = "Vui lòng kiểm tra kết nối API.";
    } finally {
        loading.value = false;
    }
}

// Lọc danh sách
const filteredBorrows = computed(() => {
    if (currentFilter.value === 'all') {
        return borrows.value;
    }
    return borrows.value.filter(b => b.TrangThai === currentFilter.value);
});

onMounted(() => {
    fetchBorrows();
});
</script> -->

<template>
    <div class="borrow-list-container">
        <h2 class="title">Phiếu Mượn Của Tôi</h2>

        <div v-if="loading" class="loading-state">
            <p>Đang tải danh sách phiếu mượn...</p>
        </div>

        <div v-else-if="error" class="error-state">
            <p>Không thể tải dữ liệu: {{ error }}</p>
        </div>

        <div v-else>
            <StatusFilter :current-filter="currentFilter" :borrows="borrows" @update:filter="currentFilter = $event" />

            <div v-if="filteredBorrows.length > 0" class="borrow-cards">
                <BorrowCard v-for="borrow in filteredBorrows" :key="borrow._id" :borrow="borrow" />
            </div>

            <div v-else class="no-data">
                <p>Không có phiếu mượn nào trong trạng thái "{{ currentFilter === 'all' ? 'Tất cả' : currentFilter }}".
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import { useAuthStore } from "@/stores/authStore";

import StatusFilter from "@/components/phieumuon/StatusFilter.vue";
import BorrowCard from "@/components/phieumuon/BorrowCard.vue";

const authStore = useAuthStore();

const borrows = ref([]);
const loading = ref(true);
const error = ref(null);
const currentFilter = ref('all');

async function fetchBorrows() {
    if (!authStore.isLoggedIn) {
        loading.value = false;
        return;
    }
    loading.value = true;
    error.value = null;
    try {
        const data = await TheoDoiMuonSachService.findByDocGia();
        borrows.value = data;
    } catch (err) {
        console.error("Lỗi khi tải phiếu mượn:", err);
        error.value = "Vui lòng kiểm tra kết nối API.";
    } finally {
        loading.value = false;
    }
}

const filteredBorrows = computed(() => {
    if (currentFilter.value === 'all') {
        return borrows.value;
    }
    return borrows.value.filter(b => b.TrangThai === currentFilter.value);
});

onMounted(() => {
    fetchBorrows();
});
</script>


<style scoped>
.borrow-list-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 25px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 10px;
}

.borrow-cards {
    display: grid;
    gap: 20px;
}

.loading-state,
.error-state,
.no-data {
    text-align: center;
    padding: 50px;
    font-size: 16px;
    color: #64748b;
    background-color: #fff;
    border-radius: 8px;
}

.error-state p {
    color: #dc3545;
    font-weight: 600;
}
</style>