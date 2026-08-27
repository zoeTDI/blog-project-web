<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';
  import type { CaInputEmits, CaInputProps } from './types.ts';
  import CaIcon from '../../../icon/src/Icon.vue';
  import { isEmpty, isNumber, isString } from '@caldm/utils';
  import { XCircleIcon } from '@heroicons/vue/24/outline';

  defineOptions({
    name: 'CaInput',
  });
  const emits = defineEmits<CaInputEmits>();
  const props = withDefaults(defineProps<CaInputProps>(), {
    disabled: false,
    readonly: false,
    clearable: true,
    size: 'M',
    radius: 0,
    border: true,
    type: 'text',
  });
  const model = defineModel({ default: '' });

  const ns = useCSSNamespace('field');

  const inputRef = ref<HTMLInputElement | null>(null);
  const active = ref<boolean>(false);

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(`size-${props.size}`),
      ns.is('focus', active.value),
      ns.is('disabled', props.disabled),
      ns.is('readonly', props.readonly),
      ns.is('radius', !!props.radius),
      ns.is('border', props.border),
      ns.is('limit', isMaxLength.value),
    ];
    return cls;
  });

  const styles = computed(() => {
    const sty: Record<string, string> = {};
    if (isNumber(props.radius) && Math.floor(props.radius) > 0) {
      let k = ns.cssVarName('radius');
      sty[k] = `${Math.floor(props.radius)}px`;
    }
    return sty;
  });
  // type = text/password; length
  const maxLength = computed(() => {
    if ((props.type === 'text' || props.type === 'password')
      && isNumber(props.length) && props.length > 0) {
      return props.length;
    }
    return undefined;
  });
  const currentLength = computed(() => (model.value || '').length);
  const counterText = computed(() => {
    if (props.counterFormatter) {
      return props.counterFormatter(currentLength.value, maxLength.value || 0);
    }
    return `${currentLength.value}/${maxLength.value}`;
  });
  const isMaxLength = computed(() => {
    if (!maxLength.value) return false;
    return currentLength.value >= maxLength.value;
  });
  // type = number; min max
  const minAttr = computed(() => {
    if (props.type === 'number' && props.min !== undefined) {
      return props.min;
    }
    return undefined;
  });

  const maxAttr = computed(() => {
    if (props.type === 'number' && props.max !== undefined) {
      return props.max;
    }
    return undefined;
  });

  const handleFocus = (e: FocusEvent) => {
    active.value = true;
    emits('focus', e);
  };
  const handleBlur = (e: FocusEvent) => {
    active.value = false;
    emits('blur', e);
  };
  const handleClearBtnClick = () => {
    if (!props.readonly && !props.disabled) {
      model.value = '';
      emits('clear');
    }
  };

  const handleChange = (e: Event) => {
    const target = e?.target as HTMLInputElement;
    emits('change', target.value);
  };

  const handleInput = () => {
    emits('input', model.value);
  };
</script>

<template>
  <div :class="classes" :style="styles">
    <div :class="ns.e('container')">
      <div v-if="prefix" :class="ns.e('prefix')">
        <template v-if="isString(prefix)">
          {{ prefix }}
        </template>
        <template v-else>
          <CaIcon :icon="prefix" :size="size" />
        </template>
      </div>
      <div :class="ns.e('wrapper')">
        <input ref="inputRef"
               v-model="model"
               :class="ns.e('inner')"
               :type="type"
               :readonly="readonly"
               :disabled="disabled"
               :aria-readonly="readonly"
               :maxlength="maxLength"
               :max="maxAttr"
               :min="minAttr"
               @focus="handleFocus"
               @blur="handleBlur"
               @change="handleChange"
               @input="handleInput" />
        <div v-show="clearable && !isEmpty(model) && !readonly" :class="ns.e('clear-btn')">
          <CaIcon :icon="XCircleIcon" :size="20" @click="handleClearBtnClick" />
        </div>
        <span
          v-if="showCounter && maxLength"
          :class="ns.e('counter')">
          {{ counterText }}
        </span>
      </div>
      <div v-if="suffix" :class="ns.e('prefix')">
        <template v-if="isString(suffix)">
          {{ suffix }}
        </template>
        <template v-else>
          <CaIcon :icon="suffix" :size="size" />
        </template>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .ca-field {
    display: inline-block;
    outline: 1px solid transparent;
    border: 1px solid transparent;
    transition: outline-color 300ms ease, box-shadow 300ms ease, background-color 300ms ease;
  }

  .ca-field.ca-field--size-S {
    padding: var(--padding-field-S);
  }

  .ca-field.ca-field--size-M {
    padding: var(--padding-field-M);
  }

  .ca-field.ca-field--size-L {
    padding: var(--padding-field-L);
  }

  .ca-field.is-focus {
    outline: var(--outline-field-focus);
    box-shadow: var(--shadow-field-focus);
  }

  .ca-field.is-disabled {
    background-color: var(--bg-field-disabled);
  }

  .ca-field.is-radius {
    border-radius: var(--ca-radius);
  }

  .ca-field.is-border {
    border: var(--field-border);
  }

  .ca-field__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 0;
    column-gap: 8px;
  }

  .ca-field__wrapper {
    width: 100%;
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 6px;
  }

  .ca-field__inner {
    flex: 1 0 auto;
    line-height: 1.5;
    font-family: var(--field-font-family);
    font-size: var(--size-field-font);
    color: var(--color-field-text);
    border: 1px solid transparent;
    outline: 1px solid transparent;
  }

  .ca-field__inner:focus {
    outline: 1px solid transparent;
    border: 1px solid transparent;
  }

  .ca-field__inner:disabled {
    background-color: transparent;
  }

  .ca-field__inner:read-only {
    background-color: transparent;
  }


  .ca-field--size-S .ca-field__inner,
  .ca-field--size-M .ca-field__inner,
  .ca-field--size-L .ca-field__inner {
    font-size: 16px;
  }

  .ca-field__clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 300ms ease;
  }

  .ca-field__clear-btn:hover {
    color: var(--color-accent);
  }

  .ca-field__counter {
    flex-shrink: 0;
    margin-left: 6px;
    font-size: 12px;
    color: var(--color-field-text);
    user-select: none;
    line-height: 1;
  }

  .ca-field.is-limit .ca-field__counter {
    color: var(--color-field-length-error);
    font-weight: bold;
  }
</style>