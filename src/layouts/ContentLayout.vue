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

  interface SidebarOption {
    isShow?: boolean;
    width?: number;
  }

  interface Props {
    left?: SidebarOption;
    right?: SidebarOption;
  }
  withDefaults(defineProps<Props>(), {
    left: () => ({ isShow: true }),
    right: () => ({ isShow: true }),
  });
</script>

<template>
  <div class="content-layout">
    <header class="header">
      <base-layout-header>
        <template #logo>
          <website-summary />
        </template>
        <template #action>
          <global-tools>
            <theme-button
              v-if="preferences.widgetPreferences.themeToggle"
              shape="circle" />
            <language-button
              v-if="preferences.widgetPreferences.languageToggle"
              shape="circle" />
            <timezone-button
              v-if="preferences.widgetPreferences.timezoneToggle"
              shape="circle" />
          </global-tools>
          <ca-search
            type="expand"
            src="topNav" />
        </template>
      </base-layout-header>
    </header>
    <main class="main-content">
      <aside
        class="sidebar-left"
        :style="
          typeof left.width === 'number' ? { width: `${left.width}px` } : {}
        "
        v-if="left?.isShow">
        <slot name="sidebar-left"></slot>
      </aside>
      <section class="content-container">
        <slot name="content"> </slot>
      </section>
      <aside
        class="sidebar-right"
        :style="
          typeof right.width === 'number' ? { width: `${right.width}px` } : {}
        "
        v-if="right?.isShow">
        <slot name="sidebar-right"></slot>
      </aside>
    </main>
  </div>
</template>

<style scoped>
  .content-layout {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100svw;
    height: 100svh;
    max-height: 100svh;
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
  }

  .header {
    flex: 0 1 10%;
    padding: 40px 60px;
  }

  .main-content {
    display: flex;
    justify-content: space-between;
    flex: 1 1 auto;
    overflow-y: scroll;
    scrollbar-width: none;
  }

  .sidebar-right,
  .sidebar-left {
    overflow: scroll;
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
    font-family: var(--font-text);
    scrollbar-width: none;
  }
  .sidebar-left {
    border-right: 1px solid #e8e8e8;
  }
  .sidebar-right {
    border-left: 1px solid #e8e8e8;
  }

  .content-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    font-family: var(--font-text);
  }
</style>
