<script setup lang="ts" generic="T extends Record<string, any>">
  import ChinaCityTree from '@/assets/data/ChinaCityTree.json';
  import { computed, nextTick, ref, shallowRef, watch } from 'vue';
  import { ChevronDownIcon } from '@heroicons/vue/24/outline';
  import type {
    CascadeFieldName,
    CascaderProps,
  } from '@/components/ca/caCascader';

  const props = withDefaults(defineProps<CascaderProps<T>>(), {
    type: 'custom',
    options: () => [],
    placeholder: '请选择数据',
    optionWidth: 200,
    splitChar: '/',
    fieldNames: () => ({
      label: 'label',
      value: 'value',
      children: 'children',
    }),
  });
  const modelValue = defineModel<any[]>({ default: () => [] });
  const emits = defineEmits<{
    (e: 'on-change', value: T[]): void;
  }>();

  const cascaderRef = ref<HTMLElement | null>(null);
  const panelRef = ref<HTMLElement | null>(null);

  const curSelect = shallowRef<T[]>([]);
  const isFocus = ref<boolean>(false);
  const panelDirection = ref<'right' | 'left'>('right');

  const keys = computed<CascadeFieldName>(() => ({
    label: props.fieldNames?.label || 'label',
    value: props.fieldNames?.value || 'value',
    children: props.fieldNames?.children || 'children',
  }));
  // 获取数据
  const getData = (): T[] => {
    if (props.type === 'city') {
      return ChinaCityTree as unknown as T[];
    }
    return Array.isArray(props.options) ? props.options : [];
  };
  // 获取label
  const getLabel = (item: T): string => item?.[keys.value.label] ?? '';
  // 获取value
  const getValue = (item: T): any => item?.[keys.value.value] ?? '';
  // 获取children
  const getChildren = (item: T): T[] => item?.[keys.value.children] ?? '';
  // 获取分隔符
  const getSplitChar = (): string => {
    return props.splitChar && typeof props.splitChar === 'string'
      ? props.splitChar
      : '/';
  };

  /**
   * 计算多集面板数据
   */
  const panels = computed<T[][]>(() => {
    const result: T[][] = [];
    result.push(getData());
    for (const item of curSelect.value) {
      const children = getChildren(item);
      if (children?.length && children.length > 0) {
        result.push(children);
      } else {
        break;
      }
    }
    return result;
  });

  /**
   * 处理输入框获得焦点
   */
  const handleInputFocus = () => {
    isFocus.value = true;
    calculatePanelDirection();
  };
  /**
   * 处理输入框失去焦点
   */
  const handleInputBlur = () => {
    isFocus.value = false;
  };
  /**
   * 处理一级菜单点击事件
   * @param item 城市信息
   * @param i 数据层级
   */
  const handleOptionClick = (item: T, i: number) => {
    const nextSelect = [...curSelect.value];

    nextSelect.splice(i);
    nextSelect.push(item);

    curSelect.value = nextSelect;

    // 没有子节点，关闭面板
    const children = getChildren(item);
    if (!children || children.length == 0) {
      handleInputBlur();
    }
  };

  /**
   * 计算面板展开方向
   */
  const calculatePanelDirection = async () => {
    await nextTick();
    if (!cascaderRef.value || !panelRef.value) return;

    const triggerRect = cascaderRef.value.getBoundingClientRect();
    const viewPortWidth = window.innerWidth;

    const rightSp = viewPortWidth - triggerRect.left;
    const leftSp = triggerRect.right;
    panelDirection.value = rightSp > leftSp ? 'right' : 'left';
  };

  watch(
    () => curSelect.value,
    (newSelect) => {
      const values = newSelect.map((item) => getValue(item));
      modelValue.value = values;
      emits('on-change', newSelect);
    },
    {
      deep: true,
    }
  );

  watch(
    modelValue,
    (newModelVal) => {
      if (!newModelVal || newModelVal.length === 0) {
        if (curSelect.value.length === 0) return;
        curSelect.value = [];
        return;
      }
      // 如果内部已经对应上了，就不重复查找
      const curValues = curSelect.value.map((item) => getValue(item));
      if (JSON.stringify(curValues) === JSON.stringify(newModelVal)) return;

      // 树形递归查找匹配的节点链路
      const findPath = (list: T[], index: number, path: T[]): T[] | null => {
        const targetValue = newModelVal[index];
        const found = list.find((item) => getValue(item) === targetValue);
        if (!found) return null;

        const newPath = [...path, found];
        if (index === newModelVal.length - 1) return newPath;

        return findPath(getChildren(found), index + 1, newPath);
      };

      const resultPath = findPath(getData(), 0, []);
      if (resultPath) curSelect.value = resultPath;
    },
    { immediate: true }
  );
</script>

<template>
  <div
    ref="cascaderRef"
    class="ca-cascader"
    :class="[{ focus: isFocus }, `direction-${panelDirection}`]">
    <div class="ca-cascader_container">
      <input
        type="text"
        :value="curSelect.map((item) => getLabel(item)).join(getSplitChar())"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        :placeholder="props.placeholder" />
      <div class="input_suffix"><chevron-down-icon class="icon" /></div>
    </div>
    <div
      class="ca-cascader_panels"
      ref="panelRef">
      <div
        class="ca-cascader_panel"
        :style="{ width: props.optionWidth + 'px' }"
        v-for="(list, level) in panels"
        :key="level">
        <ul class="menu">
          <li
            v-for="item in list"
            :key="getValue(item)"
            class="option"
            :class="{ active: getValue(curSelect[level]) === getValue(item) }"
            @mousedown.prevent="handleOptionClick(item, level)">
            <span class="label">{{ getLabel(item) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ca-cascader {
    width: max-content;
    position: relative;
  }

  .ca-cascader_container {
    border: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 8px 6px;
    transition: border-color 0.2s ease;
  }

  .focus .ca-cascader_container {
    border-color: color-mix(
      in srgb,
      var(--color-border) 60%,
      var(--color-accent) 40%
    );
  }

  input[type='text'] {
    border: unset;
    outline: 1px solid transparent;
    font-size: 16px;
    background-color: var(--color-root-bg);
    color: var(--color-text-primary);
  }

  .input_suffix {
    width: 16px;
    height: 16px;
  }

  .ca-cascader_panels {
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    position: absolute;
    top: 100%;
    height: 0;
    opacity: 0;
    will-change: height, opacity;
    transition:
      height 150ms ease,
      opacity 150ms ease;
    border: 1px solid var(--color-border);
    background-color: var(--color-root-bg);
    overflow: auto;
    scrollbar-width: none;
  }

  .ca-cascader.direction-right .ca-cascader_panels {
    left: 0;
  }

  .ca-cascader.direction-left .ca-cascader_panels {
    right: 0;
  }

  .focus .ca-cascader_panels {
    height: 300px;
    opacity: 1;
  }

  .ca-cascader_panel {
    width: 100%;
    padding: 4px 0;
    border-right: 2px solid var(--color-border);
  }

  .ca-cascader_panel:last-child {
    border-right-color: transparent;
  }
  .ca-cascader_panel .option {
    padding: 8px;
  }

  .ca-cascader_panel .option:hover {
    background-color: var(--color-bg-hover);
  }

  .ca-cascader_panel .option.active {
    color: var(--color-accent, #3b82f6);
    background-color: color-mix(
      in srgb,
      var(--color-accent, #3b82f6) 10%,
      transparent
    );
    font-weight: 500;
  }

  .ca-cascader_panel .option .label {
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }
</style>
