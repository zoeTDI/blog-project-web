<script lang="ts">
  // 模块级共享状态：多个弹窗同时打开时也能正确恢复页面滚动
  let scrollLockCount = 0;
  let previousBodyOverflow = '';
</script>

<script setup lang="ts">
  import type {
    CaDialogAction,
    CaDialogEmits,
    CaDialogExpose,
    CaDialogProps,
    DialogSize,
  } from './types.ts';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue';
  import type { Slots } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';
  import { isNumber, isString } from '@caldm/utils';
  import CaButton from '../../button/src/Button.vue';
  import CaIcon from '../../../icon/src/Icon.vue';

  defineOptions({
    name: 'CaDialog',
  });

  const props = withDefaults(defineProps<CaDialogProps>(), {
    visible: false,
    title: '',
    size: 'M' as DialogSize,
    appendTo: 'body',
    closeOnClickOverlay: true,
    closeOnPressEscape: true,
    showClose: true,
    lockScroll: true,
    footerActions: () => [],
  });
  const emits = defineEmits<CaDialogEmits>();

  const slots: Slots = useSlots();
  const ns = useCSSNamespace('dialog');

  const visible = ref<boolean>(props.visible);
  const containerRef = ref<HTMLElement | null>(null);

  const sizeWidthMap: Record<DialogSize, string> = {
    S: '400px',
    M: '520px',
    L: '720px',
  };

  const isGlobal = computed(() => {
    if (props.appendTo === 'body') return true;
    if (typeof document === 'undefined') return true;
    return props.appendTo === document.body;
  });

  const rootClasses = computed(() => [
    ns.b(),
    ns.is('local', !isGlobal.value),
  ]);

  const containerClasses = computed(() => [
    ns.e('container'),
    ns.m(props.size),
  ]);

  const containerStyle = computed(() => {
    const { width, size } = props;

    if (isNumber(width) && width > 0) {
      return ns.cssVarBlock({ width: `${width}px` });
    }
    if (isString(width) && width.trim() !== '') {
      return ns.cssVarBlock({ width });
    }
    return ns.cssVarBlock({ width: sizeWidthMap[size] });
  });

  const hasHeader = computed<boolean>(
    () => props.showClose || !!props.title || !!slots.header,
  );
  const hasFooter = computed<boolean>(
    () => !!slots.footer || props.footerActions.length > 0,
  );

  // 页面滚动锁定，使用模块级计数避免多个弹窗互相覆盖
  let bodyLocked = false;
  let previousActiveElement: HTMLElement | null = null;

  const lockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    if (!isGlobal.value || !props.lockScroll || bodyLocked) return;

    bodyLocked = true;
    if (scrollLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    scrollLockCount += 1;
  };

  const unlockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    if (!bodyLocked) return;

    bodyLocked = false;
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.body.style.overflow = previousBodyOverflow;
    }
  };

  const open = () => {
    if (visible.value) return;
    visible.value = true;
    emits('open');
    emits('update:visible', true);
  };

  const close = () => {
    if (!visible.value) return;
    visible.value = false;
    emits('close');
    emits('update:visible', false);
  };

  const handleOverlayClick = () => {
    if (!props.closeOnClickOverlay) return;
    close();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !props.closeOnPressEscape) return;
    event.stopPropagation();
    close();
  };

  const handleAction = (action: CaDialogAction) => {
    action.onClick?.();
    emits('action', action);
    if (action.closeOnClick) close();
  };

  const syncVisibleState = async (value: boolean) => {
    if (typeof document === 'undefined') return;

    if (value) {
      previousActiveElement = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      lockBodyScroll();
      document.addEventListener('keydown', handleKeydown);
      await nextTick();
      containerRef.value?.focus();
      return;
    }

    unlockBodyScroll();
    document.removeEventListener('keydown', handleKeydown);
    if (previousActiveElement && document.contains(previousActiveElement)) {
      previousActiveElement.focus();
    }
    previousActiveElement = null;
  };

  watch(visible, (value) => {
    void syncVisibleState(value);
  }, { immediate: true });

  watch(() => props.visible, (value) => {
    if (visible.value !== value) visible.value = value;
  });

  onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeydown);
    }
    unlockBodyScroll();
  });

  defineExpose<CaDialogExpose>({
    open,
    close,
  });
</script>

<template>
  <teleport :to="props.appendTo || 'body'">
    <transition :name="ns.s('fade')" appear>
      <div
        v-if="visible"
        :class="rootClasses"
        @click.self="handleOverlayClick">
        <div
          ref="containerRef"
          :class="containerClasses"
          :style="containerStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="props.title || undefined"
          tabindex="-1">
          <header v-if="hasHeader" :class="ns.e('header')">
            <div :class="ns.e('header-wrapper')">
              <slot name="header">
                <h3 :class="ns.e('title')">{{ props.title }}</h3>
              </slot>
            </div>
            <button
              v-if="props.showClose"
              type="button"
              :class="ns.e('close-btn')"
              aria-label="关闭弹窗"
              @click="close">
              <CaIcon :icon="XMarkIcon" :size="18" />
            </button>
          </header>

          <div :class="ns.e('body')">
            <slot />
          </div>

          <footer v-if="hasFooter" :class="ns.e('footer')">
            <slot name="footer">
              <CaButton
                v-for="action in props.footerActions"
                :key="action.key"
                :type="action.type || 'primary'"
                @click="handleAction(action)">
                {{ action.label }}
              </CaButton>
            </slot>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
  @import "../styles/style.css";

  .ca-dialog {
    position: fixed;
    inset: 0;
    z-index: 2100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-color: var(--ca-dialog-overlay-bg);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    font-family: var(--font-text);
    transition: opacity 0.25s ease;
  }

  .ca-dialog.is-local {
    position: absolute;
    z-index: 20;
    padding: 12px;
  }

  .ca-dialog__container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--ca-dialog-width, 520px);
    max-width: 100%;
    max-height: 100%;
    min-height: 0;
    overflow: hidden;
    background-color: var(--ca-dialog-bg);
    color: var(--ca-dialog-text);
    border: 1px solid var(--ca-dialog-border);
    border-radius: var(--ca-dialog-radius);
    box-shadow: var(--ca-dialog-shadow);
    outline: none;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
  }

  .ca-dialog__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-shrink: 0;
    padding: 20px 24px 0;
  }

  .ca-dialog__header-wrapper {
    flex: 1 1 auto;
    min-width: 0;
  }

  .ca-dialog__title {
    margin: 0;
    font-family: var(--font-h);
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--ca-dialog-title);
    word-break: break-word;
  }

  .ca-dialog__close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    padding: 0;
    color: var(--ca-dialog-text);
    background-color: transparent;
    border: none;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .ca-dialog__close-btn:hover {
    background-color: var(--ca-dialog-hover-bg);
    color: var(--color-accent);
  }

  .ca-dialog__close-btn:focus-visible {
    outline: 1px solid var(--color-accent);
  }

  .ca-dialog__body {
    flex: 1 1 auto;
    min-height: 0;
    padding: 20px 24px 24px;
    overflow-y: auto;
    color: var(--ca-dialog-text);
    font-size: 14px;
    line-height: 1.65;
  }

  .ca-dialog__header + .ca-dialog__body {
    padding-top: 16px;
  }

  .ca-dialog__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    flex-shrink: 0;
    padding: 12px 24px 20px;
    border-top: 1px solid var(--ca-dialog-border);
  }

  /* 淡入淡出 + 轻微缩放动画 */
  .ca-dialog-fade-enter-active,
  .ca-dialog-fade-leave-active {
    transition: opacity 0.25s ease;
  }

  .ca-dialog-fade-enter-from,
  .ca-dialog-fade-leave-to {
    opacity: 0;
  }

  .ca-dialog-fade-enter-from .ca-dialog__container,
  .ca-dialog-fade-leave-to .ca-dialog__container {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }

  @media (max-width: 640px) {
    .ca-dialog {
      padding: 16px;
    }

    .ca-dialog__header {
      padding: 18px 18px 0;
    }

    .ca-dialog__body {
      padding: 16px 18px 20px;
    }

    .ca-dialog__header + .ca-dialog__body {
      padding-top: 14px;
    }

    .ca-dialog__footer {
      padding: 12px 18px 18px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ca-dialog,
    .ca-dialog__container,
    .ca-dialog__close-btn {
      transition: none;
    }
  }
</style>
