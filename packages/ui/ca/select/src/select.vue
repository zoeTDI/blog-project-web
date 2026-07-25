<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue';
  import type { CaSelectProps } from './types.ts';
  import { caSelectKey, caSelectStyleKey } from './constants.ts';
  import CaSelectDropdown from './dropdown.vue';

  defineOptions({
    name: 'CaSelect',
  });

  const props = withDefaults(defineProps<CaSelectProps>(), {
    disabled: false,
    placeholder: 'Select',
    size: 'M',
  });

  const model = defineModel<string | number | boolean | undefined | null>({
    default: '',
  });
  const ns = useCSSNamespace('select');

  const selectRef = ref<HTMLElement | null>(null);

  const visible = ref<boolean>(false);
  const displayLabel = ref<string>('');
  const placement = ref<'bottom' | 'top'>('bottom');
  const selectWidth = ref<number>(0);
  const optionsMap = ref<Map<any, string>>(new Map());

  // 下拉菜单位置相关
  const dropdownTop = ref(0);
  const dropdownLeft = ref(0);
  const dropdownMinWidth = ref(0);
  const dropdownMaxHeight = ref(240);
  const dropdownPlacement = ref<'bottom' | 'top'>('bottom');

  const updateDropdownPosition = () => {
    if (!selectRef.value) return;
    const rect = selectRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const GAP = 4;
    const MAX_HEIGHT = 240;

    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    let placement: 'bottom' | 'top';
    let top: number;
    let maxHeight: number;

    // 优先下方，若下方不足且上方更大，则改为上方
    if (spaceBelow >= MAX_HEIGHT || spaceBelow >= spaceAbove) {
      placement = 'bottom';
      top = rect.bottom + GAP;
      maxHeight = Math.min(MAX_HEIGHT, Math.max(spaceBelow - GAP, 20));
    } else {
      placement = 'top';
      top = rect.top - GAP - MAX_HEIGHT;
      maxHeight = Math.min(MAX_HEIGHT, Math.max(spaceAbove - GAP, 20));
    }

    dropdownPlacement.value = placement;
    dropdownTop.value = top;
    dropdownLeft.value = rect.left;
    dropdownMinWidth.value = rect.width;
    dropdownMaxHeight.value = maxHeight;
  };

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(props.size),
      ns.is('disabled', props.disabled),
    ];
    return cls;
  });

  const selectOption = (value: any, label: string) => {
    model.value = value;
    displayLabel.value = label;
    visible.value = false;
  };

  const registerOption = (value: any, label: string) => {
    optionsMap.value.set(value, label);
    if (model.value === value) {
      displayLabel.value = label;
    }
  };

  provide(caSelectKey, { selectOption, registerOption, selectedValue: model });

  const handleInputClick = () => {
    if (props.disabled) return;
    if (visible.value) {
      visible.value = false;
      return;
    }
    updateDropdownPosition();
    visible.value = true;
  };

  // 点击外部关闭
  const handleOutsideClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (selectRef.value && !selectRef.value.contains(target)) {
      visible.value = false;
    }
  };

  // 窗口变化时重新定位
  const handleResizeOrScroll = () => {
    if (visible.value) {
      updateDropdownPosition();
    }
  };

  // 监视 visible 变化，若打开则更新位置
  watch(visible, (newVal) => {
    if (newVal) {
      nextTick(() => {
        updateDropdownPosition();
      });
    }
  });

  // 监听 model 变化更新显示文本
  watch(
    () => model.value,
    (newVal) => {
      if (optionsMap.value.has(newVal)) {
        displayLabel.value = optionsMap.value.get(newVal) || '';
      } else {
        displayLabel.value = (newVal ?? '') as string;
      }
    },
    { immediate: true },
  );

  onMounted(() => {
    window.addEventListener('click', handleOutsideClick, true);
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true);
  });

  onUnmounted(() => {
    window.removeEventListener('click', handleOutsideClick, true);
    window.removeEventListener('resize', handleResizeOrScroll);
    window.removeEventListener('scroll', handleResizeOrScroll, true);
  });
</script>

<template>
  <div
    ref="selectRef"
    :class="classes">
    <input
      :disabled="props.disabled"
      type="text"
      readonly
      :class="ns.e('input')"
      :value="displayLabel"
      :placeholder="props.placeholder"
      @click="handleInputClick" />
    <CaSelectDropdown
      v-if="visible && !props.disabled"
      :placement="dropdownPlacement"
      :top="dropdownTop"
      :left="dropdownLeft"
      :min-width="dropdownMinWidth"
      :max-height="dropdownMaxHeight">
      <slot />
    </CaSelectDropdown>
  </div>
</template>

<style scoped>
  @import "../styles/style.css";
</style>