<template>
  <div class="admin-page" :style="bgStyle">
    <div class="admin-top">

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
        <div v-for="system in systems" :key="system.id" class="admin-card" @click="openSystem(system)">
          <div class="admin-card-thumb">
            <img v-if="system.imageUrl" :src="getImageUrl(system.imageUrl)" :alt="system.name" />
            <div v-else class="admin-card-thumb-empty">
              <img :src="nophotoImage" class="empty-image" alt="nophoto" />
            </div>
          </div>
          <div class="admin-card-name-row">
            <div class="admin-card-name">{{ system.name }}</div>
            <img :src="editIcon" class="edit-icon" alt="edit" @click.stop="editSystem(system)" />
          </div>
        </div>
      </div>

      <a-empty v-if="systems.length === 0 && !loading" description="暂无系统卡片" class="admin-empty" />
      <div v-if="loading" class="admin-loading"><a-spin size="large" /></div>
    </main>

    <!-- Add/Edit Modal -->
    <SystemModal v-model:open="showAddModal" :is-edit="isEditing" :system="currentSystem" @submit="handleModalSubmit"
      @delete="handleModalDelete" @cancel="handleModalCancel" />

    <!-- Config Modal -->
    <ConfigModal v-model:open="showConfigModal" :target="systemStore.currentTarget" @saved="fetchConfigBg" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import nophotoImage from '@/assets/images/nophoto.png';
import editIcon from '@/assets/images/edit.svg';
import systemBgImage from '@/assets/images/system-bg.png';
import { message } from 'ant-design-vue';
import { useSystemStore } from '@/stores/system';
import { systemsApi } from '@/api/systems';
import { configApi } from '@/api/config';
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
const configBgImage = ref('');

const bgStyle = computed(() => ({
  backgroundImage: `url(${configBgImage.value ? getImageUrl(configBgImage.value) : systemBgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

const fetchConfigBg = async () => {
  try {
    const config = await configApi.get(systemStore.currentTarget);
    configBgImage.value = config?.backgroundImage || '';
  } catch (error) {
    console.error('Failed to fetch config:', error);
    configBgImage.value = '';
  }
};

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `/api${url}`;
  return url;
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

const openSystem = (system: System) => {
  const url = system.externalUrl.startsWith('http') ? system.externalUrl : `https://${system.externalUrl}`;
  window.open(url, '_blank');
};

const editSystem = (system: System) => {
  currentSystem.value = system;
  isEditing.value = true;
  showAddModal.value = true;
};

const handleModalCancel = () => {
  isEditing.value = false;
  currentSystem.value = undefined;
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

onMounted(() => {
  fetchSystems();
  fetchConfigBg();
});
watch(() => systemStore.currentTarget, () => {
  fetchSystems();
  fetchConfigBg();
});
</script>

<style scoped>
.admin-page {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.admin-top {
  position: relative;
  padding: 24px 84px 0;
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
  font-size: 48px;
  font-weight: 800;
  letter-spacing: 4px;
}

.admin-actions {
  position: absolute;
  right: 84px;
  top: 36px;
  display: flex;
  gap: 12px;
}

.admin-action {
  width: 120px;
  height: 48px;
  padding: 0 14px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.92);
  border: none;
  font-size: 20px;
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
  padding: 32px 84px 45px;
  max-height: calc(100% - 150px);
  overflow-y: auto;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px 34px;
}

.admin-card {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  padding-bottom: 16px;
  width: 420px;
  height: 286px;
  border-radius: 16px;
}

.admin-card-thumb {
  height: 222px;
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
}

.empty-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
}

.admin-card-name-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-card-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 20px;
  line-height: 1;
  flex: 1;
}


.edit-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
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

</style>
