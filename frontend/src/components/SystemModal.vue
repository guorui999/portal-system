<template>
  <a-modal :open="open" :title="isEdit ? '编辑' : '新增'" @cancel="handleCancel" :confirmLoading="loading" width="800px"
    class="system-modal" :footer="null" wrapClassName="system-modal-wrap">
    <a-form ref="formRef" :model="formData" :rules="rules" :label-col="{ style: { width: '50px' } }"
      :wrapper-col="{ style: { marginLeft: '10px' } }" class="system-form">
      <a-form-item label="地址" name="externalUrl" required>
        <a-input v-model:value="formData.externalUrl" placeholder="请输入地址" />
      </a-form-item>

      <a-form-item label="名称" name="name" required>
        <a-input v-model:value="formData.name" placeholder="请输入名称" />
      </a-form-item>

      <a-form-item label="图片" name="imageUrl" required>
        <div class="upload-area">
          <a-upload :customRequest="handleUpload" :showUploadList="false" accept="image/png,image/jpeg,image/jpg">
            <div class="upload-box">
              <template v-if="!formData.imageUrl">
                <div class="upload-placeholder">
                  <img :src="nophotoImage" class="nophoto-image" alt="nophoto" />
                  <a-button class="upload-button">
                    <img :src="uploadIcon" class="button-icon" alt="upload" />
                    上传图片
                  </a-button>
                </div>
              </template>
              <template v-else>
                <img class="upload-preview" :src="getImageUrl(formData.imageUrl)" alt="预览" />
              </template>
            </div>
          </a-upload>
          <div v-if="!formData.imageUrl"  class="upload-tip">背景图片格式要求为：png/jpg</div>

          <div v-if="formData.imageUrl" class="upload-remove" @click="formData.imageUrl = ''">
            <img :src="deleteIcon" class="delete-icon" alt="delete" />
          </div>
        </div>
      </a-form-item>
    </a-form>

    <div class="system-footer">
      <a-button class="cancel-btn" @click="handleCancel">取消</a-button>
      <a-button v-if="isEdit && props.system" class="delete-btn" @click="handleDelete">删除</a-button>
      <a-button type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import uploadIcon from '@/assets/images/upload.svg';
import deleteIcon from '@/assets/images/delete.svg';
import nophotoImage from '@/assets/images/nophoto.png';
import { message, Modal } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { uploadApi } from '@/api/upload';
import type { System } from '../types';

const props = defineProps<{
  open: boolean;
  isEdit: boolean;
  system?: System;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'submit': [data: any];
  'delete': [id: number];
  'cancel': [];
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const uploading = ref(false);

const defaultFormData = {
  name: '',
  type: 'external' as 'internal' | 'external',
  externalUrl: '',
  imageUrl: '',
};

const formData = ref({ ...defaultFormData });

const rules = {
  name: [{ required: true, message: '请输入名称' }],
  externalUrl: [{ required: true, message: '请输入地址' }],
  imageUrl: [{ required: true, message: '请上传封面图片' }],
};

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `/api${url}`;
};

const handleUpload = async ({ file }: any) => {
  uploading.value = true;
  try {
    const result = await uploadApi.uploadImage(file);
    formData.value.imageUrl = result.url;
    formRef.value?.clearValidate(['imageUrl']);
    message.success('上传成功');
  } catch (error) {
    message.error('上传失败');
  } finally {
    uploading.value = false;
  }
};

const handleCancel = () => {
  emit('update:open', false);
  emit('cancel');
  formData.value = { ...defaultFormData };
};

const handleDelete = () => {
  if (!props.system?.id) return;
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除系统「${props.system.name}」吗？此操作不可恢复。`,
    okText: '确定删除',
    okType: 'danger',
    cancelText: '取消',
    centered: true,
    onOk: () => {
      emit('delete', props.system!.id);
    },
  });
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;
    emit('submit', { ...formData.value });
    emit('update:open', false);
    formData.value = { ...defaultFormData };
  } catch (error) {
    // 验证失败
  } finally {
    loading.value = false;
  }
};

// Watch for edit mode
watch(
  () => props.open,
  (newVal) => {
    if (newVal && props.isEdit && props.system) {
      formData.value = {
        name: props.system.name,
        type: props.system.type as 'internal' | 'external',
        externalUrl: props.system.externalUrl,
        imageUrl: props.system.imageUrl,
      };
    } else {
      formData.value = { ...defaultFormData };
    }
  }
);
</script>

<style scoped>
:global(.system-modal-wrap .ant-modal) {
  width: 800px !important;
  max-width: 800px !important;
}

:global(.system-modal-wrap .ant-modal-content) {
  height: 640px !important;
}

:global(.system-modal-wrap .ant-modal-body) {
  overflow: auto;
}

.system-form {
  padding-top: 12px;
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

.system-footer {
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

.delete-btn {
  background: rgba(245, 63, 63, 0.1);
  color: rgba(245, 63, 63, 1);
  border: none;
  border-radius: 4px;
}

.delete-btn:hover {
  background: rgba(245, 63, 63, 0.2);
  color: rgba(245, 63, 63, 1);
}
</style>
