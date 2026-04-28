<template>
  <div class="login-page">
    <div class="login-left">
      <div class="login-left-content">
        <div class="login-left-title">统一门户</div>
        <div class="login-left-sub">Unified Portal</div>
        <div class="login-left-desc">
          统一门户集合企业各类内部系统入口，依托智能导航快速定位目标平台，省去繁琐检索与切换步骤，有效提升办公效率，打造一站式便捷数字化办公体验。
        </div>
      </div>
      <div class="login-illustration" aria-hidden="true"></div>
    </div>

    <div class="login-right">
      <div class="login-panel">
        <div class="login-panel-title">统一门户</div>
        <div class="login-panel-sub">Unified Portal</div>

        <a-form :model="formData" layout="vertical" class="login-form">
          <a-form-item
            label="账号"
            name="username"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <a-input
              v-model:value="formData.username"
              placeholder="请输入账号"
              size="large"
              class="login-input"
            >
              <template #prefix>
                <UserOutlined class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <a-input-password
              v-model:value="formData.password"
              placeholder="请输入密码"
              size="large"
              class="login-input"
            >
              <template #prefix>
                <LockOutlined class="text-gray-400" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="login-remember">
            <a-checkbox v-model:checked="remember">记住登录</a-checkbox>
          </div>

          <a-form-item class="login-submit">
            <a-button
              type="primary"
              html-type="button"
              size="large"
              block
              @click="onLogin"
              :loading="authStore.isLoading"
              class="login-btn"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="login-footnote">为保障您的账号安全，请勿将密码告知他人。</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/auth';
import { message } from 'ant-design-vue';
import type { LoginDto } from '../../types';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
  username: '',
  password: '',
});

const remember = ref(false);

const onLogin = async () => {
  const values: LoginDto = {
    username: formData.username,
    password: formData.password,
  };
  if (!values.username || !values.password) {
    message.error('请输入账号和密码');
    return;
  }

  const success = await authStore.login(values, remember.value);
  if (success) {
    message.success('登录成功');
    router.push('/admin/systems');
  } else {
    message.error('登录失败，请检查用户名和密码');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
}

.login-left {
  flex: 1;
  position: relative;
  background: radial-gradient(1200px 800px at 0% 0%, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0) 60%),
    linear-gradient(180deg, #0b44b9 0%, #083a9f 100%);
  color: #fff;
  overflow: hidden;
}

.login-left-content {
  position: absolute;
  top: 72px;
  left: 80px;
  max-width: 540px;
}

.login-left-title {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.1;
}

.login-left-sub {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.8;
}

.login-left-desc {
  margin-top: 14px;
  font-size: 12px;
  line-height: 1.75;
  opacity: 0.85;
}

.login-illustration {
  position: absolute;
  left: 70px;
  bottom: 40px;
  width: 560px;
  height: 360px;
  background: radial-gradient(220px 160px at 50% 55%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0) 60%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0));
  border-radius: 18px;
  filter: blur(0px);
  opacity: 0.55;
}

.login-right {
  width: 44%;
  min-width: 520px;
  background: #0b44b9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-panel {
  width: 520px;
  height: 620px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.18);
  padding: 78px 84px 0;
}

.login-panel-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.login-panel-sub {
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 6px;
  margin-bottom: 40px;
}

.login-form :deep(.ant-form-item-label > label) {
  font-size: 12px;
  color: #4b5563;
}

.login-input {
  height: 38px;
}

.login-form :deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
}

.login-form :deep(.ant-input) {
  border-radius: 4px;
}

.login-remember {
  margin-top: -6px;
  margin-bottom: 18px;
}

.login-btn {
  height: 44px;
  border-radius: 6px;
  background: #2f78ff;
  border: none;
}

.login-btn:hover {
  background: #1f6cff;
}

.login-footnote {
  margin-top: 18px;
  text-align: center;
  font-size: 10px;
  color: #9ca3af;
}
</style>
