<template>
  <div class="portal-home">
    <div class="portal-bg" aria-hidden="true"></div>

    <div class="portal-content">
      <div class="portal-title">欢迎使用统一门户</div>

      <div class="portal-grid">
        <div
          v-for="system in systems"
          :key="system.id"
          class="portal-item"
          @click="openSystem(system)"
        >
          <div class="portal-thumb">
            <img
              v-if="system.imageUrl"
              :src="getImageUrl(system.imageUrl)"
              :alt="system.name"
            />
            <div v-else class="portal-thumb-empty">
              <PictureOutlined />
            </div>
          </div>
          <div class="portal-name">{{ system.name }}</div>
        </div>
      </div>

      <a-empty v-if="systems.length === 0 && !loading" description="暂无系统卡片" class="portal-empty" />
      <div v-if="loading" class="portal-loading"><a-spin size="large" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PictureOutlined } from '@ant-design/icons-vue';
import { systemsApi } from '@/api/systems';
import type { System, Target } from '../types';

const route = useRoute();

const target = computed<Target>(() => route.meta.target as Target || 'sales');
const systems = ref<System[]>([]);
const loading = ref(false);

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `/api${url}`;
};

const fetchSystems = async () => {
  loading.value = true;
  try {
    systems.value = await systemsApi.getList(target.value);
  } catch (error) {
    console.error('Failed to fetch systems:', error);
  } finally {
    loading.value = false;
  }
};

const openSystem = (system: System) => {
  window.open(system.externalUrl, '_blank');
};

onMounted(fetchSystems);
</script>

<style scoped>
.portal-home {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0b44b9 0%, #083a9f 100%);
}

.portal-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1200px 680px at 70% 20%, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 60%),
    radial-gradient(900px 500px at 0% 0%, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0) 55%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0) 1px, rgba(255, 255, 255, 0) 140px);
  opacity: 0.55;
  transform: skewX(-12deg) translateX(-8%);
  transform-origin: center;
}

.portal-content {
  position: relative;
  padding: 36px 56px 48px;
}

.portal-title {
  text-align: center;
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 4px;
  margin-bottom: 24px;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px 34px;
  align-items: start;
}

.portal-item {
  cursor: pointer;
}

.portal-thumb {
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.portal-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.portal-thumb-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.55);
  font-size: 40px;
}

.portal-name {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.portal-empty {
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.06);
  padding: 50px 0;
  border-radius: 10px;
}

.portal-loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

@media (max-width: 1280px) {
  .portal-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .portal-content {
    padding: 24px 18px 40px;
  }
  .portal-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
}
</style>
