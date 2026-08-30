import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LoginRes } from '@/api';


export const useUserStore = defineStore(
  'user',
  () => {
    const id = ref<number | null>(null);
    const email = ref<string | null>(null);
    const username = ref<string | null>(null);
    const nickname = ref<string | null>(null);
    const avatar = ref<string | null>(null);
    const roles = ref<string[] | null>(null);
    const menus = ref<string[] | null>(null);
    const loggedIn = ref<boolean>(false);

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

    const getRoles = () => {
      return roles.value;
    };
    const setRoles = (value: string[]) => {
      roles.value = value;
    };

    const getMenus = () => {
      return menus.value;
    };
    const setMenus = (value: string[]) => {
      menus.value = value;
    };

    const getLoggedIn = () => loggedIn.value;
    const setLoggedIn = (val: boolean) => (loggedIn.value = val);

    const isLoggedIn = () => loggedIn.value;

    const login = (data: LoginRes) => {
      setId(data.id);
      setEmail(data.email);
      setUsername(data.username);
      setNickname(data.nickname);
      setAvatar(data.avatar);
      setRoles(data.roles);
      setMenus(data.menus);
      setLoggedIn(true);
    };
    const logout = () => {
      id.value = null;
      email.value = null;
      username.value = null;
      nickname.value = null;
      avatar.value = null;
      roles.value = null;
      menus.value = null;
      loggedIn.value = false;
    };
    return {
      id,
      email,
      username,
      nickname,
      avatar,
      roles,
      menus,
      loggedIn,
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
      getRoles,
      setRoles,
      getMenus,
      setMenus,
      getLoggedIn,
      setLoggedIn,
      isLoggedIn,
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
        'roles',
        'menus',
        'loggedIn',
      ],
    },
  }
);
