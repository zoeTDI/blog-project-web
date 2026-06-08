<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, onUnmounted, ref} from "vue";
import type {ContextMenuItem, TabItem} from "@/components/ca/caTabsBar";
import {
  XMarkIcon,
  LockClosedIcon,
  LockOpenIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MinusCircleIcon
} from "@heroicons/vue/24/outline";
import {useTabStore} from "@/store/useTabStore.ts";
import {defaultPreferences, preferences} from "@/core/preferences";

const colorPrimary = computed(() => (preferences.theme.colorPrimary || defaultPreferences.theme.colorPrimary));

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()

const activeTabPath = computed(() => route.path)
const tabList = computed<TabItem[]>(() => tabStore.tabs)

const isActiveFirst = computed(() => {
  if (tabList.value.length === 0) return false
  return tabList.value[0].path === activeTabPath.value
})
const isActiveLast = computed(() => {
  if (tabList.value.length === 0) return false
  return tabList.value[tabList.value.length - 1].path === activeTabPath.value
})

const visible = ref<boolean>(false);
const menuPosition = ref({x: 0, y: 0})
const dropdownTab = ref<TabItem | null>(null)

/**
 * 调用右键菜单
 */
const openContextMenu = (e: MouseEvent, tab: TabItem) => {
  dropdownTab.value = tab
  menuPosition.value = {x: e.clientX, y: e.clientY}
  visible.value = true
}

/**
 * 关闭右键菜单
 */
const closeContextMenu = () => {
  visible.value = false
}

/**
 * 状态置灰状态的辅助校验逻辑
 */
const hasCloseableLeft = (path?: string): boolean => {
  if (!path) {
    return false
  }
  const index = tabList.value.findIndex(t => t.path === path)
  if (index < 0) {
    return false
  }
  return tabList.value.slice(0, index).some(t => !t.pinned)
}

const hasCloseableRight = (path?: string): boolean => {
  if (!path) {
    return false
  }
  const index = tabList.value.findIndex(t => t.path === path)
  if (index === -1 || index === tabList.value.length - 1) return false
  return tabList.value.slice(index + 1).some(t => !t.pinned)
}

const hasCloseableOthers = (path?: string): boolean => {
  if (!path) return false
  return tabList.value.some(t => !(t.pinned || t.path === path))
}

const hasCloseableAll = (): boolean => {
  return tabList.value.some(t => !t.pinned)
}

/**
 * 关闭标签页
 */
const handleTabClose = (path: string) => {
  const nextPath = tabStore.closeTab(path, route.path)
  if (nextPath && nextPath !== route.path) {
    router.push(nextPath)
  }
}

/**
 * 固定标签页
 */
const handlePin = (path: string) => {
  tabStore.pinTab(path)
}

/**
 * 解除标签页固定
 */
const handleTabUnpin = (path: string) => {
  // 不可关闭默认固定的标签页
  if (path === preferences.app.defaultHomePath) {
    return
  }
  tabStore.unpinTab(path)
}

/**
 * 重新加载
 */
const handleReload = (path: string) => {
  if (route.path !== path) {
    router.push(path).then(() => {
      router.go(0)
    })
  } else {
    router.go(0)
  }
}

/**
 * 在新窗口中打开
 */
const handleOpenWindow = (path: string) => {
  const url = window.location.origin + path
  window.open(url, '_blank')
}

/**
 * 关闭左侧标签页
 */
const handleCloseLeft = (path: string) => {
  tabStore.closeLeftTabs(path)
  // 如果激活项被批量删除了，强制聚焦到当前点选的 tab 上
  if (!tabList.value.some(t => t.path === route.path)) {
    router.push(path)
  }
}

/**
 * 关闭友侧标签页
 */
const handleCloseRight = (path: string) => {
  tabStore.closeRightTabs(path)
  if (!tabList.value.some(t => t.path === route.path)) {
    router.push(path)
  }
}

/**
 * 关闭其他标签页
 */
const handleCloseOthers = (path: string) => {
  console.log("=>(CaTabsBar.vue:155) tabList.value", tabList.value);
  tabStore.closeOtherTabs(path)
  console.log("=>(CaTabsBar.vue:158) tabList.value", tabList.value);
  if (route.path !== path) {
    router.push(path)
  }
}

/**
 * 关闭全部标签页
 */
const handleCloseAll = () => {
  tabStore.closeAllTabs()
  // 保留默认固定首页后，高亮切回留存的第一项
  if (tabList.value.length > 0) {
    router.push(tabList.value[0].path)
  }
}

/**
 * 右键菜单配置项
 */
const menuItems = computed((): ContextMenuItem[] => {
  if (!dropdownTab.value) return []
  const tab: TabItem = dropdownTab.value;
  return [
    {
      key: 'close',
      label: '关闭',
      icon: XMarkIcon,
      disabled: tab.pinned,
      action: () => handleTabClose(tab.path)
    },
    {
      key: 'pin',
      label: tab.pinned ? '取消固定' : '固定',
      // 根据状态动态切换“固定锁”或“开锁”图标
      icon: tab.pinned ? LockOpenIcon : LockClosedIcon,
      disabled: false,
      action: tab.pinned
          ? () => handleTabUnpin(tab.path)
          : () => handlePin(tab.path)
    },
    {
      key: 'reload',
      label: '重新加载',
      icon: ArrowPathIcon,
      disabled: false,
      action: () => handleReload(tab.path)
    },
    {
      key: 'openWindow',
      label: '在新窗口打开',
      icon: ArrowTopRightOnSquareIcon,
      disabled: false,
      action: () => handleOpenWindow(tab.path)
    },
    {
      key: 'closeLeft',
      label: '关闭左侧标签页',
      icon: ArrowLeftIcon,
      disabled: !hasCloseableLeft(tab.path),
      action: () => handleCloseLeft(tab.path)
    },
    {
      key: 'closeRight',
      label: '关闭右侧标签页',
      icon: ArrowRightIcon,
      disabled: !hasCloseableRight(tab.path),
      action: () => handleCloseRight(tab.path)
    },
    {
      key: 'closeOthers',
      label: '关闭其他标签页',
      icon: MinusCircleIcon,
      disabled: !hasCloseableOthers(tab.path),
      action: () => handleCloseOthers(tab.path)
    },
    {
      key: 'closeAll',
      label: '关闭全部标签页',
      icon: XMarkIcon,
      disabled: !hasCloseableAll(),
      action: handleCloseAll
    }
  ]
})

/**
 * 标签页跳转
 * @param path
 */
const handleClickTab = (path: string) => {
  if (route.path === path) {
    return
  }
  router.push(path)
}

/**
 * 菜单项点击
 */
const handleMenuClick = (e: Event, item: ContextMenuItem) => {
  e.stopPropagation()
  item.action()
  closeContextMenu()
}

onMounted(() => {
  window.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
  window.removeEventListener('click', closeContextMenu)
})
</script>

<template>
  <nav :class="['tabs-bar', { 'is-first-active': isActiveFirst, 'is-last-active': isActiveLast }]">
    <div v-for="tab in tabList"
         :key="tab.path"
         :class="['tab-item', {active: activeTabPath === tab.path}]"
         @click="handleClickTab(tab.path)"
         @contextmenu.prevent="openContextMenu($event, tab)"
    >
      <component v-if="tab.icon" :is="tab.icon" class="tab-item-icon"/>
      <span class="tab-title">{{ tab.title }}</span>
      <!--      固定图标-->
      <span v-if="tab.pinned" class="pin-icon" @click="handleTabUnpin($event, tab.path)">
        <lock-closed-icon/>
      </span>
    </div>
    <div v-if="visible"
         :style="{left: menuPosition.x + 'px', top: menuPosition.y + 'px'}"
         class="context-menu"
         @click.stop
    >
      <div v-for="item in menuItems" :key="item.key">
        <div :class="['context-menu-item', { disabled: item.disabled }]"
             @click="!item.disabled && handleMenuClick($event, item)">
          <component
              v-if="item.icon"
              :is="item.icon"
              class="menu-item-icon"
          />

          <span class="menu-item-label">{{ item.label }}</span>
        </div>
        <div v-if="item.divider" class="menu-divider"></div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.tabs-bar {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  border-bottom: 2px solid v-bind(colorPrimary);
  padding: 0 4px;
  background: #fff;
}

.tab-item-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  flex-shrink: 0;
  display: inline-block;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  background-color: #fafafa;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  user-select: none;
}

.tab-item:not(:has(.pin-icon)) {
  /*添加额外右边距，使文字在视觉上居中对齐*/
  padding-right: 18px;
}


.tab-item:hover {
  color: v-bind(colorPrimary);
  background-color: #f5f5f5;
}

.tab-item.active {
  color: #fff;
  background-color: v-bind(colorPrimary);
  height: 33px;
  border-radius: 4px 4px 0 0;
  margin-bottom: -1px;
  position: relative;
  z-index: 2;
}

.tab-item.active::before {
  --s: 10px;
  content: '';
  position: absolute;
  width: var(--s);
  height: var(--s);
  bottom: 0;
  left: 0;
  transform: translateX(-98%);
  background: radial-gradient(circle at 0% 0%, transparent 0px, transparent var(--s), v-bind(colorPrimary) var(--s), v-bind(colorPrimary) 100%);
}

.tabs-bar.is-first-active .tab-item.active::before {
  display: none;
}

.tab-item.active::after {
  --s: 10px;
  content: '';
  position: absolute;
  width: var(--s);
  height: var(--s);
  bottom: 0;
  right: 0;
  transform: translateX(98%);
  background: radial-gradient(circle at 100% 0%, transparent 0px, transparent var(--s), v-bind(colorPrimary) var(--s), v-bind(colorPrimary) 100%);
}

.tabs-bar.is-last-active .tab-item.active::after {
  display: none;
}

.tab-title {
  white-space: nowrap;
}

.pin-icon {
  margin-left: 6px;
  display: flex;
  align-items: center;
  color: v-bind(colorPrimary);
}

.tab-item.active .pin-icon {
  color: #fff;
}

.pin-icon svg {
  width: 13px;
  height: 13px;
}

/* 新增样式：右键快捷菜单 */
.context-menu {
  position: fixed;
  z-index: 9999;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 150px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  color: #333;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.context-menu-item:hover:not(.disabled) {
  background-color: #f5f5f5;
  color: v-bind(colorPrimary);
}

.context-menu-item.disabled {
  color: #bfbfbf;
  cursor: not-allowed;
}

.menu-item-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  flex-shrink: 0;
}

.menu-divider {
  white-space: nowrap;
}
</style>