<script lang="ts" setup>
  import type { CaButtonEmits, CaButtonProps, CaButtonType } from './types.ts';
  import type { ComponentSize } from '#/component.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';

  defineOptions({
    name: 'CaButton',
  });

  const props = withDefaults(defineProps<CaButtonProps>(), {
    type: 'primary' as CaButtonType,
    size: 'M' as ComponentSize,
    loading: false,
    disabled: false,
    iconPosition: 'left' as const,
    hoverEffect: 'none' as const,
    block: false,
    round: false,
  });

  const emit = defineEmits<CaButtonEmits>();

  const ns = useCSSNamespace('button');

  const handleClick = (event: MouseEvent) => {
    if (props.disabled || props.loading) {
      event.preventDefault();
      return;
    }
    emit('click', event);
  };

  const classes = computed(() => [
    ns.b(),
    ns.m(props.type),
    ns.m(props.size.toLowerCase()),
    ns.is('loading', props.loading),
    ns.is('disabled', props.disabled),
    ns.is('block', props.block),
    ns.is('round', props.round),
    props.hoverEffect !== 'none' ? `hover-${props.hoverEffect}` : '',
  ]);
</script>

<template>
  <button :class="classes" type="button" :disabled="disabled || loading" @click="handleClick">
    <component :is="icon"
               v-if="icon && !loading && iconPosition === 'left'"
               :class="[ns.e('icon'), ns.is('left')]" />
    <span :class="ns.e('content')">
      <slot />
      <span v-if="loading" :class="ns.e('loader')">
        <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
      </span>
    </span>
    <component :is="icon"
               v-if="icon && !loading && iconPosition === 'right'"
               :class="[ns.e('icon'), ns.is('right')]" />
  </button>
</template>

<style scoped>
  .ca-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border: 1px solid transparent;
    background: transparent;
    color: var(--color-text-primary, #333);
    font-family: var(--font-text);
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    overflow: hidden;
    gap: 8px;
  }

  .ca-button--s {
    padding: 4px 12px;
    font-size: 11px;
    height: 28px;
  }

  .ca-button--m {
    padding: 8px 24px;
    font-size: 12px;
    height: 36px;
  }

  .ca-button--l {
    padding: 12px 40px;
    font-size: 14px;
    height: 48px;
  }

  .is-block {
    width: 100%;
    display: flex;
  }

  .is-round {
    border-radius: 24px;
  }

  .ca-button--primary {
    background-color: var(--color-bg, #fff);
    border-color: var(--color-border, #ccc);
    color: var(--color-text-primary, #333);
  }

  .ca-button--primary:hover:not(:disabled):not(.hover-expand) {
    background-color: var(--color-bg-hover);
    border-color: var(--color-border-hover-accent);
    color: var(--color-accent);
    opacity: 0.9;
  }

  .ca-button--outline {
    border-color: var(--color-border, #ccc);
    background-color: var(--color-container-bg);
    color: var(--color-text-primary, #333);
  }

  .ca-button--outline:hover:not(:disabled):not(.hover-expand) {
    border-color: var(--color-border-hover-accent);
    color: var(--color-accent);
    opacity: 0.9;
  }

  .ca-button--text {
    border-color: transparent;
    padding-left: 4px;
    padding-right: 4px;
  }

  .ca-button--text:hover:not(:disabled):not(.hover-expand) {
    color: var(--color-accent);
  }

  .hover-expand:hover:not(:disabled) {
    padding-left: 60px;
    padding-right: 60px;
    border-color: var(--color-border-hover-accent);
    color: var(--color-text-hover-accent);
  }

  .ca-button:active:not(:disabled) {
    transform: scale(0.97);
  }

  .is-loading {
    cursor: wait;
    opacity: 0.7;
  }

  .ca-button__loader {
    display: inline-flex;
    margin-left: 4px;
    width: 12px;
    text-align: left;
  }

  .dot {
    animation: dot-blink 1.4s infinite both;
    font-weight: bold;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes dot-blink {
    0% {
      opacity: 0;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(-2px);
    }
    100% {
      opacity: 0;
      transform: translateY(0);
    }
  }
</style>