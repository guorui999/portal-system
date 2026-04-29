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
        <a-form :label-col="{ style: { width: '80px' } }" :wrapper-col="{ style: { marginLeft: '10px' } }" class="config-form">
          <a-form-item label="背景图片">
            <div class="upload-area">
              <a-upload :customRequest="handleImageUpload" :showUploadList="false" accept="image/png,image/jpeg,image/jpg">
                <div class="upload-box">
                  <template v-if="!formData.backgroundImage">
                    <div class="upload-placeholder">
                      <img :src="nophotoImage" class="nophoto-image" alt="nophoto" />
                      <a-button class="upload-button">
                        <img :src="uploadIcon" class="button-icon" alt="upload" />
                        上传图片
                      </a-button>
                    </div>
                  </template>
                  <template v-else>
                    <img class="upload-preview" :src="getImageUrl(formData.backgroundImage)" alt="预览" />
                  </template>
                </div>
              </a-upload>
              <div v-if="!formData.backgroundImage" class="upload-tip">背景图片格式要求为：png/jpg</div>

              <div v-if="formData.backgroundImage" class="upload-remove" @click="formData.backgroundImage = ''">
                <img :src="deleteIcon" class="delete-icon" alt="delete" />
              </div>
            </div>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <!-- Address Config Tab -->
      <a-tab-pane key="address" tab="地址配置">
        <a-form :label-col="{ style: { width: '100px' } }" :wrapper-col="{ style: { marginLeft: '10px' } }" class="config-form">
          <a-form-item label="管理端地址">
            {{ computedAdminUrl }}
          </a-form-item>

          <a-form-item label="对内系统地址">
            {{ computedInternalUrl }}
          </a-form-item>

          <a-form-item label="对外系统地址">
            {{ computedExternalUrl }}
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <div class="config-footer">
      <a-button class="cancel-btn" @click="handleCancel">取消</a-button>
      <a-button type="primary" :loading="loading" @click="handleSave">确定</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { message } from 'ant-design-vue';
import { configApi } from '@/api/config';
import { uploadApi } from '@/api/upload';
import uploadIcon from '@/assets/images/upload.svg';
import deleteIcon from '@/assets/images/delete.svg';
import nophotoImage from '@/assets/images/nophoto.png';
import type { Target } from '../types';

const props = defineProps<{
  open: boolean;
  target: Target;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'saved': [];
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
const baseUrl = window.location.origin
const computedAdminUrl = computed(() =>
   `${baseUrl}/admin/systems` 
);
const computedInternalUrl = computed(() =>
   `${baseUrl}/test` 
);
const computedExternalUrl = computed(() =>
   `${baseUrl}/sales` 
);

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
    data.backgroundImage = formData.value.backgroundImage || null;
    if (formData.value.ipAddress) {
      data.ipAddress = formData.value.ipAddress;
      data.adminUrl = computedAdminUrl.value;
      data.externalSystemUrl = computedExternalUrl.value;
    }
    
    await configApi.update(props.target, data);
    message.success('保存成功');
    emit('saved');
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
  overflow: auto;
}

.config-tabs :deep(.ant-tabs-nav) {
  margin: 0;
}

.config-form {
  padding: 20px 6px 0;
}

.upload-area {
  position: relative;
  width: 100%;
}

.upload-box {
  width: 236px;
  height: 132px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
}

.upload-icon {
  width: 28px;
  height: 28px;
}

.delete-icon {
  width: 16px;
  height: 16px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.nophoto-image {
  width: 80px;
  height: 68px;
  object-fit: cover;
  border-radius: 4px;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 80px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: rgba(51, 124, 252, 0.1);
  color: #337cfc;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-button:hover {
  background: rgba(51, 124, 252, 0.15);
  color: #337cfc;
}

.button-icon {
  width: 16px;
  height: 16px;
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #8c8c8c;
}

.upload-remove {
  position: absolute;
  left: 240px;
  top: 0;
  width: 24px;
  height: 24px;
  background: #ffffff;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 8px 0px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-remove:hover {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 4px 12px 0px;
  transform: translateY(-1px);
}

.config-footer {
  position: absolute;
  bottom: 32px;
  right: 32px;
  display: flex;
  gap: 12px;
}

.cancel-btn {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.45);
  border: none;
  border-radius: 4px;
}

.cancel-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.65);
}
</style>
