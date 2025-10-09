<template>
    <div class="empty-state">
        <p>{{ text }}</p>
    </div>
</template>

<script setup>
defineProps({ text: String });
</script>

<style scoped>
.empty-state {
    text-align: center;
    padding: 2rem;
    color: #888;
}
</style>
