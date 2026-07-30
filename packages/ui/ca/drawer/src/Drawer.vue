<script setup lang="ts">
  import type {
    CaDrawerEmits,
    CaDrawerProps,
  } from './types';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { computed, ref, watch } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';

  defineOptions({
    name: 'CaDrawer',
  });

  const props = withDefaults(defineProps<CaDrawerProps>(), {
    placement: 'right',
    size: 'auto',
    closeOnClickOverlay: true,
    appendTo: 'body',
  });
  const emits = defineEmits<CaDrawerEmits>();

  const ns = useCSSNamespace('drawer');

  const visible = ref<boolean>(false);

  const isGlobal = computed(() => {
    return props.appendTo === 'body' || (typeof props.appendTo !== 'string' && props.appendTo === document.body);
  });

  const drawerStyle = computed(() => {
    const { customSize, placement } = props;

    if (customSize === undefined || customSize <= 0) {
      return {};
    }

    const isVertical = placement === 'top' || placement === 'bottom';

    let sizeValue = '';
    if (customSize > 1) {
      sizeValue = `${customSize}px`;
    } else {
      // 0 < customSize <= 1 映射为百分比，结合移动端 svh/svw
      const percentage = customSize * 100;
      if (isGlobal.value) {
        sizeValue = isVertical ? `${percentage}svh` : `${percentage}svw`;
      } else {
        sizeValue = `${percentage}%`;
      }
    }

    // 生成 `--ca-drawer-custom-size`: sizeValue
    return ns.cssVarBlock({
      'custom-size': sizeValue,
    });
  });

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

  watch(visible, (val) => {
    if (isGlobal.value) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  });
</script>

<template>
  <teleport :to="props.appendTo || 'body'">
    <transition :name="`${ns.s('fade')}`" appear>
      <div
        v-if="visible"
        :class="[ns.e('overlay'), { 'is-local': !isGlobal }]"
        @click="handleOverlayClick"
      />
    </transition>
    <transition
      :name="`${ns.s(`slide-${props.placement}`)}`"
      appear>
      <div
        v-show="visible"
        :class="[
            ns.e('container'),
            ns.m(props.placement),
            ns.is('full', props.size === 'full'),
            ns.is('local', !isGlobal)
          ]"
        :style="drawerStyle"
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
    background-color: rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .ca-drawer__overlay.is-local {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  /* 遮罩层淡入淡出过渡 */
  .ca-drawer-fade-enter-active,
  .ca-drawer-fade-leave-active {
    transition: opacity 0.25s ease;
  }

  .ca-drawer-fade-enter-from,
  .ca-drawer-fade-leave-to {
    opacity: 0;
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
    width: var(--ca-drawer-custom-size, auto);
    height: 100svh;
    border-left: 1px solid var(--color-border);
  }

  .ca-drawer--right.is-local {
    height: 100%;
  }

  .ca-drawer--left {
    top: 0;
    left: 0;
    width: var(--ca-drawer-custom-size, auto);
    height: 100svh;
    border-right: 1px solid var(--color-border);
  }

  .ca-drawer--left.is-local {
    height: 100%;
  }

  .ca-drawer--top {
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--ca-drawer-custom-size, auto);
    border-bottom: 1px solid var(--color-border);
  }

  .ca-drawer--top.is-local {
    width: 100%;
  }

  .ca-drawer--bottom {
    bottom: 0;
    left: 0;
    width: 100vw;
    height: var(--ca-drawer-custom-size, auto);
    border-top: 1px solid var(--color-border);
  }

  .ca-drawer--bottom.is-local {
    width: 100%;
  }

  /* 状态 (State): 是否全屏 .is-full */
  .ca-drawer__container.is-full {
    width: 100vw;
    height: 100vh;
    border: none;
  }

  .ca-drawer__container.is-full.is-local {
    width: 100%;
    height: 100%;
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
