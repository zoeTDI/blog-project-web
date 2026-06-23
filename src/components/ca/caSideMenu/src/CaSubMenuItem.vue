<script setup lang="ts">
  import type { MenuItem } from '@/components/ca/caSideMenu';
  import { useRoute, useRouter } from 'vue-router';
  import { computed } from 'vue';
  import { ChevronDownIcon } from '@heroicons/vue/24/outline';

  const props = withDefaults(
    defineProps<{
      item: MenuItem;
      depth?: number;
      openedKeys: string[];
    }>(),
    {
      depth: 3,
    }
  );
  const emits = defineEmits<{
    (e: 'toggle-expand', path: string): void;
  }>();

  const route = useRoute();
  const router = useRouter();

  // 是否存在子菜单;
  const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0;
  });

  // 是否展开
  const isOpen = computed(() => {
    return props.openedKeys.includes(props.item.path);
  });

  // 当前菜单项或子菜单是否被激活
  const isActive = computed(() => {
    if (route.path === props.item.path || route.name === props.item.name) {
      return true;
    }
    const checkActive = (children?: MenuItem[]): boolean => {
      if (!children) return false;
      return children.some(
        (child) =>
          route.path === child.path ||
          route.name === child.name ||
          checkActive(child.children)
      );
    };
    return checkActive(props.item.children);
  });

  const handleClick = () => {
    if (hasChildren.value) {
      emits('toggle-expand', props.item.path);
    } else {
      if (props.item.name) {
        router.push({ name: props.item.name });
      } else {
        router.push(props.item.path);
      }
    }
  };

  // 向上传递子节点切换事件
  const handleSubToggle = (path: string) => {
    emits('toggle-expand', path);
  };
</script>

<template>
  <div class="menu-group">
    <div
      :class="[
        'menu-item',
        'level-depth',
        { active: isActive, 'is-expanded': isOpen },
      ]"
      :style="{ paddingLeft: `${props.depth * 16}px` }"
      @click="handleClick">
      <div class="menu-item-left">
        <component
          :is="item.icon"
          v-if="item.icon"
          class="menu-icon"
          :class="{ 'sub-menu-icon': props.depth > 1 }" />
        <span class="menu-title">{{ item.title }}</span>
      </div>
      <div
        v-if="hasChildren"
        class="menu-item-right">
        <chevron-down-icon :class="['arrow-icon', { 'rotate-180': isOpen }]" />
      </div>
    </div>
    <transition name="menu-fade">
      <div
        v-if="hasChildren"
        v-show="isOpen"
        class="sub-menu">
        <CaSubMenuItem
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :depth="props.depth + 1"
          :opened-keys="openedKeys"
          @toggle-expand="handleSubToggle" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .menu-group {
    display: flex;
    flex-direction: column;
  }

  .menu-item {
    width: 100%; /* 改为100%适应父级容器 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    color: rgba(255, 255, 255, 0.65);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.25s ease;
    user-select: none;
    box-sizing: border-box;
  }

  /* 层级深了以后微调高度 */
  .menu-item:not(.level-1) {
    height: 40px;
  }

  .menu-item:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .menu-item.active {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.02);
  }

  .menu-item:not(.level-1).active {
    background-color: var(--color-bg, #001529) !important;
  }

  .menu-item-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    overflow: hidden;
  }

  .menu-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 300ms ease;
  }

  .menu-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    transition: color 0.25s;
  }

  .sub-menu-icon {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.45);
  }

  .menu-item:hover .menu-icon,
  .menu-item.active .menu-icon,
  .menu-item.active .sub-menu-icon {
    color: #fff;
  }

  .menu-item-right {
    display: flex;
    align-items: center;
    padding-right: 16px;
  }

  .arrow-icon {
    width: 14px;
    height: 14px;
    color: rgba(255, 255, 255, 0.45);
    transition: transform 0.25s ease;
  }

  .arrow-icon.rotate-180 {
    transform: rotate(180deg);
  }

  .sub-menu {
    background-color: #4d4d4d;
  }

  /* 基于 Vue 的基础折叠过渡效果（比动态计算 height 性能更好且支持无限级嵌套） */
  .menu-fade-enter-active,
  .menu-fade-leave-active {
    transition: max-height 0.3s ease-in-out;
    max-height: 500px; /* 给一个足够大的安全阈值 */
    overflow: hidden;
  }

  .menu-fade-enter-from,
  .menu-fade-leave-to {
    max-height: 0;
    overflow: hidden;
  }
</style>
