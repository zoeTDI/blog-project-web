<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {useRouter} from "vue-router";
import {mockApiFetch} from "@/utils/mock.ts";
import {LockClosedIcon, EnvelopeIcon, ArrowRightIcon} from '@heroicons/vue/24/outline'
import {BACKEND_ROUTER_NAME} from "@/router/modules/backend.ts";
import {useUserStore} from "@/store/useUserStore.ts";

const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useUserStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '请输入邮箱和密码 / PLEASE FILL IN ALL FIELDS';
    return;
  }

  errorMessage.value = '';
  loadingStore.startLoading();

  try {
    // 模拟后端验证登录
    const mockUserResponse = { success: true, token: 'fake-jwt-token', name: 'Admin' };
    const res = await mockApiFetch(mockUserResponse, 1200);

    if (res.success) {
      authStore.set_auth_token(res.token)
      router.push({name: BACKEND_ROUTER_NAME.MANAGEMENT_PAGE});
    }
  } catch (error) {
    errorMessage.value = '认证失败，请检查账户信息 / AUTHENTICATION FAILED';
  }
};

onMounted(() => {
  loadingStore.endLoading()
})
</script>

<template>
  <div class="login">
    <div class="login-card">
      <header class="login-header">
        <h1 class="brand-title">SIGN IN</h1>
        <p class="brand-subtitle">欢迎回来 / WELCOME BACK</p>
      </header>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label class="input-label">邮箱 / EMAIL</label>
          <div class="input-control-wrapper">
            <envelope-icon class="field-icon" />
            <input
                v-model="email"
                type="email"
                placeholder="your-email@example.com"
                class="form-input"
            />
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">密码 / PASSWORD</label>
          <div class="input-control-wrapper">
            <lock-closed-icon class="field-icon" />
            <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="form-input"
            />
          </div>
        </div>

        <Transition name="fade">
          <div v-if="errorMessage" class="error-msg">
            {{ errorMessage }}
          </div>
        </Transition>

        <button type="submit" class="submit-btn">
          <span>进入空间 / ENTER SPACE</span>
          <arrow-right-icon class="btn-icon" />
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 999;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 40px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.brand-title {
  font-family: var(--heading);
  font-size: 32px;
  color: var(--text-h);
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.brand-subtitle {
  font-family: var(--sans);
  font-size: 13px;
  color: var(--text);
  opacity: 0.7;
}

/* 表单排版 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--text);
  opacity: 0.8;
}

.input-control-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text);
  opacity: 0.5;
  pointer-events: none;
}

.form-input {
  width: 100%;
  height: 44px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0 16px 0 44px;
  font-family: var(--sans);
  font-size: 14px;
  color: var(--text-h);
  outline: none;
  transition: all 0.3s ease;
}

/* 高亮交互效果，沿用项目统一样式 */
.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

/* 错误提示 */
.error-msg {
  font-family: var(--sans);
  font-size: 12px;
  color: #ff4d4f; /* 柔和红 */
  text-align: center;
  margin: -4px 0;
}

/* 极简提交按钮 */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 46px;
  background: var(--text-h);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-family: var(--font-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:hover {
  background: var(--accent);
  transform: translateY(-1px);
}

.btn-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}

.submit-btn:hover .btn-icon {
  transform: translateX(4px);
}

/* 错误动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>