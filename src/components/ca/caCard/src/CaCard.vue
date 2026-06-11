<script setup lang="ts">
  import { computed, useSlots } from 'vue';

  interface Props {
    showHeader?: boolean;
    showFooter?: boolean;
    headerMaxHeight?: 'S' | 'M' | 'L' | string;
    footerMaxHeight?: 'S' | 'M' | 'L' | string;
  }

  const props = withDefaults(defineProps<Props>(), {
    showHeader: false,
    showFooter: false,
    headerMaxHeight: 'S',
    footerMaxHeight: 'S',
  });

  const slots = useSlots();

  const shouldShowHeader = computed(() => props.showHeader || !!slots.header);
  const shouldShowFooter = computed(() => props.showFooter || !!slots.footer);

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
      <div class="inner-scroll">
        <slot name="footer" />
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

  .layout-body {
    flex: 1;
    overflow-y: auto;
  }
</style>
