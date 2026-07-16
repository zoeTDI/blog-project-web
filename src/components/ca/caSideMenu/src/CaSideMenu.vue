<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, provide, ref } from 'vue';
  import type { CaSideMenuProps, MenuItem } from './types';
  import { isArray, isNumber } from '@/utils/isFu.ts';
  import { Bars3BottomLeftIcon } from '@heroicons/vue/24/outline';
  import { preferences } from '@/core/preferences';
  import { useI18n } from 'vue-i18n';
  import { ROUTER_PREFIX } from '@/plugins/i18n.ts';
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import {
    CaSideMenuGroup,
    CaSideMenuOption,
    DefaultOptionHeight,
    DefaultWidth,
  } from '@/components/ca/caSideMenu';
  import { HeroIcon } from '@/components/icon';
  import { caSideMenuKey } from '@/components/ca/caSideMenu/src/constants.ts';

  const props = withDefaults(defineProps<CaSideMenuProps>(), {
    width: DefaultWidth,
    optionHeight: DefaultOptionHeight,
  });

  const { t } = useI18n();
  const route = useRoute();
  const ns = useCSSNamespace('side-menu');

  const optionHeight = computed(() =>
    isNumber(props.optionHeight) ? props.optionHeight : DefaultOptionHeight
  );

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.is('fold', isFold.value)];
    return cls;
  });

  const styles = computed(() => {
    const _ = {
      width: isNumber(props.width) ? props.width + 'px' : DefaultWidth + 'px',
    };
    return ns.cssVarBlock(_);
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

  const isFold = ref<boolean>(false);

  const foldMenu = () => {
    isFold.value = !isFold.value;
  };
  provide(caSideMenuKey, { optionHeight });
  defineExpose({ foldMenu, isFold });
</script>

<template>
  <aside
    :class="classes"
    :style="styles">
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
        </CaSideMenuOption>
      </CaSideMenuGroup>
    </div>
  </aside>
</template>

<style scoped>
  @import '../styles/caSideMenu.css';
</style>
