<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { ContextMenuItem, TabItem } from './types';
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
import { useTabStore } from "@/store/useTabStore.ts";
import { useRoute, useRouter } from 'vue-router';
import { defaultPreferences, preferences } from '@/core/preferences';

const colorPrimary = computed(() => (preferences.theme.colorPrimary || defaultPreferences.theme.colorPrimary))

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()

const tabList = computed<TabItem[]>(() => tabStore.tabs)

const visible = ref<boolean>(false)
const menuPosition = ref({ x: 0, y: 0 })
const dropdownTab = ref<TabItem | null>(null)

/**
 * 关闭标签页
 */
const closeTab = (path: string) => {
  const nextPath = tabStore.closeTab(path, route.path)
  if (nextPath && nextPath !== route.path) {
    router.push(nextPath)
  }
}

/**
 * 固定标签页
 */
const tabPin = (path: string) => {
  tabStore.pinTab(path)
}

const tabUnpin = (path: string) => {
  if (path === preferences.app.defaultHomePath) { return }
  tabStore.unpinTab(path)
}

/**
 * 重新加载
 */
const reload = (path: string) => {
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
const openNewWindow = (path: string) => {
  const url = window.location.origin + path
  window.open(url, '_blank')
}

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

/**
 * 关闭左侧标签页
 */
const closeLeft = (path: string) => {
  tabStore.closeLeftTabs(path)
  // 如果激活项被批量删除了，强制聚焦到当前点选的 tab 上
  if (!tabList.value.some(t => t.path === route.path)) {
    router.push(path)
  }
}

const hasCloseableRight = (path?: string): boolean => {
  if (!path) {
    return false
  }
  const index = tabList.value.findIndex(t => t.path === path)
  if (index === -1 || index === tabList.value.length - 1) return false
  return tabList.value.slice(index + 1).some(t => !t.pinned)
}

/**
 * 关闭右侧标签页
 */
const closeRight = (path: string) => {
  tabStore.closeRightTabs(path)
  if (!tabList.value.some(t => t.path === route.path)) {
    router.push(path)
  }
}

const hasCloseableOthers = (path?: string): boolean => {
  if (!path) return false
  return tabList.value.some(t => !(t.pinned || t.path === path))
}

/**
 * 关闭其他标签页
 */
const closeOthers = (path: string) => {
  tabStore.closeOtherTabs(path) 
  if (route.path !== path) {
    router.push(path)
  }
}

const hasCloseableAll = (): boolean => {
  return tabList.value.some(t => !t.pinned)
}

/**
 * 关闭全部标签页
 */
const closeAll = () => {
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
  const isDefaultHome = tab.path === preferences.app.defaultHomePath;
  return [
    {
      key: 'close',
      label: '关闭',
      icon: XMarkIcon,
      disabled: tab.pinned,
      action: () => closeTab(tab.path)
    },
    {
      key: 'pin',
      label: tab.pinned ? '取消固定' : '固定',
      // 根据状态动态切换“固定锁”或“开锁”图标
      icon: tab.pinned ? LockOpenIcon : LockClosedIcon,
      disabled: isDefaultHome,
      action: tab.pinned
        ? () => tabUnpin(tab.path)
        : () => tabPin(tab.path)
    },
    {
      key: 'reload',
      label: '重新加载',
      icon: ArrowPathIcon,
      disabled: false,
      action: () => reload(tab.path)
    },
    {
      key: 'openWindow',
      label: '在新窗口打开',
      icon: ArrowTopRightOnSquareIcon,
      disabled: false,
      action: () => openNewWindow(tab.path)
    },
    {
      key: 'closeLeft',
      label: '关闭左侧标签页',
      icon: ArrowLeftIcon,
      disabled: !hasCloseableLeft(tab.path),
      action: () => closeLeft(tab.path)
    },
    {
      key: 'closeRight',
      label: '关闭右侧标签页',
      icon: ArrowRightIcon,
      disabled: !hasCloseableRight(tab.path),
      action: () => closeRight(tab.path)
    },
    {
      key: 'closeOthers',
      label: '关闭其他标签页',
      icon: MinusCircleIcon,
      disabled: !hasCloseableOthers(tab.path),
      action: () => closeOthers(tab.path)
    },
    {
      key: 'closeAll',
      label: '关闭全部标签页',
      icon: XMarkIcon,
      disabled: !hasCloseableAll(),
      action: closeAll
    }
  ]
})

/**
 * 调用右键菜单
 */
const open = (e: MouseEvent, tab: TabItem) => {
  dropdownTab.value = tab
  menuPosition.value = { x: e.clientX, y: e.clientY }
  visible.value = true
}

/**
 * 关闭右键菜单
 */
const close = () => {
  visible.value = false
}

/**
 * 菜单项点击
 */
const menuClick = (e: Event, item: ContextMenuItem) => {
  e.stopPropagation()
  item.action()
  close()
}

defineExpose({open})

onMounted(() => {
  window.addEventListener('click', close)
})

onUnmounted(() => {
  window.removeEventListener('click', close)
})
</script>

<template>
  <div class="ca-tabs-bar__context-menu"
    v-if="visible"
    @click.stop
    :style="{left: `${menuPosition.x}px`, top: `${menuPosition.y}px`}">
    <div v-for="item in menuItems" :key="item.key">
      <div :class="['context-menu-item', {disabled: item.disabled}]"
        @click="!item.disabled && menuClick($event, item)">
        <!-- 菜单项图标 -->
        <component v-if="item?.icon" :is="item.icon" class="menu-item-icon" />
        <!-- 菜单项文字 -->
        <span class="menu-item-label">{{ item.label }}</span>
      </div>
      <div v-if="item.divider" class="menu-divider"></div>
    </div> 
  </div>
</template>

<style scoped>
.ca-tabs-bar__context-menu {
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