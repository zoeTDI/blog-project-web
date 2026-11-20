<script setup lang="ts">
import { createUser, getAllRoles, page } from '@/api';
import type { CreateUserPayload } from '@/api';
import type { RoleResponse } from '#/permission';
import { sysUserStatus } from '#/user';
import type { SysUserStatusEnum, UserPageItem } from '#/user';
import type { PageResult } from '#/data';
import { useCSSNamespace } from '@caldm/hook';
import { computed, onMounted, reactive, ref } from 'vue';
import {
  CaButton,
  CaCheckbox,
  CaCheckboxGroup,
  CaDialog,
  CaInput,
  CaMessage,
  CaPagination,
  CaTable,
  CaTableColumn,
} from '@caldm/ui';
import {
  EnvelopeIcon,
  IdentificationIcon,
  LockClosedIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline';

const ns = useCSSNamespace("user-list");

const users = ref<UserPageItem[]>([]);
const curPage = ref<number>(1);
const pages = ref<number>(1);
const size = ref<number>(10);

const createVisible = ref<boolean>(false);
const creating = ref<boolean>(false);

const roles = ref<RoleResponse[]>([]);
const rolesLoading = ref<boolean>(false);
const rolesLoaded = ref<boolean>(false);

const form = reactive({
  username: '',
  password: '',
  email: '',
  nickname: '',
});
const selectedRoleIds = ref<number[]>([]);

const cls = computed(() => {
  const classes = [ns.b()];
  return classes;
})

/** 状态徽标样式映射: '正常' -> is-normal / '停用' -> is-disabled */
const statusClass: Record<SysUserStatusEnum, string> = {
  [sysUserStatus.normal]: ns.is('normal'),
  [sysUserStatus.disabled]: ns.is('disabled'),
};

/** 停用用户 (TODO: 对接 banUser 接口) */
const handleBan = (_user: UserPageItem) => {
  // TODO: 调用 banUser 接口
};

/** 删除用户 (TODO: 对接 softDeleteUser 接口) */
const handleDelete = (_user: UserPageItem) => {
  // TODO: 调用 softDeleteUser 接口
};

const onFetchUserPageSuccess = (res: PageResult<UserPageItem>) => {
  users.value = res.records;
  curPage.value = res.page;
  pages.value = res.pages;
}

const fetchUsers = (targetPage: number) => {
  return page({ page: targetPage, size: size.value }).then(onFetchUserPageSuccess);
}

/** 处理分页跳转 */
const handleChange = (cur: number) => {
  curPage.value = cur;
  fetchUsers(cur);
}

const isEmail = (value: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

const resetForm = () => {
  form.username = '';
  form.password = '';
  form.email = '';
  form.nickname = '';
  selectedRoleIds.value = [];
};

const loadRoles = async () => {
  if (rolesLoaded.value || rolesLoading.value) return;

  rolesLoading.value = true;
  try {
    roles.value = await getAllRoles();
    rolesLoaded.value = true;
  } catch {
    CaMessage.error('角色列表加载失败 / FAILED TO LOAD ROLES');
  } finally {
    rolesLoading.value = false;
  }
};

const openCreateDialog = () => {
  createVisible.value = true;
  void loadRoles();
};

const handleCreate = async () => {
  if (creating.value) return;

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

  creating.value = true;
  try {
    await createUser(payload);
    CaMessage.success('创建成功 / USER CREATED');
    createVisible.value = false;
    resetForm();
    fetchUsers(curPage.value).catch(() => {
      // 创建已成功，列表刷新失败时保留当前数据
    });
  } catch {
    CaMessage.error('创建失败 / FAILED TO CREATE USER');
  } finally {
    creating.value = false;
  }
};

onMounted(() => {
  fetchUsers(1);
})
</script>

<template>
  <section :class="cls">
    <div :class="ns.e('toolbar')">
      <CaButton type="primary" :icon="UserPlusIcon" @click="openCreateDialog">
        创建用户
      </CaButton>
    </div>

    <CaTable :data="users">
      <CaTableColumn :prop="'id'" :label="'id'" :width="50" sortable />
      <CaTableColumn :prop="'nickname'" :label="'昵称'" :min-width="100" />
      <CaTableColumn :prop="'username'" :label="'用户名'" :width="80" />
      <CaTableColumn :prop="'email'" :label="'邮箱'" />
      <CaTableColumn :prop="'status'" :label="'状态'" :width="80">
        <template #default="{ row }: { row: UserPageItem }">
          <span :class="[ns.e('status'), statusClass[row.status]]">
            {{ row.status }}
          </span>
        </template>
      </CaTableColumn>
      <CaTableColumn :prop="'roles'" :label="'角色'" :min-width="100">
        <template #default="{ row }: { row: UserPageItem }">
          <span v-if="row.roles?.length" :class="ns.e('roles')">
            <span v-for="role in row.roles" :key="role.id" :class="ns.e('role-tag')">
              {{ role.code }}
            </span>
          </span>
          <span v-else :class="ns.e('empty')">-</span>
        </template>
      </CaTableColumn>
      <CaTableColumn :prop="'createTime'" :label="'创建时间'" sortable>
        <template #default="{ row }: { row: UserPageItem }">
          {{ row.createTime.replace("T", " ") }}
        </template>
      </CaTableColumn>
      <CaTableColumn :prop="'actions'" :label="'操作'" :width="110">
        <template #default="{ row }: { row: UserPageItem }">
          <span :class="ns.e('actions')">
            <CaButton type="text" size="S" @click="handleBan(row)">停用</CaButton>
            <CaButton type="text" size="S" @click="handleDelete(row)">删除</CaButton>
          </span>
        </template>
      </CaTableColumn>
    </CaTable>
    <CaPagination v-if="pages > 1" :max-page="size" :total="pages" @change="handleChange" />

    <CaDialog v-model:visible="createVisible" title="创建新用户 / NEW USER" size="M" @close="resetForm">
      <form :class="ns.e('create-form')" @submit.prevent="handleCreate">
        <div :class="ns.e('form-item')">
          <label :class="ns.e('form-label')">用户名 / USERNAME *</label>
          <CaInput v-model="form.username" :prefix="UserIcon" />
        </div>

        <div :class="ns.e('form-item')">
          <label :class="ns.e('form-label')">密码 / PASSWORD *</label>
          <CaInput v-model="form.password" type="password" :prefix="LockClosedIcon" />
        </div>

        <div :class="ns.e('form-item')">
          <label :class="ns.e('form-label')">邮箱 / EMAIL *</label>
          <CaInput v-model="form.email" :prefix="EnvelopeIcon" />
        </div>

        <div :class="ns.e('form-item')">
          <label :class="ns.e('form-label')">昵称 / NICKNAME</label>
          <CaInput v-model="form.nickname" :prefix="IdentificationIcon" />
        </div>

        <div :class="ns.e('form-item')">
          <label :class="ns.e('form-label')">角色 / ROLES</label>
          <CaCheckboxGroup v-if="roles.length" v-model="selectedRoleIds" size="S" :class="ns.e('role-group')">
            <CaCheckbox v-for="role in roles" :key="role.id" :value="role.id" :label="`${role.name} (${role.code})`" />
          </CaCheckboxGroup>
          <p v-else-if="rolesLoading" :class="ns.e('form-hint')">
            角色加载中 / LOADING ROLES
          </p>
          <p v-else :class="ns.e('form-hint')">
            暂无角色 / NO ROLES AVAILABLE
          </p>
        </div>
      </form>

      <template #footer>
        <CaButton @click="createVisible = false">取消 / CANCEL</CaButton>
        <CaButton type="primary" :loading="creating" @click="handleCreate">
          创建 / CREATE
        </CaButton>
      </template>
    </CaDialog>
  </section>
</template>

<style lang="css" scoped>
.ca-user-list__toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.ca-user-list__status {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
}

.ca-user-list__status.is-normal {
  background: color-mix(in srgb, #22a06b 16%, var(--color-container-bg));
  color: color-mix(in srgb, #22a06b 72%, var(--color-text-h));
}

.ca-user-list__status.is-disabled {
  background: color-mix(in srgb, #d92d20 16%, var(--color-container-bg));
  color: color-mix(in srgb, #d92d20 72%, var(--color-text-h));
}

.ca-user-list__roles {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ca-user-list__role-tag {
  padding: 2px 6px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-text-primary);
}

.ca-user-list__empty {
  color: var(--color-text-primary);
  opacity: 0.5;
}

.ca-user-list__actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ca-user-list__create-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ca-user-list__form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ca-user-list__form-label {
  font-family: var(--font-text);
  font-size: 12px;
  letter-spacing: 0.5px;
  color: var(--color-text-primary);
  opacity: 0.8;
}

.ca-user-list__create-form :deep(.ca-field) {
  width: 100%;
}

.ca-user-list__role-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
}

.ca-user-list__role-group :deep(.ca-checkbox) {
  margin: 0;
}

.ca-user-list__form-hint {
  font-family: var(--font-text);
  font-size: 12px;
  color: var(--color-text-primary);
  opacity: 0.6;
}
</style>
