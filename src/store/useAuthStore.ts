import {defineStore} from "pinia";
import {ref} from "vue";

export const useAuthStore = defineStore(
    'auth',
    () => {
        const auth_token = ref<string>('');

        const get_auth_token = () => {
            return auth_token.value;
        }
        const set_auth_token = (token: string) => {
            auth_token.value = token;
        }

        /**
         * 登出方法
         */
        const logout = () => {
            set_auth_token('');
        }
        return {
            auth_token,
            get_auth_token,
            set_auth_token,
            logout,
        }
    },
    {
        persist: {
            pick: ['auth_token'],
        }
    }
)