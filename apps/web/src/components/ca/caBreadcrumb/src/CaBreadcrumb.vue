<script setup lang="ts">
  import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router';
  import { computed } from 'vue';
  import { ChevronDoubleRightIcon } from '@heroicons/vue/24/outline';
  import { ROUTER_PREFIX } from '@/plugins/i18n.ts';
  import { useI18n } from 'vue-i18n';
  import { preferences } from '@/core/preferences';
  import { CaIcon } from '@caldm/ui';

  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const matched = computed(() => route.matched);
  const jumpTo = (route: RouteRecordRaw) => {
    router.push(route);
  };
  const translateString = (str: string): string => {
    if (str.startsWith(ROUTER_PREFIX)) {
      return t(str);
    }
    return str;
  };
</script>

<template>
  <nav
    class="ca-breadcrumb"
    v-if="preferences.breadcrumb.enable">
    <ol
      class="breadcrumb-list"
      v-if="matched.length > 1">
      <li
        class="item"
        v-for="(route, index) in matched"
        :key="route.path">
        <span
          :class="[
            'text',
            { 'is-last': index === matched.length - 1 },
            { background: preferences.breadcrumb.styleType === 'background' },
          ]"
          @click="jumpTo(route)">
          <CaIcon
            class="breadcrumb-icon"
            v-if="route.meta?.prefixIcon && preferences.breadcrumb.showIcon"
            :icon="route.meta.prefixIcon" />
          {{ translateString(route.meta.title) }}
          <CaIcon
            class="breadcrumb-icon"
            v-if="route.meta?.suffixIcon && preferences.breadcrumb.showIcon"
            :icon="route.meta.suffixIcon" />
        </span>
        <div
          class="suffix"
          v-if="index !== matched.length - 1">
          <chevron-double-right-icon />
        </div>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
  .breadcrumb-list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    display: flex;
    align-items: center;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    cursor: pointer;
    transition: all ease 150ms;
    padding: 4px 8px;
  }

  .breadcrumb-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  .suffix {
    width: 16px;
    height: 16px;
    margin: auto 4px;
  }

  .text::after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 2px;
    border-radius: 1px;
    transition: width ease 150ms;
    background-color: var(--color-accent);
    bottom: -2px;
    left: 0;
  }

  .text.is-last.background {
    background-color: color-mix(in srgb, var(--color-accent) 60%, transparent);
  }

  .text:not(.is-last):hover {
    color: var(--color-accent);
    transform: translateY(-4px);
  }

  .text:not(.is-last):hover::after {
    width: 100%;
  }
</style>
