<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue';
  import type { CaSelectProps, LayoutParams, PositionResult } from './types.ts';
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

  const CHANGE_THRESHOLD = 8;
  const MAX_HEIGHT = 240;
  const GAP = 4;

  const ns = useCSSNamespace('select');

  const selectRef = ref<HTMLElement | null>(null);

  const visible = ref<boolean>(false);
  const displayLabel = ref<string>('');
  const optionsMap = ref<Map<any, string>>(new Map());

  // 下拉菜单位置相关
  const dropdownTop = ref(0);
  const dropdownLeft = ref(0);
  const dropdownMinWidth = ref(0);
  const dropdownMaxHeight = ref(240);
  const dropdownPlacement = ref<'bottom' | 'top'>('bottom');

  let rafId: number | null = null;
  let lastPosition = {
    top: 0,
    left: 0,
    minWidth: 0,
    maxHeight: 0,
    placement: 'bottom' as 'bottom' | 'top',
  };

  /**
   * 获取下拉菜单定位所需的布局参数
   * @returns {LayoutParams | null} 布局参数对象，若选择器元素不存在则返回 null
   */
  const getLayoutParams = (): LayoutParams | null => {
    if (!selectRef.value) return null;
    const rect = selectRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return {
      rect,
      windowHeight,
      spaceBelow: windowHeight - rect.bottom,
      spaceAbove: rect.top,
    };
  };

  /**
   * 根据布局参数计算下拉菜单的最佳位置和最大高度
   * @param {LayoutParams} params - 布局参数
   * @returns {PositionResult} 包含 placement、top、maxHeight 的结果对象
   */
  const calcDropdownPosition = (params: LayoutParams): PositionResult => {
    const { rect, spaceBelow, spaceAbove } = params;
    let placement: 'bottom' | 'top';
    let top: number;
    let maxHeight: number;

    if (spaceBelow >= MAX_HEIGHT || spaceBelow >= spaceAbove) {
      placement = 'bottom';
      top = rect.bottom + GAP;
      maxHeight = Math.min(MAX_HEIGHT, Math.max(spaceBelow - GAP, 20));
    } else {
      placement = 'top';
      top = rect.top - GAP - MAX_HEIGHT;
      maxHeight = Math.min(MAX_HEIGHT, Math.max(spaceAbove - GAP, 20));
    }

    return { placement, top, maxHeight };
  };

  /**
   * 判断新的位置信息与上次缓存的位置是否有显著变化
   * @param {PositionResult & { left: number; minWidth: number }} newPos - 新的完整位置信息
   * @returns {boolean} 若变化超过阈值则返回 true
   */
  const hasPositionChanged = (
    newPos: PositionResult & { left: number; minWidth: number },
  ): boolean => {
    const { top, left, minWidth, maxHeight, placement } = newPos;
    return (
      Math.abs(top - lastPosition.top) > CHANGE_THRESHOLD / 2 ||
      Math.abs(left - lastPosition.left) > CHANGE_THRESHOLD / 2 ||
      Math.abs(minWidth - lastPosition.minWidth) > CHANGE_THRESHOLD / 2 ||
      Math.abs(maxHeight - lastPosition.maxHeight) > CHANGE_THRESHOLD / 2 ||
      placement !== lastPosition.placement
    );
  };

  /**
   * 将位置信息应用到响应式状态，并缓存最新位置
   * @param {PositionResult & { left: number; minWidth: number }} pos - 完整位置信息
   */
  const applyPosition = (pos: PositionResult & { left: number; minWidth: number }) => {
    dropdownPlacement.value = pos.placement;
    dropdownTop.value = pos.top;
    dropdownLeft.value = pos.left;
    dropdownMinWidth.value = pos.minWidth;
    dropdownMaxHeight.value = pos.maxHeight;
    // 缓存最新位置
    lastPosition = { ...pos };
  };

  /**
   * 更新下拉菜单的位置（主流程：获取布局 → 计算位置 → 比较变化 → 应用更新）
   */
  const updateDropdownPosition = () => {
    const params = getLayoutParams();
    if (!params) return;

    const { rect } = params;
    const posResult = calcDropdownPosition(params);
    const fullPos = {
      ...posResult,
      left: rect.left,
      minWidth: rect.width,
    };

    if (hasPositionChanged(fullPos)) {
      applyPosition(fullPos);
    }
  };


  /**
   * 节流版位置更新，使用 requestAnimationFrame 合并高频触发
   */
  const updateDropdownPositionThrottled = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      updateDropdownPosition();
      rafId = null;
    });
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
      updateDropdownPositionThrottled();
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
    // 清理未执行的 raf
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
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