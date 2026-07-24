<script setup lang="ts">
  import type {
    CaDrawerEmits,
    CaDrawerProps,
  } from './types';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { ref } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';

  defineOptions({
    name: 'CaDrawer',
  });

  const props = withDefaults(defineProps<CaDrawerProps>(), {
    placement: 'right',
    size: 'auto',
    closeOnClickOverlay: true,
  });
  const emits = defineEmits<CaDrawerEmits>();

  const ns = useCSSNamespace('drawer');

  const visible = ref<boolean>(false);

  const handleOverlayClick = () => {
    if (!props.closeOnClickOverlay) return;
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
      :class="[ns.b(), ns.e('overlay')]"
      @click="handleOverlayClick">
      <transition
        :name="`${ns.b()}-slide-${props.placement}`"
        appear>
        <div
          v-show="visible"
          :class="[
            ns.e('container'),
            ns.m(props.placement),
            ns.is('full', props.size === 'full'),
          ]"
          @click.stop>
          <section :class="ns.e('header-wrapper')">
            <div :class="ns.e('header')">
              <slot name="header"></slot>
            </div>
            <button
              :class="ns.e('close-btn')"
              @click="close">
              <x-mark-icon :class="ns.e('icon')" />
            </button>
          </section>
          <slot></slot>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<style scoped>
  /* 遮罩层: .ca-drawer__overlay */
  .ca-drawer__overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100svw;
    height: 100svh;
    z-index: 2000;
  }

  /* 容器: .ca-drawer__container */
  .ca-drawer__container {
    position: absolute;
    background-color: var(--color-container-bg);
    color: var(--color-text-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2001;
    overflow-y: auto;
    padding: 24px clamp(24px, 24px, 5%);
  }

  /* 头部包裹器: .ca-drawer__header-wrapper */
  .ca-drawer__header-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    min-height: 48px;
  }

  /* 标题容器: .ca-drawer__header */
  .ca-drawer__header {
    margin-right: auto;
  }

  /* 关闭按钮: .ca-drawer__close-btn */
  .ca-drawer__close-btn {
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

  .ca-drawer__close-btn:hover {
    background-color: var(--color-bg-hover);
  }

  /* 图标元素: .ca-drawer__icon */
  .ca-drawer__icon {
    width: 100%;
    height: 100%;
    color: var(--color-text-primary);
  }

  /* 修饰符状态 (Modifiers): 方向控制 */
  .ca-drawer--right {
    top: 0;
    right: 0;
    height: 100svh;
    border-left: 1px solid var(--color-border);
  }

  .ca-drawer--left {
    top: 0;
    left: 0;
    height: 100svh;
    border-right: 1px solid var(--color-border);
  }

  .ca-drawer--top {
    top: 0;
    left: 0;
    width: 100vw;
    border-bottom: 1px solid var(--color-border);
  }

  .ca-drawer--bottom {
    bottom: 0;
    left: 0;
    width: 100vw;
    border-top: 1px solid var(--color-border);
  }

  /* 状态 (State): 是否全屏 .is-full */
  .ca-drawer__container.is-full {
    width: 100vw;
    height: 100vh;
    border: none;
  }

  /* 动画类名 (Transition Slide) */
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
