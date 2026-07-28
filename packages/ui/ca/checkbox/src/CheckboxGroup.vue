<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, provide } from 'vue';
  import { caCheckboxGroupKey } from './constants.ts';
  import type { CaCheckboxGroupEmits, CaCheckboxGroupProps, CheckboxValueType } from './types.ts';

  defineOptions({
    name: 'CaCheckboxGroup',
  });

  const props = withDefaults(defineProps<CaCheckboxGroupProps>(), {
    disabled: false,
    size: 'M',
  });

  const emits = defineEmits<CaCheckboxGroupEmits>();

  const model = defineModel<CheckboxValueType[]>({ default: () => [] });

  const ns = useCSSNamespace('checkbox-group');

  const size = computed(() => props.size);
  const disabled = computed(() => props.disabled);
  const min = computed(() => props.min);
  const max = computed(() => props.max);

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(size.value),
    ];
    return cls;
  });

  /**
   * 检查数量限制规则 (min / max)
   */
  const checkQuantityLimit = (value: CheckboxValueType, currentList: CheckboxValueType[]): boolean => {
    const isSelected = currentList.includes(value);
    if (isSelected && min.value !== undefined && currentList.length <= min.value) {
      return false;
    }
    return !(!isSelected && max.value !== undefined && currentList.length >= max.value);
  };

  /**
   * 判断是否能更新已选项（汇总所有限制规则校验入口）
   */
  const canUpdateSelect = (value: CheckboxValueType, currentList: CheckboxValueType[]): boolean => {
    if (!checkQuantityLimit(value, currentList)) {
      return false;
    }
    return true;
  };

  const changeSelect = (value: CheckboxValueType, checked: boolean) => {
    const list = [...(model.value || [])];
    if (!canUpdateSelect(value, list)) {
      return;
    }
    const index = list.indexOf(value);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(value);
    }
    model.value = list;
    emits('change', list);
    emits('change', checked, value);
  };

  provide(caCheckboxGroupKey, {
    modelValue: computed(() => model.value),
    size,
    disabled,
    min,
    max,
    changeSelect,
  });
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped>

</style>