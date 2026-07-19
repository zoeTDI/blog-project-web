import {defineStore} from "pinia";
import {ref} from "vue";

export const usePreferenceStore = defineStore('preferenceStore', () => {
  
  // 首先尝试获取浏览器缓存，也就是用户设置的选项
  // 其次读取.env环境设置
  // 以上两项都没有，提供一个保底值
  const loadingProgress = ref<boolean>(
    // todo 应当封装统一的storage操作类
    localStorage.getItem('preference_loading_progress') == null
      ? import.meta.env.VITE_LOADING_PROGRESS == 'true'
      : false
  )
  const getLoadingProgress = () => {
    return loadingProgress.value
  }
  const setLoadingProgress = (value: boolean) => {
    loadingProgress.value = value
  }
  return {
    loadingProgress,
    getLoadingProgress,
    setLoadingProgress,
  }
})