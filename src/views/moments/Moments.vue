<script setup lang="ts">
  import { CaAvatar } from '@/components/ca/caAvatar';
  import { ContentLayout } from '@/layouts/contentLayout';
  import {
    GlobalTools,
    LanguageButton,
    ThemeButton,
    TimezoneButton,
  } from '@/components/globalTools';
  import { BaseLayoutHeader } from '@/components/baseLayout';
  import { WebsiteSummary } from '@/components/websiteSummary';
  import { CaSearch } from '@/components/ca/caSearch';
  import { preferences } from '@/core/preferences';
  import { siBilibili, siGithub, siGmail, siTiktok } from 'simple-icons';
  import type { SimpleIcon as SimpleIconType } from 'simple-icons';
  import { SimpleIcon } from '@/components/simpleIcon';
  import { CaList, CaListItem } from '@/components/ca/caList';
  import { ROUTER_NAMES } from '@/router/routerNames.ts';
  import Calendar from '@/components/calendar/src/Calendar.vue';

  interface OutLinkItem {
    id: string;
    label: string;
    link: string;
    icon?: SimpleIconType;
  }
  interface InLinkItem {
    id: string;
    label: string;
    link: { name: string };
    icon?: SimpleIconType;
  }

  const contacts: OutLinkItem[] = [
    {
      id: 'github',
      label: 'GitHub',
      icon: siGithub,
      link: 'https://github.com/zoeTDI',
    },
    {
      id: 'bilibili',
      label: '哔哩哔哩',
      icon: siBilibili,
      link: 'https://space.bilibili.com/你的UID',
    },
    {
      id: 'douyin',
      label: '抖音',
      icon: siTiktok,
      link: 'https://www.douyin.com/user/你的主页ID',
    },
    {
      id: 'email',
      label: '电子邮箱',
      icon: siGmail,
      link: 'mailto:your.email@example.com',
    },
  ];
  const showRoutes: InLinkItem[] = [
    {
      id: ROUTER_NAMES.HOME,
      label: '首页',
      link: { name: ROUTER_NAMES.HOME },
    },
    {
      id: ROUTER_NAMES.GAMES,
      label: '游戏',
      link: { name: ROUTER_NAMES.GAMES },
    },
    {
      id: ROUTER_NAMES.BOOKS,
      label: '书架',
      link: { name: ROUTER_NAMES.BOOKS },
    },
    {
      id: ROUTER_NAMES.MOVIES,
      label: '影视',
      link: { name: ROUTER_NAMES.MOVIES },
    },
  ];
</script>

<template>
  <content-layout class="moments">
    <template #header>
      <base-layout-header class="header">
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
    </template>
    <template #sidebar-left>
      <section class="sidebar-left">
        <ca-avatar
          url="123"
          :size="120" />
        <div class="sidebar-left-item">
          <ca-list
            mode="plain"
            title="联系我">
            <template
              v-for="item in contacts"
              :key="item.id">
              <a :href="item.link">
                <ca-list-item cursor="pointer">
                  <template #prefix>
                    <span
                      class="icon-wrapper"
                      v-if="item.icon">
                      <simple-icon
                        :icon="item.icon"
                        :size="24" />
                    </span>
                  </template>
                  <span class="list-item-label">{{ item.label }}</span>
                </ca-list-item>
              </a>
            </template>
          </ca-list>
        </div>
        <div class="sidebar-left-item">
          <ca-list
            mode="plain"
            title="精选页面">
            <template
              v-for="item in showRoutes"
              :key="item.id">
              <router-link :to="{ name: item.link.name }">
                <ca-list-item cursor="pointer">
                  <template #prefix>
                    <span
                      class="icon-wrapper"
                      v-if="item?.icon">
                      <simple-icon
                        :icon="item.icon"
                        :size="24" />
                    </span>
                  </template>
                  <span class="list-item-label">{{ item.label }}</span>
                </ca-list-item>
              </router-link>
            </template>
          </ca-list>
        </div>
      </section>
    </template>
    <template #content>
      <div class="moment-main">
        <router-view />
      </div>
    </template>
    <template #sidebar-right>
      <section class="moment-right">
        <calendar />
      </section>
    </template>
  </content-layout>
</template>

<style scoped>
  .header {
    padding: 40px 60px;
  }

  .sidebar-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    padding: 0 36px;
    height: 100%;
    min-height: calc(100svh - 160px);
    border-right: 1px solid var(--color-border);
    margin-right: 36px;
  }

  .sidebar-left .sidebar-left-item {
    width: 40%;
    margin-left: 10%;
  }

  .moment-main {
    height: calc(100svh - 160px);
  }

  .moment-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    padding: 0 36px;
    height: 100%;
    min-height: calc(100svh - 160px);
    border-left: 1px solid var(--color-border);
    margin-left: 36px;
  }
</style>
