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
          <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input v-model:value="formData.username" placeholder="请输入账号" size="large" class="login-input">
              <template #prefix>
                <img :src="usernameIcon" class="input-icon" alt="username" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="formData.password" placeholder="请输入密码" size="large" class="login-input">
              <template #prefix>
                <img :src="passwordIcon" class="input-icon" alt="password" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="login-remember">
            <a-checkbox v-model:checked="remember">记住登录</a-checkbox>
          </div>

          <a-form-item class="login-submit">
            <a-button type="primary" html-type="button" size="large" block @click="onLogin"
              :loading="authStore.isLoading" class="login-btn">
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
import usernameIcon from '@/assets/images/username.svg';
import passwordIcon from '@/assets/images/password.svg';
import bgImage from '@/assets/images/background.png';
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
  background: url('@/assets/images/background.png') no-repeat center center;
  background-size: cover;
}

.login-left {
  flex: 1;
  position: relative;
  color: #fff;
  overflow: hidden;
}

.login-left-content {
  position: absolute;
  top: 120px;
  left: 120px;
  max-width: 540px;
}

.login-left-title {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.1;
}

.login-left-sub {
  margin-top: 10px;
  font-size: 20px;
  opacity: 0.8;
}

.login-left-desc {
  margin-top: 14px;
  font-size: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  height: 100vh;
}

.login-panel {
  width: 800px;
  height: 100%;
  border-radius: 6px;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.18);
  padding: 250px 140px 250px 140px;
  background: rgba(255, 255, 255, 1);
}

.login-panel-title {
  text-align: left;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.login-panel-sub {
  text-align: left;
  font-size: 16px;
  color: #9ca3af;
  margin-top: 12px;
  margin-bottom: 80px;
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
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}

.input-icon {
  width: 16px;
  height: 16px;
}
</style>
