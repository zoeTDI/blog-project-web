<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, ref, watch } from 'vue';
  import type { MenuItem } from './types';
  import { isArray } from '@/utils/isFu.ts';
  import { Bars3BottomLeftIcon } from '@heroicons/vue/24/outline';
  import { preferences } from '@/core/preferences';
  import { useI18n } from 'vue-i18n';
  import { ROUTER_PREFIX } from '@/plugins/i18n.ts';
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import {
    CaSideMenuGroup,
    CaSideMenuOption,
  } from '@/components/ca/caSideMenu';
  import { HeroIcon } from '@/components/icon';

  const { t } = useI18n();
  const route = useRoute();
  const ns = useCSSNamespace('side-menu');

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.is('fold', isFold.value)];
    return cls;
  });

  const translateString = (str: string): string => {
    if (str.startsWith(ROUTER_PREFIX)) {
      return t(str);
    }
    return str;
  };

  const handleMenuSort = (menuItems: MenuItem[]): MenuItem[] => {
    const obj = {
      positiveItems: [] as MenuItem[],
      negativeItems: [] as MenuItem[],
      otherItems: [] as MenuItem[],
    };
    menuItems.reduce((acc, cur: MenuItem) => {
      if (typeof cur?.no !== 'number') {
        acc.otherItems.push(cur);
      } else if (cur.no < 0) {
        acc.negativeItems.push(cur);
      } else {
        acc.positiveItems.push(cur);
      }
      return acc;
    }, obj);
    obj.positiveItems.sort((a, b) => a.no! - b.no!);
    obj.negativeItems.sort((a, b) => a.no! - b.no!);
    return [...obj.positiveItems, ...obj.otherItems, ...obj.negativeItems];
  };

  // 递归处理原始路由格式化（核心改动）
  const formatRawRoutes = (routes: any[]): MenuItem[] => {
    const result: MenuItem[] = [];

    routes.forEach((rawRoute) => {
      if (rawRoute.meta?.hidden === true) return;

      const menuItem: MenuItem = {
        no: rawRoute.meta?.no,
        title: translateString(rawRoute.meta?.title) || '未命名',
        path: rawRoute.path,
        name: rawRoute.name,
        icon: rawRoute.meta?.icon || Bars3BottomLeftIcon,
        hidden: rawRoute.meta?.hidden,
      };

      if (rawRoute.children && rawRoute.children.length > 0) {
        // 深层递归
        menuItem.children = formatRawRoutes(rawRoute.children);
      }

      // 如果有子节点或者自己是个有标题的有效页面才推入
      if (
        (menuItem.children && menuItem.children.length > 0) ||
        rawRoute.meta?.title
      ) {
        result.push(menuItem);
      }
    });

    return handleMenuSort(result);
  };

  // 统一的 menuTree 生成入口
  const menuTree = computed<MenuItem[]>(() => {
    const modules = import.meta.glob('@/router/modules/*.ts', { eager: true });
    const rawMenus: MenuItem[] = [];

    Object.keys(modules).forEach((key) => {
      const module = modules[key] as any;
      const rawModule = module.default;
      const rootRoute = isArray(rawModule) ? rawModule[0] : rawModule;

      if (!rootRoute || rootRoute.meta?.hidden === true) return;

      const firstLevelMenu: MenuItem = {
        no: preferences.app.defaultHomePath.startsWith(rootRoute.path)
          ? 1
          : rootRoute.meta?.no,
        title: translateString(rootRoute.meta?.title) || '未命名分类',
        path: rootRoute.path,
        name: rootRoute.name,
        icon: rootRoute.meta?.icon || Bars3BottomLeftIcon,
        children: [],
      };

      if (rootRoute.children && rootRoute.children.length > 0) {
        // 这里丢给递归函数，一并解决二、三、四级菜单的生成
        firstLevelMenu.children = formatRawRoutes(rootRoute.children);
      }

      if (firstLevelMenu.children!.length > 0 || rootRoute.meta?.title) {
        rawMenus.push(firstLevelMenu);
      }
    });

    return handleMenuSort(rawMenus);
  });

  // 改为数组来承载各级菜单的展开状态。存储的是路由的 path
  const openedMenuKeys = ref<string[]>([]);

  // 展开和收起的处理逻辑
  const handleToggleExpand = (path: string) => {
    if (isFold.value) {
      isFold.value = false;
    }
    const index = openedMenuKeys.value.indexOf(path);
    if (index > -1) {
      // 已经展开则收起
      openedMenuKeys.value.splice(index, 1);
    } else {
      // 未展开则推入开启键值中
      openedMenuKeys.value.push(path);
    }
  };

  // 监听当前路由，自动展开对应链条上的父级菜单
  watch(
    () => route.path,
    (newPath) => {
      const parentPaths: string[] = [];

      // 深度查找路径上所有父节点的算法
      const findParentPaths = (
        menus: MenuItem[],
        targetPath: string
      ): boolean => {
        for (const menu of menus) {
          if (menu.path === targetPath) return true;
          if (menu.children && menu.children.length > 0) {
            parentPaths.push(menu.path);
            if (findParentPaths(menu.children, targetPath)) return true;
            parentPaths.pop(); // 没找到则回溯
          }
        }
        return false;
      };

      findParentPaths(menuTree.value, newPath);
      // 将找到的所有父级菜单的 path 加入展开队列
      parentPaths.forEach((p) => {
        if (!openedMenuKeys.value.includes(p)) {
          openedMenuKeys.value.push(p);
        }
      });
    },
    { immediate: true }
  );

  let memorizedKeys: string[] = [];
  const isFold = ref<boolean>(false);

  const foldMenu = () => {
    if (isFold.value) {
      // 展开
      isFold.value = false;
      openedMenuKeys.value = [...memorizedKeys];
    } else {
      // 折叠
      memorizedKeys = [...openedMenuKeys.value];
      openedMenuKeys.value = [];
      isFold.value = true;
    }
  };

  defineExpose({ foldMenu, isFold });
</script>

<template>
  <aside :class="classes">
    <div :class="[ns.e('container')]">
      <CaSideMenuGroup
        v-for="group in menuTree"
        :key="group.path"
        :label="group.title"
        :active="route.path.startsWith(group.path)"
        :menu-info="group">
        <template
          #prefix
          v-if="group.icon">
          <HeroIcon :icon="group.icon" />
        </template>
        <template
          #suffix
          v-if="group.icon">
          <HeroIcon :icon="group.icon" />
        </template>
        <CaSideMenuOption
          v-for="option in group.children || []"
          :key="option.path"
          :active="option.path === route.path"
          :route-name="option.name">
          <template
            #prefix
            v-if="option?.icon">
            <HeroIcon :icon="option.icon" />
          </template>
          <template #default> {{ option.title }} </template>
          <template
            #suffix
            v-if="option?.icon">
            <HeroIcon :icon="option.icon" />
          </template>
        </CaSideMenuOption>
      </CaSideMenuGroup>
    </div>
  </aside>
</template>

<style scoped>
  @import '../styles/caSideMenu.css';
</style>
