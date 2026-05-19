import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

export const useWindowStore = defineStore('window', () => {
  const scale = ref(1);
  const DESIGN_WIDTH = 1920;

  function updateScale() {
    scale.value = window.innerWidth / DESIGN_WIDTH;
  }

  onMounted(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateScale);
  });

  return { scale };
});
