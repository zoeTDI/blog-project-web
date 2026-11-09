<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CaButton, CaCheckbox, CaCheckboxGroup, CaInput, CaMessage } from '@caldm/ui';
import { useCSSNamespace } from '@caldm/hook';
import {
  EnvelopeIcon,
  IdentificationIcon,
  LockClosedIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline';
import { createUser, getAllRoles } from '@/api';
import type { CreateUserPayload, RoleResponse } from '@/api';

const ns = useCSSNamespace('new-user');

const roles = ref<RoleResponse[]>([]);
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
  email: '',
  nickname: '',
});
const selectedRoleIds = ref<number[]>([]);

const isEmail = (value: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

const resetForm = () => {
  form.username = '';
  form.password = '';
  form.email = '';
  form.nickname = '';
  selectedRoleIds.value = [];
};

const handleSubmit = async () => {
  const { username, password, email, nickname } = form;
  if (!username.trim() || !password || !email.trim()) {
    CaMessage.warn('请填写用户名、密码与邮箱 / PLEASE FILL IN ALL REQUIRED FIELDS');
    return;
  }
  if (!isEmail(email.trim())) {
    CaMessage.warn('邮箱格式不正确 / INVALID EMAIL');
    return;
  }
  const roleIds: number[] = roles.value
    .filter((role) => selectedRoleIds.value.includes(role.id))
    .map((role) => role.id);
  const payload: CreateUserPayload = {
    username: username.trim(),
    password,
    email: email.trim(),
    nickname: nickname.trim() || undefined,
    roleIds,
  };
  loading.value = true;
  try {
    await createUser(payload);
    CaMessage.success('创建成功 / USER CREATED');
    resetForm();
  } catch {
    CaMessage.error('创建失败 / FAILED TO CREATE USER');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    roles.value = await getAllRoles();
  } catch {
    CaMessage.error('角色列表加载失败 / FAILED TO LOAD ROLES');
  }
});
</script>

<template>
  <section :class="ns.b()">
    <header :class="ns.e('header')">
      <h2 :class="ns.e('title')">创建新用户 / NEW USER</h2>
      <p :class="ns.e('subtitle')">填写以下信息创建一个新用户 / FILL IN THE FORM TO CREATE A USER</p>
    </header>

    <form
      :class="ns.e('form')"
      @submit.prevent="handleSubmit">
      <div :class="ns.e('item')">
        <label :class="ns.e('label')">用户名 / USERNAME *</label>
        <CaInput
          v-model="form.username"
          :prefix="UserIcon" />
      </div>

      <div :class="ns.e('item')">
        <label :class="ns.e('label')">密码 / PASSWORD *</label>
        <CaInput
          v-model="form.password"
          type="password"
          :prefix="LockClosedIcon" />
      </div>

      <div :class="ns.e('item')">
        <label :class="ns.e('label')">邮箱 / EMAIL *</label>
        <CaInput
          v-model="form.email"
          :prefix="EnvelopeIcon" />
      </div>

      <div :class="ns.e('item')">
        <label :class="ns.e('label')">昵称 / NICKNAME</label>
        <CaInput
          v-model="form.nickname"
          :prefix="IdentificationIcon" />
      </div>

      <div :class="ns.e('item')">
        <label :class="ns.e('label')">角色 / ROLES</label>
        <CaCheckboxGroup
          v-model="selectedRoleIds"
          :class="ns.e('role-group')">
          <CaCheckbox
            v-for="role in roles"
            :key="role.id"
            :value="role.id"
            :label="`${role.name} (${role.code})`" />
        </CaCheckboxGroup>
        <p
          v-if="!roles.length"
          :class="ns.e('empty')">
          暂无角色 / NO ROLES AVAILABLE
        </p>
      </div>

      <div :class="ns.e('actions')">
        <CaButton
          type="primary"
          :loading="loading"
          :icon="UserPlusIcon"
          @click="handleSubmit">
          创建 / CREATE
        </CaButton>
      </div>
    </form>
  </section>
</template>

<style lang="css" scoped>
.ca-new-user {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.ca-new-user__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ca-new-user__title {
  font-family: var(--font-h);
  font-size: 22px;
  color: var(--color-text-h);
  letter-spacing: 1px;
}

.ca-new-user__subtitle {
  font-family: var(--font-text);
  font-size: 13px;
  color: var(--color-text-h);
  opacity: 0.7;
}

.ca-new-user__form {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
}

.ca-new-user__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ca-new-user__label {
  font-family: var(--font-text);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--color-text-primary);
  opacity: 0.8;
}

.ca-new-user__role-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.ca-new-user__role-group :deep(.ca-checkbox) {
  margin: 0;
}

.ca-new-user__empty {
  font-family: var(--font-text);
  font-size: 12px;
  color: var(--color-text-primary);
  opacity: 0.6;
}

.ca-new-user__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}
</style>
