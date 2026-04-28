import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/api/auth';
import type { LoginDto } from '../types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string>(localStorage.getItem('token') || sessionStorage.getItem('token') || '');
  const isLoading = ref(false);

  // Getters
  const isLoggedIn = computed(() => !!token.value);

  // Actions
  async function login(credentials: LoginDto, remember = true) {
    isLoading.value = true;
    try {
      const response = await authApi.login(credentials);
      token.value = response.access_token;
      if (remember) {
        localStorage.setItem('token', response.access_token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', response.access_token);
        localStorage.removeItem('token');
      }
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    token.value = '';
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  return {
    token,
    isLoading,
    isLoggedIn,
    login,
    logout,
  };
});
