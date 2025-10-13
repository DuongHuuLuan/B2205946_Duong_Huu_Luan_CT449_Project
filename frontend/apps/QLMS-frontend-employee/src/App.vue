<script setup>
import Header from "@/components/Header.vue";
</script>

<template>
  <div id="app">
    <Header />

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>
