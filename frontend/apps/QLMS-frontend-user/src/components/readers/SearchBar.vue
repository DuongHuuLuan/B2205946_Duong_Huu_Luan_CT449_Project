<!-- src/components/readers/SearchBar.vue -->
<template>
    <div class="searchbar">
        <input class="search-input" :placeholder="placeholder" v-model="keyword" @input="onInput" @keyup.enter="onEnter"
            aria-label="Tìm kiếm sách" />
        <button v-if="keyword" class="search-clear" @click="clear" aria-label="Xóa tìm kiếm" title="Xóa">✕</button>
    </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from "vue";

const props = defineProps({
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "Tìm kiếm sách..." },
    debounceMs: { type: Number, default: 300 },
});

const emits = defineEmits(["update:modelValue", "search"]);

const keyword = ref(props.modelValue);

// small debounce helper
function debounce(fn, delay = 300) {
    let t = null;
    const wrapped = (...args) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
    wrapped.cancel = () => { if (t) { clearTimeout(t); t = null; } };
    return wrapped;
}

// emit search with debounce
const emitSearchDebounced = debounce((val) => {
    emits("update:modelValue", val);
    emits("search", val);
}, props.debounceMs);

watch(() => props.modelValue, (v) => {
    // external v-model change -> update local
    keyword.value = v || "";
});

function onInput() {
    emitSearchDebounced(keyword.value.trim());
}

function onEnter() {
    // immediate emit without waiting debounce
    emitSearchDebounced.cancel();
    emits("update:modelValue", keyword.value.trim());
    emits("search", keyword.value.trim());
}

function clear() {
    emitSearchDebounced.cancel();
    keyword.value = "";
    emits("update:modelValue", "");
    emits("search", "");
}

onBeforeUnmount(() => {
    emitSearchDebounced.cancel();
});
</script>

<style scoped>
.searchbar {
    position: relative;
    width: 100%;
}

.search-input {
    width: 100%;
    padding: 10px 36px 10px 12px;
    border-radius: 8px;
    border: 1px solid #e6e6f0;
    outline: none;
    box-shadow: 0 1px 3px rgba(18, 20, 40, 0.03);
    transition: box-shadow .12s, border-color .12s;
}

.search-input:focus {
    border-color: #8b5cf6;
    /* purple accent */
    box-shadow: 0 6px 18px rgba(109, 40, 217, 0.06);
}

.search-clear {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #6b7280;
    padding: 4px;
}

.search-clear:hover {
    color: #111827;
}
</style>
