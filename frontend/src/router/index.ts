import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/sales',
    },
    {
      path: '/sales',
      name: 'SalesHome',
      component: () => import('@/views/HomePage.vue'),
      meta: { target: 'sales' },
    },
    {
      path: '/test',
      name: 'TestHome',
      component: () => import('@/views/HomePage.vue'),
      meta: { target: 'test' },
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: () => import('@/views/admin/LoginPage.vue'),
    },
    {
      path: '/admin',
      redirect: '/admin/systems',
    },
    {
      path: '/admin/systems',
      name: 'AdminSystems',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/admin/login');
  } else if (to.path === '/admin/login' && authStore.isLoggedIn) {
    next('/admin/systems');
  } else {
    next();
  }
});

export default router;
