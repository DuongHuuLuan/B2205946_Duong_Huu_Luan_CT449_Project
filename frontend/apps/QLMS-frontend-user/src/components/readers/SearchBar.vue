<template>
    <input v-model="keyword" @input="$emit('search', keyword)" type="text" placeholder="Tìm kiếm sách..."
        class="search-input" />
</template>

<script setup>
import { ref } from "vue";
const keyword = ref("");
</script>

<style scoped>
.search-input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
}
</style>
