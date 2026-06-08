<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, ref, watch} from "vue";
import type {MenuItem} from "@/components/ca/caSideMenu";
import {isArray} from "@/utils/isFu.ts";

const route = useRoute()
const router = useRouter()

const menuTree = computed<MenuItem[]>(() => {
  const modules = import.meta.glob('@/router/modules/*.ts', { eager: true })
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
      children: []
    }

    // 组装二级菜单
    if (rootRoute.children && rootRoute.children.length > 0) {
      rootRoute.children.forEach((child: any) => {
        // 除非显式配置 hidden: true，否则默认展示
        if (child.meta?.hidden !== true && child.meta?.title) {
          firstLevelMenu.children?.push({
            title: child.meta.title,
            path: child.path
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

const toggleSubMenu = (index: number) => {
  activeSubMenuIndex.value = activeSubMenuIndex.value === index ? null : index;
}
const handleMenuClick = (path: string) => {
  router.push(path)
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

</script>

<template>
  <div class="ca-side-menu">
    <div
        v-for="(menu, index) in menuTree"
        :key="menu.path"
        class="menu-group"
    >
      <div
          class="menu-item first-level"
          :class="{ 'has-children': menu.children && menu.children.length > 0 }"
          @click="menu.children && menu.children.length > 0 ? toggleSubMenu(index) : handleMenuClick(menu.path)"
      >
        <span class="menu-title">{{ menu.title }}</span>
        <span
            v-if="menu.children && menu.children.length > 0"
            :class="['arrow-icon', { rotated: activeSubMenuIndex === index }]"
        >
          ▼
        </span>
      </div>

      <div
          class="sub-menu-wrapper"
          :style="{ height: activeSubMenuIndex === index ? `${(menu.children?.length || 0) * 40}px` : '0px' }"
      >
        <div
            v-for="child in menu.children"
            :key="child.path"
            :class="['menu-item', 'second-level', { active: route.path === child.path }]"
            @click="handleMenuClick(child.path)"
        >
          <span class="menu-title">{{ child.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ca-side-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

.menu-item {
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

.first-level {
  font-weight: 500;
}

.sub-menu-wrapper {
  overflow: hidden;
  transition: height 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  background-color: #000c17; /* 更深一度的黑色用于区分层级 */
}

.second-level {
  height: 40px;
  padding-left: 32px;
  font-size: 13px;
}

.second-level.active {
  color: #fff;
  background-color: #1890ff; /* 经典高亮蓝 */
}

.arrow-icon {
  font-size: 10px;
  transform: scale(0.8);
  transition: transform 0.25s ease;
  opacity: 0.5;
}
.arrow-icon.rotated {
  transform: scale(0.8) rotate(180deg);
}
</style>