<template>
  <a-modal
    :open="open"
    title="系统配置"
    @cancel="handleCancel"
    :confirmLoading="loading"
    width="800px"
    class="config-modal"
    :footer="null"
    wrapClassName="config-modal-wrap"
  >
    <a-tabs v-model:activeKey="activeTab" class="config-tabs">
      <!-- Page Config Tab -->
      <a-tab-pane key="page" tab="页面配置">
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" class="config-form">
          <a-form-item label="背景图片">
            <div class="config-upload">
              <a-upload
                :customRequest="handleImageUpload"
                :showUploadList="false"
                accept="image/png,image/jpeg"
              >
                <a-button :loading="uploading">
                  <UploadOutlined />
                  {{ formData.backgroundImage ? '重新上传' : '上传背景图片' }}
                </a-button>
              </a-upload>
              <span class="config-help">支持 png、jpg 格式</span>
            </div>
            <div v-if="formData.backgroundImage" class="config-preview">
              <img :src="getImageUrl(formData.backgroundImage)" alt="背景预览" />
            </div>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <!-- Address Config Tab -->
      <a-tab-pane key="address" tab="地址配置">
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" class="config-form">
          <a-form-item label="管理端地址" required>
            <a-input v-model:value="formData.adminUrl" placeholder="请输入管理端地址" />
          </a-form-item>

          <a-form-item label="对应IP" required>
            <a-input v-model:value="formData.ipAddress" placeholder="请输入对应IP" />
          </a-form-item>

          <a-form-item label="对外系统地址" required>
            <a-input v-model:value="formData.externalSystemUrl" placeholder="请输入对外系统地址" />
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <div class="config-footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="loading" @click="handleSave">确定</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { configApi } from '@/api/config';
import { uploadApi } from '@/api/upload';
import type { Target } from '../types';

const props = defineProps<{
  open: boolean;
  target: Target;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const activeTab = ref('page');
const loading = ref(false);
const uploading = ref(false);

const defaultFormData = {
  backgroundImage: '',
  adminUrl: '',
  ipAddress: '',
  externalSystemUrl: '',
};

const formData = ref({ ...defaultFormData });

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `/api${url}`;
};

const fetchConfig = async () => {
  try {
    const config = await configApi.get(props.target);
    if (config) {
      formData.value = {
        backgroundImage: config.backgroundImage || '',
        adminUrl: config.adminUrl || '',
        ipAddress: config.ipAddress || '',
        externalSystemUrl: config.externalSystemUrl || '',
      };
    }
  } catch (error) {
    console.error('Failed to fetch config:', error);
  }
};

const handleImageUpload = async ({ file }: any) => {
  uploading.value = true;
  try {
    const result = await uploadApi.uploadImage(file);
    formData.value.backgroundImage = result.url;
    message.success('上传成功');
  } catch (error) {
    message.error('上传失败');
  } finally {
    uploading.value = false;
  }
};

const handleCancel = () => {
  emit('update:open', false);
  formData.value = { ...defaultFormData };
};

const handleSave = async () => {
  loading.value = true;
  try {
    const data: any = {};
    if (formData.value.backgroundImage) {
      data.backgroundImage = formData.value.backgroundImage;
    }
    if (formData.value.adminUrl) {
      data.adminUrl = formData.value.adminUrl;
    }
    if (formData.value.ipAddress) {
      data.ipAddress = formData.value.ipAddress;
    }
    if (formData.value.externalSystemUrl) {
      data.externalSystemUrl = formData.value.externalSystemUrl;
    }
    
    await configApi.update(props.target, data);
    message.success('保存成功');
    emit('update:open', false);
  } catch (error) {
    message.error('保存失败');
  } finally {
    loading.value = false;
  }
};

// Fetch config when modal opens
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      fetchConfig();
    }
  }
);
</script>

<style scoped>
:global(.config-modal-wrap .ant-modal) {
  width: 800px !important;
  max-width: 800px !important;
}

:global(.config-modal-wrap .ant-modal-content) {
  height: 640px !important;
}

:global(.config-modal-wrap .ant-modal-body) {
  height: calc(640px - 55px);
  overflow: auto;
  padding: 0 24px 16px;
}

.config-tabs :deep(.ant-tabs-nav) {
  margin: 0;
}

.config-form {
  padding: 20px 6px 0;
}

.config-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-help {
  color: #8c8c8c;
  font-size: 12px;
}

.config-preview {
  margin-top: 12px;
}

.config-preview img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.config-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 0 0;
}
</style>
