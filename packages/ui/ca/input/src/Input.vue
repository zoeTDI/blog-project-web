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

  const ns = useCSSNamespace('input');

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
               :class="ns.e('input')"
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
  .ca-input {
    outline: 1px solid transparent;
    border: 1px solid transparent;
    transition: all 300ms ease;
  }

  .ca-input.ca-input--size-S {
    padding: 3px 5px;
  }

  .ca-input.ca-input--size-M {
    padding: 5px 7px;
  }

  .ca-input.ca-input--size-L {
    padding: 8px 12px;
  }

  .ca-input.is-focus {
    outline: 1px solid var(--color-accent);
    box-shadow: 0 0 4px var(--color-accent);
  }

  .ca-input.is-disabled {
    background-color: #fafafa;
  }

  .ca-input.is-radius {
    border-radius: var(--ca-radius);
  }

  .ca-input.is-border {
    border: 1px solid var(--color-border);
  }

  .ca-input__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 0;
    column-gap: 8px;
  }

  .ca-input__wrapper {
    width: 100%;
    height: 100%;
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 6px;
  }

  .ca-input__input {
    flex: 1 0 auto;
    line-height: 1.5;
    font-family: var(--font-text);
    color: var(--color-text-primary);
    border: 1px solid transparent;
    outline: 1px solid transparent;
  }

  .ca-input__input:focus {
    outline: 1px solid transparent;
    border: 1px solid transparent;
  }

  .ca-input__input:disabled {
    background-color: transparent;
  }

  .ca-input__input:read-only {
    background-color: transparent;
  }


  .ca-input--size-S .ca-input__input,
  .ca-input--size-M .ca-input__input,
  .ca-input--size-L .ca-input__input {
    font-size: 16px;
  }

  .ca-input__clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 300ms ease;
  }

  .ca-input__clear-btn:hover {
    color: var(--color-accent);
  }

  .ca-input__counter {
    flex-shrink: 0;
    margin-left: 6px;
    font-size: 12px;
    color: var(--color-text-primary);
    user-select: none;
    line-height: 1;
  }

  .ca-input.is-limit .ca-input__counter {
    color: #f56c6c;
    font-weight: bold;
  }
</style>