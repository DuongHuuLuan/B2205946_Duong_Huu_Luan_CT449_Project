<template>
    <div class="status-filter">
        <button v-for="status in statusOptions" :key="status.value"
            :class="['filter-btn', { active: currentFilter === status.value }]"
            @click="$emit('update:filter', status.value)">
            {{ status.label }} ({{ countMap[status.value] }})
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentFilter: {
        type: String,
        required: true
    },
    borrows: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:filter']);

const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ duyệt', value: 'Chờ duyệt' },
    { label: 'Đang mượn', value: 'Đang mượn' },
    { label: 'Trễ hạn', value: 'Trễ hạn' },
    { label: 'Đã trả', value: 'Đã trả' },
];

// Tính toán số lượng cho từng trạng thái
const countMap = computed(() => {
    const map = { all: props.borrows.length };
    statusOptions.filter(s => s.value !== 'all').forEach(status => {
        map[status.value] = props.borrows.filter(b => b.TrangThai === status.value).length;
    });
    return map;
});
</script>

<style scoped>
.status-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
}

.filter-btn {
    padding: 8px 15px;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    background-color: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.filter-btn:hover {
    background-color: #e5e7eb;
}

.filter-btn.active {
    background-color: #6c5ce7;
    color: white;
    border-color: #6c5ce7;
    font-weight: 600;
}
</style>