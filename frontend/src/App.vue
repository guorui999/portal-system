<template>
  <a-config-provider :get-popup-container="getPopupContainer">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { useWindowStore } from '@/stores/window';

const windowStore = useWindowStore();

function getPopupContainer() {
  return document.getElementById('app')!;
}

watchEffect(() => {
  document.documentElement.style.setProperty('--scale', String(windowStore.scale));
});
</script>

<style>
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
  zoom: var(--scale);
}
</style>
