<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import { computed, ref } from 'vue';
  import type { TabItem } from '@/components/ca/caTabsBar';
  import { useTabStore } from '@/store/useTabStore.ts';
  import { ContextMenu } from '@/components/ca/caTabsBar';
  import { LockClosedIcon } from '@heroicons/vue/24/outline';
  import { useI18n } from 'vue-i18n';
  import { ROUTER_PREFIX } from '@/plugins/i18n.ts';
  import { HeroIcon } from '@/components/icon';

  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const tabStore = useTabStore();

  const activeTabPath = computed(() => route.path);
  const tabList = computed<TabItem[]>(() => tabStore.tabs);

  const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null);
  const handleOpenContextMenu = (e: MouseEvent, tab: TabItem) => {
    if (contextMenuRef.value) {
      contextMenuRef.value?.open(e, tab);
    }
  };
  const translateString = (str: string): string => {
    if (str.startsWith(ROUTER_PREFIX)) {
      return t(str);
    }
    return str;
  };

  /**
   * 标签页跳转
   * @param path
   */
  const handleClickTab = (path: string) => {
    if (route.path === path) {
      return;
    }
    router.push(path);
  };
</script>

<template>
  <nav class="tabs-bar">
    <div
      v-for="tab in tabList"
      :key="tab.path"
      :class="['tab-item', { active: activeTabPath === tab.path }]"
      @click="handleClickTab(tab.path)"
      @contextmenu.prevent="handleOpenContextMenu($event, tab)">
      <HeroIcon
        :icon="tab.prefixIcon"
        v-if="tab.prefixIcon"
        class="tab-item-icon" />
      <span class="tab-title">{{ translateString(tab.title) }}</span>
      <!--      固定图标-->
      <span
        v-if="tab.pinned"
        class="pin-icon">
        <lock-closed-icon />
      </span>
    </div>
    <context-menu ref="contextMenuRef" />
  </nav>
</template>

<style scoped>
  .tabs-bar {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    column-gap: 10px;
    padding: 12px 4px 6px 4px;
    position: relative;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
  }

  .tabs-bar::-webkit-scrollbar {
    display: none;
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
    border: 2px solid var(--color-border);
    background-color: var(--color-bg);
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    transition:
      transform 300ms cubic-bezier(0.2, 0, 0, 1),
      border-color 300ms;
    flex-shrink: 0;
  }

  .tab-item:hover:not(.active) {
    transform: translateY(-4px);
  }

  .tab-item:not(:has(.pin-icon)) {
    /*添加额外右边距，使文字在视觉上居中对齐*/
    padding-right: 18px;
  }

  .tab-item:hover {
    color: var(--color-accent);
    background-color: #f5f5f5;
  }

  .tab-item.active {
    border-color: var(--color-accent);
    transform: translateY(-4px);
    z-index: 2;
  }

  .tab-title {
    white-space: nowrap;
  }

  .pin-icon {
    margin-left: 6px;
    display: flex;
    align-items: center;
  }

  .tab-item.active .pin-icon {
    color: var(--color-accent);
  }

  .pin-icon svg {
    width: 13px;
    height: 13px;
  }
</style>
