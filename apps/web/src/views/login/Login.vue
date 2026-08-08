<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import {
    LockClosedIcon,
    EnvelopeIcon,
    ArrowRightIcon,
  } from '@heroicons/vue/24/outline';
  import { BACKEND_ROUTER_NAME } from '@/router/modules/analysis.ts';
  import { useUserStore } from '@/store/useUserStore.ts';
  import {
    loginUP,
    loginEP,
    loginEC,
    sendLoginCode,
    type LoginUPReq,
    type LoginEPReq,
    type LoginECReq,
    type LoginCodeReq,
  } from '@/api/authApi.ts';
  import { CaButton, CaIcon, CaMessage } from '@caldm/ui';
  import { isString } from '@caldm/utils';
  import { useCSSNamespace } from '@caldm/hook';

  const router = useRouter();
  const userStore = useUserStore();
  const ns = useCSSNamespace('login');

  const loginType = ref<'password' | 'code'>('password');
  const loading = ref<boolean>(false);
  const account = ref('');
  const password = ref('');
  const code = ref('');
  let timer: ReturnType<typeof setInterval> | null = null;
  const count = ref<number>(60);

  function isEmail(email: string): boolean {
    // 常见邮箱正则（支持字母、数字、点、下划线、百分号、加号、连字符）
    // 域名部分至少包含一个点，顶级域名至少2个字符
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const buildPayload = (): LoginUPReq | LoginEPReq | LoginECReq => {
    if (loginType.value === 'password') {
      if (isEmail(account.value)) {
        return {
          email: account.value,
          password: password.value,
        } as LoginEPReq;
      } else {
        return {
          username: account.value,
          password: password.value,
        } as LoginUPReq;
      }
    } else {
      return {
        email: account.value,
        code: code.value,
      } as LoginECReq;
    }
  };

  const handleSendCode = async () => {
    const payload: LoginCodeReq = {
      email: account.value,
    };
    try {
      const res = await sendLoginCode(payload);
      if (!res) {
        CaMessage.success('发送成功');
        timer = setInterval(() => {
          count.value--;
        }, 1000);
      }
    } catch (e) {
      CaMessage.error('发送失败');
    }
  };

  const handleLogin = async () => {
    if (
      loginType.value == 'password' &&
      (!isString(account.value) ||
        account.value.trim() == '' ||
        !password.value ||
        password.value.trim() == '')
    ) {
      CaMessage.warn('请输入邮箱或密码 / PLEASE FILL IN ALL FIELDS');
      return;
    }
    if (
      loginType.value === 'code' &&
      (!isString(account.value) ||
        account.value.trim() == '' ||
        !code.value ||
        code.value.trim() == '')
    ) {
      CaMessage.warn('请输入邮箱或验证码 / PLEASE FILL IN ALL FIELDS');
      return;
    }
    const payload = buildPayload();
    try {
      let res;
      if (loginType.value === 'password') {
        if (isEmail(account.value)) {
          res = await loginEP(payload as LoginEPReq);
        } else {
          res = await loginUP(payload as LoginUPReq);
        }
      } else {
        res = await loginEC(payload as LoginECReq);
      }
      userStore.login(res);
      await router.push({ name: BACKEND_ROUTER_NAME.DASHBOARD });
    } catch (error) {
      CaMessage.error('认证失败，请检查账户信息 / AUTHENTICATION FAILED');
    }
  };

  watch(
    () => count.value,
    () => {
      if (count.value <= 0) {
        clearInterval(Number(timer));
        timer = null;
        count.value = 60;
      }
    }
  );
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('container')">
      <header :class="ns.e('welcome')">
        <h1 :class="ns.e('title')">SIGN IN</h1>
        <p :class="ns.e('subtitle')">欢迎回来 / WELCOME BACK</p>
      </header>

      <div
        :class="ns.em('wrapper', 'password')"
        v-show="loginType === 'password'">
        <form
          @submit.prevent="handleLogin"
          :class="ns.e('form')">
          <div :class="ns.e('form-item')">
            <label :class="ns.e('label')">邮箱 / EMAIL</label>
            <div :class="ns.e('control-wrapper')">
              <div :class="ns.e('control')">
                <CaIcon
                  :icon="EnvelopeIcon"
                  :size="18" />
                <input
                  v-model="account"
                  type="text"
                  placeholder="用户名或邮箱"
                  class="form-input" />
              </div>
            </div>
          </div>

          <div :class="ns.e('form-item')">
            <label :class="ns.e('label')">密码 / PASSWORD</label>
            <div :class="ns.e('control-wrapper')">
              <div :class="ns.e('control')">
                <CaIcon
                  :icon="LockClosedIcon"
                  :size="18" />
                <input
                  v-model="password"
                  type="password"
                  placeholder="密码"
                  class="form-input" />
              </div>
            </div>
          </div>

          <CaButton
            :type="'primary'"
            :loading="loading"
            :icon="ArrowRightIcon"
            @click="handleLogin">
            进入空间 / ENTER SPACE
          </CaButton>
          <div
            :class="ns.e('more-login-method')"
            @click="loginType = 'code'">
            其他登录方式
          </div>
        </form>
      </div>

      <div
        :class="ns.m('code')"
        v-show="loginType === 'code'">
        <form
          @submit.prevent="handleLogin"
          :class="ns.e('form')">
          <div :class="ns.e('form-item')">
            <label :class="ns.e('label')">邮箱 / EMAIL</label>
            <div :class="ns.e('control-wrapper')">
              <div :class="ns.e('control')">
                <CaIcon
                  :icon="EnvelopeIcon"
                  :size="18" />
                <input
                  v-model="account"
                  type="email"
                  placeholder="邮箱"
                  class="form-input" />
              </div>
            </div>
          </div>

          <div :class="ns.e('form-item')">
            <label :class="ns.e('label')">验证码 / CODE</label>
            <div :class="ns.e('control-wrapper')">
              <div :class="ns.e('control')">
                <CaIcon
                  :icon="LockClosedIcon"
                  :size="18" />
                <input
                  v-model="code"
                  type="text"
                  placeholder="验证码"
                  class="form-input" />
              </div>
              <CaButton
                :type="'primary'"
                :disabled="count < 60"
                :class="ns.se('code', 'btn')"
                @click="handleSendCode">
                <span v-show="count == 60">获取验证码</span>
                <span v-show="count < 60">{{ count }}</span>
              </CaButton>
            </div>
          </div>
          <CaButton
            :type="'primary'"
            :loading="loading"
            :icon="ArrowRightIcon"
            @click="handleLogin">
            进入空间 / ENTER SPACE
          </CaButton>
          <div
            :class="ns.e('more-login-method')"
            @click="loginType = 'password'">
            其他登录方式
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ca-login {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 999;
  }

  .ca-login__container {
    width: 100%;
    max-width: 420px;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    padding: 40px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .ca-login__welcome {
    text-align: center;
    margin-bottom: 36px;
  }

  .ca-login__title {
    font-family: var(--font-h);
    font-size: 32px;
    color: var(--color-text-h);
    letter-spacing: 2px;
    margin-bottom: 6px;
  }

  .ca-login__subtitle {
    font-family: var(--font-text);
    font-size: 13px;
    color: var(--color-text-h);
    opacity: 0.7;
  }

  .ca-login__wrapper--password {
  }

  .ca-login__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ca-login__form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ca-login__label {
    font-family: var(--font-text);
    font-size: 11px;
    letter-spacing: 1px;
    color: var(--color-text-primary);
    opacity: 0.8;
  }

  .ca-login__control-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    column-gap: 8px;
  }

  .ca-login__control {
    flex: 1 1 100%;
    background-color: var(--color-bg);
    padding-left: 8px;
    box-shadow: 0 0 2px #aaa;
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-input {
    width: 100%;
    height: 44px;
    background: var(--color-bg);
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 0 16px 0 14px;
    font-family: var(--font-text);
    font-size: 14px;
    color: var(--color-text-primary);
    outline: none;
    transition: all 0.3s ease;
  }

  .ca-login-code__btn {
    align-self: stretch;
    height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    min-width: 66px;
    min-height: 46px;
  }

  .ca-login__more-login-method {
    text-align: right;
    font-family: var(--font-text);
    font-size: 13px;
    color: var(--color-text-h);
    opacity: 0.7;
    cursor: pointer;
  }
</style>
