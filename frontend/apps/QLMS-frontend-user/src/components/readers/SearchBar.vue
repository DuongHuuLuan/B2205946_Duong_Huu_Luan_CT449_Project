<template>
    <div class="searchbar">
        <div class="search-inner">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
            </svg>
            <input class="search-input" :placeholder="placeholder" v-model="keyword" @input="onInput"
                @keyup.enter="onEnter" aria-label="Tìm kiếm sách" />
            <button v-if="keyword" class="search-clear" @click="clear" aria-label="Xóa tìm kiếm" title="Xóa">
                ✕
            </button>
        </div>
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

function debounce(fn, delay = 300) {
    let t = null;
    const wrapped = (...args) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
    wrapped.cancel = () => {
        if (t) {
            clearTimeout(t);
            t = null;
        }
    };
    return wrapped;
}

const emitSearchDebounced = debounce((val) => {
    emits("update:modelValue", val);
    emits("search", val);
}, props.debounceMs);

watch(
    () => props.modelValue,
    (v) => {
        keyword.value = v || "";
    }
);

function onInput() {
    emitSearchDebounced(keyword.value.trim());
}
function onEnter() {
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
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 0;
}

.search-inner {
    position: relative;
    width: 100%;
    max-width: 380px;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #9ca3af;
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 10px 40px 10px 36px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    outline: none;
    background: #ffffff;
    font-size: 14px;
    color: #111827;
    transition: box-shadow 0.12s, border-color 0.12s, background 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.search-input:focus {
    border-color: #8b5cf6;
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.08);
    background: #fafaff;
}

.search-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: #f3f4f6;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 14px;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s, color 0.12s;
}

.search-clear:hover {
    background: #e5e7eb;
    color: #111827;
}

@media (max-width: 640px) {
    .search-inner {
        max-width: 100%;
    }

    .search-input {
        font-size: 13px;
    }
}
</style>