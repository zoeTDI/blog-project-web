<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, onUnmounted, ref} from "vue";
import type {ContextMenuItem, TabItem} from "@/components/ca/caTabsBar";
import {XMarkIcon, LockClosedIcon} from "@heroicons/vue/24/outline";
import {useTabStore} from "@/store/useTabStore.ts";
import {preferences} from "@/core/preferences";

const router = useRouter()
const route = useRoute()
const tabStore = useTabStore()

const activeTabPath = computed(() => route.path)
const tabList = computed<TabItem[]>(() => tabStore.tabs)

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
const hasCloseableLeft = (path?: string) => {
  if (!path) {
    return false
  }
  const index = tabList.value.findIndex(t => t.path === path)
  if (index < 0) {
    return false
  }
  return tabList.value.slice(0, index).some(t => !t.pinned)
}

const hasCloseableRight = (path?: string) => {
  if (!path) {
    return false
  }
  const index = tabList.value.findIndex(t => t.path === path)
  if (index === -1 || index === tabList.value.length - 1) return false
  return tabList.value.slice(index + 1).some(t => !t.pinned)
}

const hasCloseableOthers = (path?: string) => {
  if (!path) return false
  return tabList.value.some(t => !t.pinned)
}

const hasCloseableAll = () => {
  return tabList.value.some(t => !t.pinned)
}

/**
 * 各核心交互指令分发
 * @param path
 */
const handleClose = (path: string) => {
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
const handleTabUnpin = (e: Event, path: string) => {
  e.stopPropagation()
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

const handleCloseLeft = (path: string) => {
  tabStore.closeLeftTabs(path)
  // 如果激活项被批量删除了，强制聚焦到当前点选的 tab 上
  if (!tabList.value.some(t => t.path === route.path)) {
    router.push(path)
  }
}

const handleCloseRight = (path: string) => {
  tabStore.closeRightTabs(path)
  if (!tabList.value.some(t => t.path === route.path)) {
    router.push(path)
  }
}

const handleCloseOthers = (path: string) => {
  tabStore.closeOtherTabs(path)
  if (route.path !== path && !tabList.value.some(t => t.path === route.path)) {
    router.push(path)
  }
}

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
const menuItems = computed((): ContextMenuItem[] => [
  {
    key: 'close',
    label: '关闭',
    disabled: !dropdownTab.value || dropdownTab.value.closeable === false || dropdownTab.value.pinned,
    action: () => handleClose(dropdownTab.value!.path)
  },
  {
    key: 'pin',
    label: '固定',
    disabled: !dropdownTab.value || dropdownTab.value.pinned,
    action: () => handlePin(dropdownTab.value!.path)
  },
  {
    key: 'reload',
    label: '重新加载',
    disabled: false,
    action: () => handleReload(dropdownTab.value!.path)
  },
  {
    key: 'openWindow',
    label: '在新窗口打开',
    disabled: false,
    divider: true, // 标记在此项后渲染分隔线
    action: () => handleOpenWindow(dropdownTab.value!.path)
  },
  {
    key: 'closeLeft',
    label: '关闭左侧标签页',
    disabled: !hasCloseableLeft(dropdownTab.value?.path),
    action: () => handleCloseLeft(dropdownTab.value!.path)
  },
  {
    key: 'closeRight',
    label: '关闭右侧标签页',
    disabled: !hasCloseableRight(dropdownTab.value?.path),
    action: () => handleCloseRight(dropdownTab.value!.path)
  },
  {
    key: 'closeOthers',
    label: '关闭其他标签页',
    disabled: !hasCloseableOthers(dropdownTab.value?.path),
    action: () => handleCloseOthers(dropdownTab.value!.path)
  },
  {
    key: 'closeAll',
    label: '关闭全部标签页',
    disabled: !hasCloseableAll(),
    action: () => handleCloseAll()
  }
])

const handleClickTab = (path: string) => {
  router.push(path)
}

const handleTabClose = (e: Event, path: string) => {
  e.stopPropagation()
  const nextPath = tabStore.closeTab(path, route.path)
  if (nextPath && nextPath !== route.path) {
    router.push(nextPath)
  }
}

const handleMenuClick = (item: any) => {
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
  <nav class="tabs-bar">
    <div v-for="tab in tabList"
         :key="tab.path"
         :class="['tab-item', {active: activeTabPath === tab.path}]"
         @click="handleClickTab(tab.path)"
         @contextmenu.prevent="openContextMenu($event, tab)"
    >
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
      <template v-for="item in menuItems" :key="item.key">
        <div :class="['menu-item-option', {disabled: item.disabled}]"
             @click="!item.disabled && handleMenuClick(item)">
          {{ item.label }}
        </div>
        <div v-if="item.divider" class="menu-divider"></div>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.tabs-bar {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-bottom: 1px solid transparent;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  user-select: none;
}

.tab-item:hover {
  color: #1890ff;
  background-color: #f5f5f5;
}

.tab-item.active {
  color: #1890ff;
  background-color: #fff;
  border-color: #e8e8e8;
  height: 33px; /* 微微提高 1px，盖住 nav 的下边框，形成连贯视觉 */
  margin-bottom: -1px;
  position: relative;
  z-index: 2;
}

.tab-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1890ff;
  border-radius: 4px 4px 0 0;
}

.tab-title {
  white-space: nowrap;
}

.pin-icon {
  margin-left: 6px;
  display: flex;
  align-items: center;
  color: #1890ff;
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

.menu-item-option {
  padding: 7px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.menu-item-option:hover:not(.disabled) {
  background-color: #f5f5f5;
  color: #1890ff;
}

.menu-item-option.disabled {
  color: #bfbfbf;
  cursor: not-allowed;
  background-color: transparent;
}

.menu-divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 4px 0;
}
</style>