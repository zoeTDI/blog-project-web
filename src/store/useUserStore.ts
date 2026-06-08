import {defineStore} from "pinia";
import {ref} from "vue";

export const useUserStore = defineStore(
  'user',
  () => {
    const authToken = ref<string>('')
    const role = ref<string>('');
    const menus = ref<string[]>([])
    
    const getAuthToken = () => {
      return authToken.value;
    }
    const setAuthToken = (value: string) => {
      authToken.value = value;
    }
    const getRole = () => {
      return role.value;
    }
    const setRole = (value: string) => {
      role.value = value;
    }
    const getMenus = () => {
      return menus.value;
    }
    const setMenus = (value: string[]) => {
      menus.value = value
    }
    
    const logout = () => {
      authToken.value = '';
      role.value = '';
      menus.value = []
    }
    return {
      authToken,
      role,
      menus,
      getAuthToken,
      setAuthToken,
      getRole,
      setRole,
      getMenus,
      setMenus,
      logout
    }
  },
  {
    persist: {
      pick: ['authToken', 'role', 'menus']
    }
  }
)