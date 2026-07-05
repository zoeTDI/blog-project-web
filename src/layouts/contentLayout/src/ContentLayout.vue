<script setup lang="ts">
  import { BaseLayoutHeader } from '@/components/baseLayout';
  import { WebsiteSummary } from '@/components/websiteSummary';
  import {
    GlobalTools,
    LanguageButton,
    ThemeButton,
    TimezoneButton,
  } from '@/components/globalTools';
  import { preferences } from '@/core/preferences';
  import { CaSearch } from '@/components/ca/caSearch';
  import { type ContentLayoutProps } from '@/layouts/contentLayout';
  import { CONTENT_LAYOUT_MODE_OPTION } from '@/layouts/contentLayout/src/types.ts';

  withDefaults(defineProps<ContentLayoutProps>(), {
    left: () => ({ isShow: true }),
    right: () => ({ isShow: true }),
    mode: CONTENT_LAYOUT_MODE_OPTION.CENTERED,
  });
</script>

<template>
  <div :class="['content-layout', mode]">
    <header
      class="header"
      v-if="preferences.header.enable">
      <slot name="header" />
    </header>
    <main class="main-content">
      <aside
        class="sidebar-left"
        v-if="left?.isShow">
        <slot name="sidebar-left"></slot>
      </aside>

      <section class="content-container">
        <slot name="content"></slot>
      </section>

      <aside
        class="sidebar-right"
        v-if="right?.isShow">
        <slot name="sidebar-right"></slot>
      </aside>
    </main>
  </div>
</template>

<style scoped>
  .main-content {
    display: flex;
    height: 100%;
    width: 100%;
    transition: all 0.3s ease;
  }

  /* 布局模式一：限制主容器，侧边栏紧挨主容器 (即：主容器居中，两侧留白) */
  .content-layout.centered .main-content {
    max-width: var(--layout-3col-max-width);
    margin: 0 auto;
    gap: 20px;
  }

  /* 布局模式二：侧边栏撑满视口 (即：中间留白，侧边栏在屏幕边缘) */
  .content-layout.full .main-content {
    justify-content: space-between;
    padding: 0 40px;
    max-width: none;
  }

  .sidebar-left,
  .sidebar-right {
    flex: 0 0 var(--layout-3col-sidebar-basis);
    padding: 20px;
  }
  .content-container {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
  }
</style>
