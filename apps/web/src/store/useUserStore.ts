import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LoginRes } from '@/api/authApi.ts';

export const useUserStore = defineStore(
  'user',
  () => {
    const id = ref<number | null>(null);
    const email = ref<string | null>(null);
    const username = ref<string | null>(null);
    const nickname = ref<string | null>(null);
    const avatar = ref<string | null>(null);
    const token = ref<string | null>(null);
    const role = ref<string | null>(null);
    const menus = ref<string[] | null>(null);

    const getId = () => id.value;
    const setId = (val: number) => (id.value = val);

    const getEmail = () => email.value;
    const setEmail = (val: string) => (email.value = val);

    const getUsername = () => username.value;
    const setUsername = (val: string) => (username.value = val);

    const getNickname = () => nickname.value;
    const setNickname = (val: string) => (nickname.value = val);

    const getAvatar = () => avatar.value;
    const setAvatar = (val: string) => (avatar.value = val);

    const getToken = () => {
      return token.value;
    };
    const setToken = (value: string) => {
      token.value = value;
    };

    const getRole = () => {
      return role.value;
    };
    const setRole = (value: string) => {
      role.value = value;
    };

    const getMenus = () => {
      return menus.value;
    };
    const setMenus = (value: string[]) => {
      menus.value = value;
    };

    const login = (data: LoginRes) => {
      setId(data.id);
      setEmail(data.email);
      setUsername(data.username);
      setNickname(data.nickname);
      setAvatar(data.avatar);
      setToken(data.token);
      setRole(data.role);
      setMenus(data.menus);
    };
    const logout = () => {
      id.value = null;
      email.value = null;
      username.value = null;
      nickname.value = null;
      avatar.value = null;
      token.value = null;
      role.value = null;
      menus.value = null;
    };
    return {
      id,
      email,
      username,
      nickname,
      avatar,
      token,
      role,
      menus,
      getId,
      setId,
      getEmail,
      setEmail,
      getUsername,
      setUsername,
      getNickname,
      setNickname,
      getAvatar,
      setAvatar,
      getToken,
      setToken,
      getRole,
      setRole,
      getMenus,
      setMenus,
      login,
      logout,
    };
  },
  {
    persist: {
      pick: [
        'id',
        'email',
        'username',
        'nickname',
        'avatar',
        'token',
        'role',
        'menus',
      ],
    },
  }
);
