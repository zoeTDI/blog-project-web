<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, inject, ref } from 'vue';
  import type { CaCheckboxEmits, CaCheckboxProps, CheckboxValueType } from './types.ts';
  import { caCheckboxGroupKey } from './constants.ts';
  import { isArray } from '@caldm/utils';

  defineOptions({
    name: 'CaCheckbox',
  });

  const context = inject(caCheckboxGroupKey, undefined);

  const props = withDefaults(defineProps<CaCheckboxProps>(), {
    checked: false,
    disabled: false,
    size: 'M',
  });

  const emits = defineEmits<CaCheckboxEmits>();

  const model = defineModel<boolean | CheckboxValueType[]>();

  const ns = useCSSNamespace('checkbox');

  const isFocused = ref<boolean>(false);

  const size = computed(() => {
    if (context) return context.size.value;
    return props.size || 'M';
  });

  const isDisabled = computed(() => {
    if (props.disabled || context?.disabled.value) {
      return true;
    }
    if (context) {
      const selectedList = isArray(context.modelValue.value) ? context.modelValue.value : [];
      const checked = isChecked.value;
      const min = context.min.value;
      const max = context.max.value;
      // 达到或低于 min 限制：已被选中的项禁用，防止继续取消勾选
      if (checked && min !== undefined && selectedList.length <= min) {
        return true;
      }

      // 达到或超过 max 限制：未被选中的项禁用，防止继续新增勾选
      if (!checked && max !== undefined && selectedList.length >= max) {
        return true;
      }
    }
    return false;
  });

  const isChecked = computed(() => {
    if (context) {
      return isArray(context.modelValue.value)
        && context.modelValue.value.includes(props.value);
    }
    if (isArray(model.value)) {
      return (model.value as any[]).includes(props.value);
    }
    return props.checked;
  });

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(size.value),
      ns.is('disabled', isDisabled.value),
      ns.is('checked', isChecked.value),
    ];
    return cls;
  });

  const handleChange = (e: any) => {
    if (isDisabled.value) return;
    const target = e.target as HTMLInputElement;
    const checked = target.checked;
    if (context) {
      context.changeSelect(props.value, checked);
    } else {
      if (isArray(model.value)) {
        const list = [...(model.value as CheckboxValueType[])];
        const index = list.indexOf(props.value);
        if (checked) {
          if (index === -1) {
            list.push(props.value);
          }
        } else {
          if (index > -1) {
            list.splice(index, 1);
          }
        }
        model.value = list;
      } else {
        model.value = checked;
      }
    }

    emits('change', checked, props.value);
  };

  const handleFocus = (e: FocusEvent) => {
    isFocused.value = true;
    emits('focus', e);
  };

  const handleBlur = (e: FocusEvent) => {
    isFocused.value = false;
    emits('blur', e);
  };
</script>

<template>
  <label :class="classes">
    <input :class="ns.e('input')"
           type="checkbox"
           :disabled="isDisabled"
           :checked="isChecked"
           :value="props.value"
           @change="handleChange"
           @focus="handleFocus"
           @blur="handleBlur" />
    <span :class="ns.e('label')">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
  .ca-checkbox {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    user-select: none;
  }

  .ca-checkbox.is-focus:not(.is-disabled) {
    outline: 2px solid #409eff;
    outline-offset: 1px;
    border-radius: 2px;
  }

  .ca-checkbox.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .ca-checkbox.is-disabled input {
    cursor: not-allowed;
  }

  .ca-checkbox__label {
    margin-left: 8px;
  }

  .ca-checkbox--S {
    padding: 4px 6px;
    font-size: 12px;
  }

  .ca-checkbox--M {
    padding: 6px;
    font-size: 16px;
  }

  .ca-checkbox--L {
    padding: 8px 6px;
    font-size: 20px;
  }
</style>