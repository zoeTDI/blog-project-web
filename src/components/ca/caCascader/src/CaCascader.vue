<script setup lang="ts">
  import ChinaCityTree from '@/assets/data/ChinaCityTree.json';
  import { computed, nextTick, ref, watch } from 'vue';
  import { ChevronDownIcon } from '@heroicons/vue/24/outline';
  import type { City, Props } from '@/components/ca/caCascader';

  const props = withDefaults(defineProps<Props>(), {
    placeholder: '请选择数据',
    optionWidth: 200,
  });
  const emits = defineEmits<{
    (e: 'on-change', value: City[]): void;
  }>();

  const cascaderRef = ref<HTMLElement | null>(null);
  const panelRef = ref<HTMLElement | null>(null);

  const CITY_DATA: City[] = ChinaCityTree as City[];
  const curSelect = ref<City[]>([]);
  const isFocus = ref<boolean>(false);
  const panelDirection = ref<'right' | 'left'>('right');

  const panels = computed(() => {
    const result: City[][] = [];
    result.push(CITY_DATA);
    for (const item of curSelect.value) {
      if (item.children?.length) {
        result.push(item.children);
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
  const handleOptionClick = (item: City, i: number) => {
    curSelect.value.splice(i);
    curSelect.value.push(item);
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

  watch(curSelect.value, (newValue) => {
    console.log('🚀 ~  ~ newValue: ', newValue);
    emits('on-change', newValue);
  });
</script>

<template>
  <div
    ref="cascaderRef"
    class="ca-cascader"
    :class="[{ focus: isFocus }, `direction-${panelDirection}`]">
    <div class="ca-cascader_container">
      <input
        type="text"
        :value="curSelect.map((item) => item.label).join('/')"
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
            :key="item.value"
            class="option"
            @mousedown.prevent="handleOptionClick(item, level)">
            <span class="label">{{ item.label }}</span>
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
  }

  .ca-cascader_panel .option {
    padding: 8px;
  }
  .ca-cascader_panel .option:hover {
    background-color: var(--color-bg-hover);
  }
  .ca-cascader_panel .option .label {
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }
</style>
