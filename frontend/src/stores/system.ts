import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Target } from '../types';

export const useSystemStore = defineStore('system', () => {
  // State
  const currentTarget = ref<Target>('sales');

  // Actions
  function setTarget(target: Target) {
    currentTarget.value = target;
  }

  return {
    currentTarget,
    setTarget,
  };
});
