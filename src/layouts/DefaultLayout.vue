<script setup lang="ts">
  import { CaInkTree } from '@/components/background/caInkTree';
  import { CaSearch } from '@/components/ca/caSearch';
  import { preferences } from '@/core/preferences';
  import {
    GlobalTools,
    LanguageButton,
    ThemeButton,
    TimezoneButton,
  } from '@/components/globalTools';
  import { BaseLayoutFooter, BaseLayoutHeader } from '@/components/baseLayout';
  import { WebsiteSummary } from '@/components/websiteSummary';
</script>

<template>
  <div class="app-wrapper">
    <CaInkTree />

    <header class="layout-header">
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

    <main class="layout-main">
      <router-view />
    </main>

    <footer class="layout-footer">
      <base-layout-footer />
    </footer>
  </div>
</template>

<style scoped>
  .app-wrapper {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
    transition:
      background-color 0.4s ease,
      color 0.4s ease;
  }

  .app-wrapper {
    isolation: isolate;
  }

  /* 关键：给所有实际内容组件提升层级 */
  .layout-header,
  .layout-main,
  .layout-footer {
    position: relative;
    z-index: 1;
  }

  .layout-header {
    padding: 40px 60px;
    z-index: 100;
  }

  .layout-main {
    flex: 1;
    width: 100%;
  }

  .layout-footer {
    padding: 40px 60px;
    font-family: var(--font-text);
    font-size: 12px;
    letter-spacing: 1px;
  }
</style>
