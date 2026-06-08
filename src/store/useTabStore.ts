import { defineStore } from 'pinia'
import { ref } from 'vue'

// 假设 preferences 可以从你的配置中心或另一个 store 中引入
// import { preferences } from '@/config'

export interface TabItem {
  title: string;
  path: string;
  closeable?: boolean;
}

export const useTabStore = defineStore('tab', () => {
  const tabs = ref<TabItem[]>([])
  
  /**
   * 初始化默认首页
   * @param homePath 默认首页路径，如 preferences.app.defaultHomePath
   * @param homeTitle 默认首页的标题，比如 '首页' 或 'Dashboard'
   */
  const initHomeTab = (homePath: string, homeTitle: string = '首页') => {
    const hasHome = tabs.value.some(tab => tab.path === homePath)
    if (!hasHome) {
      // 插入到数组最前面，且 closeable 设为 false
      tabs.value.unshift({
        title: homeTitle,
        path: homePath,
        closeable: false
      })
    }
  }
  
  /**
   * 添加标签页
   */
  const addTab = (route: { path: string; meta: any }, homePath: string) => {
    if (route.meta?.hidden === true) return
    
    // 1. 确保首页始终存在
    initHomeTab(homePath, '首页') // 标题可以根据你的实际路由 meta 动态传，这里先默认为 '首页'
    
    // 2. 如果当前要添加的就是首页，直接返回（因为 initHomeTab 已经处理过了）
    if (route.path === homePath) return
    
    // 3. 添加其他普通标签页
    const isExist = tabs.value.some(tab => tab.path === route.path)
    if (!isExist) {
      tabs.value.push({
        title: (route.meta?.title as string) || '未命名页面',
        path: route.path,
        // 如果刚好是首页则不可关闭（双重保障），其他页面根据 meta 决定
        closeable: route.path === homePath ? false : route.meta?.closable !== false
      })
    }
  }
  
  /**
   * 关闭标签页
   */
  const closeTab = (path: string, currentPath: string) => {
    const index = tabs.value.findIndex(tab => tab.path === path)
    if (index === -1) return
    
    // 如果该标签被设置成了不可关闭，直接拦截
    if (tabs.value[index].closeable === false) return currentPath
    
    let nextActivePath = currentPath
    if (path === currentPath) {
      const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
      nextActivePath = nextTab ? nextTab.path : homePath
    }
    
    tabs.value.splice(index, 1)
    return nextActivePath
  }
  
  return {
    tabs,
    addTab,
    closeTab,
    initHomeTab
  }
})