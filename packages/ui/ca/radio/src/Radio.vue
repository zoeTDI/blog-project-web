<script setup lang="ts">
  import { computed, inject, unref } from 'vue';
  import { caRadioGroupKey } from './constants.ts';
  import type { CaRadioProps } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import CaIcon from '../../../icon/src/icon.vue';

  defineOptions({
    name: 'CaRadio',
  });

  const props = defineProps<CaRadioProps>();

  const groupContext = inject(caRadioGroupKey, null);

  const ns = useCSSNamespace('radio');

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(groupContext?.size.value || 'M'),
      ns.m(groupContext?.layout.value || 'list'),
      ns.is('active', isChecked.value),
    ];
    return cls;
  });

  const isChecked = computed(() => {
    if (groupContext) {
      return unref(groupContext.modelValue.value) === props.value;
    }
    return false;
  });

  const handleClick = () => {
    if (props.disabled || groupContext?.disabled.value) return;
    if (groupContext) {
      groupContext.changeEvent(props.value);
    }
  };
</script>

<template>
  <div :class="classes" @click="handleClick">
    <div :class="ns.e('indicator-container')">
      <div :class="ns.e('indicator')">
        <div :class="ns.e('indicator-dot')"></div>
      </div>
    </div>

    <div :class="ns.e('container')">
      <CaIcon v-if="props.icon" :icon="icon" />
      <span v-if="label" :class="ns.e('label')">
        <slot>{{ label }}</slot>
      </span>
    </div>
  </div>
</template>

<style scoped>
  .ca-radio {
    display: flex;
    align-items: center; /* 垂直居中 */
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    font-family: var(--font-text);
    background: transparent;
    padding: 8px 0;
    gap: 4px;
  }

  .ca-radio__indicator-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    flex-shrink: 0;
  }

  .ca-radio__indicator {
    width: 14px;
    height: 14px;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    background-color: var(--color-container-bg);
  }

  .ca-radio__indicator-dot {
    width: 6px;
    height: 6px;
    background-color: var(--color-bg-accent);
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.2s ease;
  }

  .ca-radio__container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    line-height: 1;
  }

  .ca-radio__label {
    letter-spacing: 1px;
    color: var(--color-text-primary);
  }

  .ca-radio--list {
    width: 100%;
  }

  .ca-radio--flow {
    display: inline-flex;
  }

  .is-active .ca-radio__indicator,
  .is-active .ca-radio__indicator {
    border-color: var(--color-border-accent);
  }

  .is-active .ca-radio__indicator-dot,
  .is-active .ca-radio__indicator-dot {
    transform: scale(1);
  }

  .is-active .ca-radio__label,
  .is-active .ca-radio__label {
    color: var(--color-accent);
    font-weight: 600;
    opacity: 1;
  }

  .ca-radio--S {
    padding: 4px 6px;
    font-size: 12px;
  }

  .ca-radio--M {
    padding: 6px;
    font-size: 16px;
  }

  .ca-radio--L {
    padding: 8px 6px;
    font-size: 20px;
  }
</style>