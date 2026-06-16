import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface UserInfo {
  email: string;
  nickname: string;
  avatar: string;
}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<UserInfo | null>(null);
    const authToken = ref<string>('');
    const role = ref<string>('');
    const menus = ref<string[]>([]);

    const getUserInfo = (): UserInfo | null => {
      return userInfo.value;
    };
    const setUserInfo = (newVal: UserInfo): void => {
      userInfo.value = newVal;
    };
    const getAuthToken = () => {
      return authToken.value;
    };
    const setAuthToken = (value: string) => {
      authToken.value = value;
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

    const logout = () => {
      authToken.value = '';
      role.value = '';
      menus.value = [];
      userInfo.value = null;
    };
    return {
      userInfo,
      authToken,
      role,
      menus,
      getUserInfo,
      setUserInfo,
      getAuthToken,
      setAuthToken,
      getRole,
      setRole,
      getMenus,
      setMenus,
      logout,
    };
  },
  {
    persist: {
      pick: ['userInfo', 'authToken', 'role', 'menus'],
    },
  }
);
