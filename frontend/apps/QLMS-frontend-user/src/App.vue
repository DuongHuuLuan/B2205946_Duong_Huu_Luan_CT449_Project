<script setup>
import Header from "@/components/common/Header.vue";
import AppFooter from "@/components/common/AppFooter.vue";
</script>
<style>
@import '@/assets/main.css';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

router-view {
  flex: 1;
}
</style>

<template>
  <Header />
  <router-view />
  <AppFooter />
</template>
