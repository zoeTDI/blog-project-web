<script setup lang="ts">
  import { computed, onUnmounted, useSlots } from 'vue';
  import type { CaCardFooterAction } from '@/components/ca/caCard';
  import { useDebounceFn } from '@caldm/hook';
  import { CaButton } from '@caldm/ui';

  interface Props {
    showHeader?: boolean;
    showFooter?: boolean;
    headerMaxHeight?: 'S' | 'M' | 'L' | string;
    footerMaxHeight?: 'S' | 'M' | 'L' | string;
    footerActions?: CaCardFooterAction[];
  }

  const props = withDefaults(defineProps<Props>(), {
    showHeader: false,
    showFooter: false,
    headerMaxHeight: 'S',
    footerMaxHeight: 'S',
    footerActions: () => [],
  });

  const slots = useSlots();

  const shouldShowHeader = computed(() => props.showHeader || !!slots.header);
  const shouldShowFooter = computed(
    () =>
      props.showFooter ||
      !!slots.footer ||
      (props.footerActions && props.footerActions.length > 0)
  );

  const enhancedActions = computed(() => {
    return props.footerActions.map((action) => {
      if (
        action.timeout &&
        action.timeout > 0 &&
        typeof action.onClick === 'function'
      ) {
        return {
          ...action,
          // 预先创建防抖函数，确保每次点击调用的是同一个实例
          run: useDebounceFn(action.onClick, action.timeout),
        };
      }
      return {
        ...action,
        run: action.onClick, // 没有防抖时直接使用原函数
      };
    });
  });

  const sizeMap: Record<'S' | 'M' | 'L', string> = {
    S: '60px',
    M: '120px',
    L: '200px',
  };

  const headerStyle = computed(() => ({
    '--header-max-height':
      sizeMap[props.headerMaxHeight as keyof typeof sizeMap] ||
      props.headerMaxHeight,
  }));

  const footerStyle = computed(() => ({
    '--footer-max-height':
      sizeMap[props.footerMaxHeight as keyof typeof sizeMap] ||
      props.footerMaxHeight,
  }));

  onUnmounted(() => {
    enhancedActions.value.forEach((action) => {
      if (action.run && 'cancel' in action.run) {
        (action.run as any).cancel();
      }
    });
  });
</script>

<template>
  <div class="ca-card">
    <header
      v-if="shouldShowHeader"
      class="layout-header"
      :style="headerStyle">
      <div class="inner-scroll">
        <slot name="header" />
      </div>
    </header>

    <main class="layout-body">
      <slot />
    </main>

    <footer
      v-if="shouldShowFooter"
      class="layout-footer"
      :style="footerStyle">
      <div
        v-if="!!slots.footer"
        class="inner-scroll">
        <slot name="footer" />
      </div>
      <div
        v-else
        class="action-container">
        <ca-button
          v-for="action in enhancedActions"
          :key="action.key"
          :type="action.type || 'primary'"
          @click="action.run?.()">
          {{ action.label }}
        </ca-button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .ca-card {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    height: 100%;
    padding: var(--content-padding-M);
    background-color: var(--color-container-bg);
    border: 2px dashed var(--color-border);
  }

  .layout-header,
  .layout-footer {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }

  .inner-scroll {
    overflow-y: auto;
    flex: 1;
  }

  .layout-header {
    --header-max-height: 60px;
    max-height: var(--header-max-height);
    border-bottom: 1px dashed var(--color-border);
  }

  .layout-footer {
    --footer-max-height: 60px;
    max-height: var(--footer-max-height);
    border-top: 1px solid var(--color-border);
  }

  .action-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 12px;
    padding: 8px 0;
  }

  .layout-body {
    flex: 1;
    overflow-y: auto;
  }
</style>
