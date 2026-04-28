<template>
  <a-modal
    :open="open"
    :title="isEdit ? '编辑系统' : '新增系统'"
    @cancel="handleCancel"
    :confirmLoading="loading"
    width="800px"
    class="system-modal"
    :footer="null"
    wrapClassName="system-modal-wrap"
  >
    <a-form ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" class="system-form">
      <a-form-item label="地址" name="externalUrl" required>
        <a-input v-model:value="formData.externalUrl" placeholder="请输入跳转地址" />
      </a-form-item>

      <a-form-item label="名称" name="name" required>
        <a-input v-model:value="formData.name" placeholder="请输入系统名称" />
      </a-form-item>

      <a-form-item label="图片" name="imageUrl" required>
        <div class="upload-area">
          <a-upload :customRequest="handleUpload" :showUploadList="false" accept="image/png,image/jpeg,image/jpg">
            <div class="upload-box">
              <template v-if="!formData.imageUrl">
                <PictureOutlined class="upload-icon" />
                <div class="upload-text">上传图片</div>
              </template>
              <template v-else>
                <img class="upload-preview" :src="getImageUrl(formData.imageUrl)" alt="预览" />
              </template>
            </div>
          </a-upload>
          <div class="upload-tip">背景图片格式支持 png/jpg</div>

          <a-button v-if="formData.imageUrl" type="text" danger class="upload-remove" @click="formData.imageUrl = ''">
            <DeleteOutlined />
          </a-button>
        </div>
      </a-form-item>
    </a-form>

    <div class="system-footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button v-if="isEdit && props.system" danger @click="handleDelete">删除</a-button>
      <a-button type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { PictureOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
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
  name: [{ required: true, message: '请输入系统名称' }],
  externalUrl: [{ required: true, message: '请输入跳转地址' }],
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
  formData.value = { ...defaultFormData };
};

const handleDelete = () => {
  if (props.system?.id) {
    emit('delete', props.system.id);
  }
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
  height: calc(640px - 55px);
  overflow: auto;
  padding: 0 24px 12px;
}

.system-form {
  padding-top: 12px;
}

.upload-area {
  position: relative;
  width: 260px;
}

.upload-box {
  width: 180px;
  height: 110px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
}

.upload-icon {
  font-size: 28px;
  color: #bfbfbf;
}

.upload-text {
  margin-top: 6px;
  font-size: 12px;
  color: #1890ff;
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
  left: 190px;
  top: 8px;
}

.system-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 6px;
}
</style>
