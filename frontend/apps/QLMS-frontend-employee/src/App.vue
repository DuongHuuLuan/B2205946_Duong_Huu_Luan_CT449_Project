<script setup>
import Header from "@/components/Header.vue";
</script>

<template>
  <div id="app">
    <!-- Thanh header điều hướng -->
    <Header />

    <!-- Nội dung trang -->
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>
<!-- 
<style>
#app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style> -->
