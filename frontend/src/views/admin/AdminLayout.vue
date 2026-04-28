<template>
  <div class="admin-page">
    <div class="admin-bg" aria-hidden="true"></div>

    <div class="admin-top">
      <div class="admin-brand">
        <span class="admin-brand-logo">龙建达</span>
      </div>

      <div class="admin-title">
        欢迎使用统一门户（{{ systemStore.currentTarget === 'sales' ? '销售端' : '测试端' }}）
      </div>

      <div class="admin-actions">
        <a-button class="admin-action" @click="toggleTarget">系统切换</a-button>

        <a-button class="admin-action" @click="showConfigModal = true">系统配置</a-button>
        <a-button class="admin-action" @click="showAddModal = true">新增</a-button>
      </div>
    </div>

    <main class="admin-main">
      <div class="admin-grid">
        <div v-for="system in systems" :key="system.id" class="admin-card">
          <div class="admin-card-thumb">
            <img
              v-if="system.imageUrl"
              :src="getImageUrl(system.imageUrl)"
              :alt="system.name"
            />
            <div v-else class="admin-card-thumb-empty">
              <PictureOutlined />
            </div>

            <div class="admin-card-edit" @click.stop="editSystem(system)">
              <EditOutlined />
            </div>
          </div>
          <div class="admin-card-name">{{ system.name }}</div>
        </div>
      </div>

      <a-empty v-if="systems.length === 0 && !loading" description="暂无系统卡片" class="admin-empty" />
      <div v-if="loading" class="admin-loading"><a-spin size="large" /></div>
    </main>

    <!-- Add/Edit Modal -->
    <SystemModal
      v-model:open="showAddModal"
      :is-edit="isEditing"
      :system="currentSystem"
      @submit="handleModalSubmit"
      @delete="handleModalDelete"
    />

    <!-- Config Modal -->
    <ConfigModal
      v-model:open="showConfigModal"
      :target="systemStore.currentTarget"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { PictureOutlined, EditOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useSystemStore } from '@/stores/system';
import { systemsApi } from '@/api/systems';
import SystemModal from '@/components/SystemModal.vue';
import ConfigModal from '@/components/ConfigModal.vue';
import type { System } from '../../types';

const systemStore = useSystemStore();

const systems = ref<System[]>([]);
const loading = ref(false);
const showAddModal = ref(false);
const showConfigModal = ref(false);
const isEditing = ref(false);
const currentSystem = ref<System | undefined>(undefined);

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `/api${url}`;
};

const fetchSystems = async () => {
  loading.value = true;
  try {
    systems.value = await systemsApi.getList(systemStore.currentTarget);
  } catch (error) {
    console.error('Failed to fetch systems:', error);
    message.error('获取系统列表失败');
  } finally {
    loading.value = false;
  }
};

const handleTargetChange = () => {
  fetchSystems();
};

const toggleTarget = () => {
  systemStore.currentTarget = systemStore.currentTarget === 'sales' ? 'test' : 'sales';
  handleTargetChange();
};

const handleModalSubmit = async (data: any) => {
  try {
    if (isEditing.value && currentSystem.value) {
      await systemsApi.update(currentSystem.value.id, data);
      message.success('更新成功');
    } else {
      await systemsApi.create({ ...data, target: systemStore.currentTarget });
      message.success('创建成功');
    }
    showAddModal.value = false;
    isEditing.value = false;
    currentSystem.value = undefined;
    fetchSystems();
  } catch (error) {
    message.error('操作失败');
  }
};

const editSystem = (system: System) => {
  currentSystem.value = system;
  isEditing.value = true;
  showAddModal.value = true;
};

const handleModalDelete = async (id: number) => {
  try {
    await systemsApi.delete(id);
    message.success('删除成功');
    showAddModal.value = false;
    isEditing.value = false;
    currentSystem.value = undefined;
    fetchSystems();
  } catch (error) {
    message.error('删除失败');
  }
};

onMounted(fetchSystems);
watch(() => systemStore.currentTarget, fetchSystems);
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0b44b9 0%, #083a9f 100%);
}

.admin-bg {
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

.admin-top {
  position: relative;
  padding: 18px 40px 0;
}

.admin-brand {
  position: absolute;
  left: 40px;
  top: 16px;
  color: rgba(255, 255, 255, 0.92);
  font-weight: 700;
  letter-spacing: 1px;
}

.admin-title {
  text-align: center;
  color: #fff;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 4px;
  padding-top: 6px;
}

.admin-actions {
  position: absolute;
  right: 40px;
  top: 16px;
  display: flex;
  gap: 12px;
}

.admin-action {
  height: 30px;
  padding: 0 14px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.92);
  border: none;
}

.admin-action:hover {
  background: rgba(255, 255, 255, 0.24);
  color: #fff;
}

.admin-action:deep(.ant-select-selector) {
  background: transparent !important;
  border: none !important;
  height: 30px !important;
  padding: 0 !important;
}

.admin-action:deep(.ant-select-selection-item) {
  color: rgba(255, 255, 255, 0.92) !important;
  line-height: 30px !important;
}

.admin-main {
  position: relative;
  padding: 20px 40px 44px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px 34px;
}

.admin-card {
  cursor: default;
}

.admin-card-thumb {
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
}

.admin-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.admin-card-thumb-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.55);
  font-size: 40px;
}

.admin-card-name {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.admin-card-edit {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 18px;
  height: 18px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
}

.admin-card-edit:hover {
  background: rgba(255, 255, 255, 0.28);
}

.admin-empty {
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.06);
  padding: 50px 0;
  border-radius: 10px;
}

.admin-loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

@media (max-width: 1280px) {
  .admin-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .admin-top {
    padding: 14px 18px 0;
  }
  .admin-brand,
  .admin-actions {
    position: static;
  }
  .admin-actions {
    justify-content: center;
    margin-top: 12px;
  }
  .admin-main {
    padding: 16px 18px 40px;
  }
  .admin-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
}
</style>
