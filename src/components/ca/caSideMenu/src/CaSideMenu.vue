<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, ref, watch} from "vue";
import type {MenuItem} from "@/components/ca/caSideMenu";
import {isArray} from "@/utils/isFu.ts";
import {ChevronDownIcon, ChevronUpIcon, Bars3BottomLeftIcon} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const menuTree = computed<MenuItem[]>(() => {
  const modules = import.meta.glob('@/router/modules/*.ts', {eager: true})
  const menus: MenuItem[] = []

  Object.keys(modules).forEach((key) => {
    const module = modules[key] as any
    // 获取默认导出的根节点（例如 backendRouter 是一个包含单个对象的数组，或者是个对象）
    const rawModule = module.default
    const rootRoute = isArray(rawModule) ? rawModule[0] : rawModule

    if (!rootRoute || rootRoute.meta?.hidden === true) return

    // 组装一级菜单
    const firstLevelMenu: MenuItem = {
      title: rootRoute.meta?.title || '未命名分类',
      path: rootRoute.path,
      name: rootRoute.name,
      icon: rootRoute.meta?.icon || Bars3BottomLeftIcon,
      children: []
    }

    // 组装二级菜单
    if (rootRoute.children && rootRoute.children.length > 0) {
      rootRoute.children.forEach((child: any) => {
        // 除非显式配置 hidden: true，否则默认展示
        if (child.meta?.hidden !== true && child.meta?.title) {
          firstLevelMenu.children?.push({
            title: child.meta.title,
            path: child.path,
            name: child.name,
            icon: child.meta?.icon || Bars3BottomLeftIcon,
            hidden: child.meta?.hidden
          })
        }
      })
    }

    // 如果一级菜单有子项，或者自身就是一个可点击的独立页面，则推入菜单栏
    if (firstLevelMenu.children!.length > 0 || rootRoute.meta?.title) {
      menus.push(firstLevelMenu)
    }
  })

  return menus
})

const activeSubMenuIndex = ref<number | null>(null)

const handleMenuClick = (menu: MenuItem, index: number) => {
  const hasChildren = menu.children && menu.children.length > 0;

  if (isFold.value) {
    isFold.value = false;
  }

  if (hasChildren) {
    activeSubMenuIndex.value = (typeof activeSubMenuIndex.value === 'number') ? null : index;
  } else {
    router.push({ name: menu.name })
  }
}

// 点击二级菜单跳转
const handleChildClick = (childPath: string) => {
  router.push(childPath)
}

watch(
    () => route.path,
    (newPath) => {
      menuTree.value.forEach((menu, index) => {
        const hasActiveChild = menu.children?.some(child => child.path === newPath)
        if (hasActiveChild || menu.path === newPath) {
          activeSubMenuIndex.value = index
        }
      })
    },
    {
      immediate: true
    }
)
let memorizedIndex: number | null = null
const isFold = ref<boolean>(false);
const foldMenu = (index: number | null = null) => {
  if (isFold.value) {
    // 展开
    isFold.value = false;
    if (typeof memorizedIndex === 'number') {
      activeSubMenuIndex.value = memorizedIndex;
    }
  } else {
    // 折叠
    if (typeof activeSubMenuIndex.value === 'number') {
      memorizedIndex = activeSubMenuIndex.value
      activeSubMenuIndex.value = null
    }
    isFold.value = true;
  }
}

defineExpose({foldMenu})

</script>

<template>
  <aside :class="['ca-side-menu', {fold: isFold}]">
    <div class="menu-container">
      <div
          v-for="(menu, index) in menuTree"
          :key="menu.path"
          class="menu-group"
      >
        <!-- 一级菜单 -->
        <div
            :class="['menu-item', 'first-level', { active: route.path === menu.path || route.name === menu.name || activeSubMenuIndex === index }]"
            @click="handleMenuClick(menu, index)"
        >
          <div class="menu-item-left">
            <component
                :is="menu.icon"
                v-if="menu.icon"
                class="menu-icon"
            />
            <span class="menu-title">{{ menu.title }}</span>
          </div>

          <div v-if="menu.children && menu.children.length > 0" class="menu-item-right">
            <ChevronUpIcon v-if="activeSubMenuIndex === index" class="arrow-icon" />
            <ChevronDownIcon v-else class="arrow-icon" />
          </div>
        </div>

        <div
            class="sub-menu"
            :style="{ height: activeSubMenuIndex === index ? `${(menu.children?.length || 0) * 40}px` : '0px' }"
        >
          <div
              v-for="child in menu.children"
              :key="child.path"
              :class="['menu-item', 'second-level', { active: route.path === child.path || route.name === child.name }]"
              @click="handleChildClick(child.path)"
          >
            <div class="menu-item-left">
              <component
                  :is="child.icon"
                  v-if="child.icon"
                  class="menu-icon sub-menu-icon"
              />
              <span class="menu-title">{{ child.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.ca-side-menu {
  width: 240px;
  overflow-y: auto;
  scrollbar-width: none;
  transition: all 300ms ease;
}

.ca-side-menu::-webkit-scrollbar {
  display: none;
}

.menu-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

.menu-group {
  display: flex;
  flex-direction: column;
}

.menu-item {
  width: 240px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.25s ease;
  user-select: none;
}

.menu-item:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
}

.menu-item.active {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.02);
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  transition: color 0.25s;
}

.menu-item:hover .menu-icon,
.menu-item.active .menu-icon {
  color: #fff;
}

.menu-title {
  opacity: 1;
  transition: opacity 300ms ease;
}

.menu-item-right {
  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.45);
}

/* 二级菜单容器 */
.sub-menu {
  overflow: hidden;
  transition: height 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  background-color: #000c17;
}

.menu-item.second-level {
  height: 40px;
  padding-left: 32px;
}

.sub-menu-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.45);
}

.menu-item.second-level.active {
  background-color: var(--color-bg) !important;
  color: #fff;
}
.menu-item.second-level.active .sub-menu-icon {
  color: #fff;
}

/**
 * 折叠
 */
.fold {
  width: 50px;
  overflow: hidden;
}

.fold .menu-title {
  opacity: 0;
}
</style>