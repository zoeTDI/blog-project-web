<script setup lang="ts">
  import type {
    CaDrawerEmits,
    DrawerPlacement,
    DrawerSize,
  } from '@/components/ca/caDrawer';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { ref } from 'vue';

  /**
   * CaDrawer 组件的 Props 定义
   */
  interface CaDrawerProps {
    /** 抽屉展开方向，默认为 'right' */
    placement?: DrawerPlacement;
    /** 展开大小：内容大小 (auto) 或 全屏 (full)，默认为 'auto' */
    size?: DrawerSize;
    /** 点击遮罩层是否允许关闭，默认为 true */
    closeOnClickOverlay?: boolean;
  }

  const props = withDefaults(defineProps<CaDrawerProps>(), {
    placement: 'right',
    size: 'auto',
    closeOnClickOverlay: true,
  });
  const emits = defineEmits<CaDrawerEmits>();

  const visible = ref<boolean>(false);

  const handleOverlayClick = () => {
    close();
  };
  const open = () => {
    visible.value = true;
    emits('open');
    emits('update:visible', true);
  };
  const close = () => {
    visible.value = false;
    emits('close');
    emits('update:visible', false);
  };
  defineExpose({
    open,
    close,
  });
</script>

<template>
  <teleport to="body">
    <div
      v-show="visible"
      class="ca-drawer ca-drawer-overlay"
      @click="handleOverlayClick">
      <transition
        :name="`ca-drawer-slide-${props.placement}`"
        appear>
        <div
          v-show="visible"
          :class="[
            'ca-drawer-container',
            `ca-drawer-${props.placement}`,
            { 'ca-drawer-full': props.size === 'full' },
          ]"
          @click.stop>
          <section class="header-wrapper">
            <div class="header">
              <slot name="header"></slot>
            </div>
            <button
              class="close-btn"
              @click="close">
              <x-mark-icon class="icon" />
            </button>
          </section>
          <slot></slot>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<style scoped>
  .ca-drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100svw;
    height: 100svh;
    z-index: 2000;
  }

  .ca-drawer-container {
    position: absolute;
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2001;
    overflow-y: auto;
    padding: 24px clamp(24px, 24px, 5%);
  }

  .header-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    min-height: 48px;
  }
  .header-wrapper .header {
    margin-right: auto;
  }
  .header-wrapper .close-btn {
    width: 24px;
    height: 24px;
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    background-color: unset;
    border: unset;
    outline: unset;
    box-shadow: unset;
    cursor: pointer;
  }
  .header-wrapper .close-btn:hover {
    background-color: var(--color-bg-hover);
  }
  .header-wrapper .close-btn .icon {
    width: 100%;
    height: 100%;
    color: var(--color-text-primary);
  }

  .ca-drawer-right {
    top: 0;
    right: 0;
    height: 100svh;
    border-left: 1px solid var(--color-border);
  }
  .ca-drawer-left {
    top: 0;
    left: 0;
    height: 100svh;
    border-right: 1px solid var(--color-border);
  }
  .ca-drawer-top {
    top: 0;
    left: 0;
    width: 100vw;
    border-bottom: 1px solid var(--color-border);
  }
  .ca-drawer-bottom {
    bottom: 0;
    left: 0;
    width: 100vw;
    border-top: 1px solid var(--color-border);
  }
  .ca-drawer-full {
    width: 100vw;
    height: 100vh;
    border: none;
  }

  /* 动画类名定义 */
  /* 右滑入 */
  .ca-drawer-slide-right-enter-from,
  .ca-drawer-slide-right-leave-to {
    transform: translateX(100%);
  }
  /* 左滑入 */
  .ca-drawer-slide-left-enter-from,
  .ca-drawer-slide-left-leave-to {
    transform: translateX(-100%);
  }
  /* 上滑入 */
  .ca-drawer-slide-top-enter-from,
  .ca-drawer-slide-top-leave-to {
    transform: translateY(-100%);
  }
  /* 下滑入 */
  .ca-drawer-slide-bottom-enter-from,
  .ca-drawer-slide-bottom-leave-to {
    transform: translateY(100%);
  }
</style>
