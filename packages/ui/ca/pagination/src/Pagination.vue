<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import {
    ChevronRightIcon,
    ChevronLeftIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    EllipsisHorizontalIcon,
  } from '@heroicons/vue/24/outline';
  import type { CaPaginationEmits, CaPaginationProps } from './types.ts';
  import CaIcon from '../../../icon/src/Icon.vue';
  import CaButton from '../../button/src/Button.vue';
  import { computed, nextTick, ref, watch } from 'vue';
  import { isNumber } from '@caldm/utils';

  defineOptions({
    name: 'CaPagination',
  });

  const model = defineModel({ default: 1 as number });

  const props = withDefaults(defineProps<CaPaginationProps>(), {
    quick: false,
    maxPage: 5,
    total: 0,
  });

  const emits = defineEmits<CaPaginationEmits>();

  const ns = useCSSNamespace('pagination');

  const leftInputRef = ref<HTMLInputElement | null>(null);
  const rightInputRef = ref<HTMLInputElement | null>(null);

  const activeInput = ref<'left' | 'right' | null>(null);
  const customPageNumber = ref<number | null>(null);

  const maxPage = computed(() => {
    return isNumber(props.maxPage) && props.maxPage > 0 ? props.maxPage : 5;
  });

  const total = computed(() => {
    return isNumber(props.total) && props.total > 0 ? props.total : 0;
  });

  const showPrevMore = computed(() => {
    const pagerCount = maxPage.value;
    const totalPage = total.value;
    const currentPage = model.value;

    if (totalPage > pagerCount) {
      if (currentPage > pagerCount - Math.floor(pagerCount / 2)) {
        return true;
      }
    }
    return false;
  });

  const showNextMore = computed(() => {
    const pagerCount = maxPage.value;
    const totalPage = total.value;
    const currentPage = model.value;

    if (totalPage > pagerCount) {
      if (currentPage < totalPage - Math.floor(pagerCount / 2)) {
        return true;
      }
    }
    return false;
  });

  const pagers = computed(() => {
    const pagerCount = maxPage.value;
    const totalPage = total.value;
    const currentPage = model.value;

    if (totalPage <= 1) return [];

    const showPrev = showPrevMore.value;
    const showNext = showNextMore.value;
    const array: number[] = [];

    if (showPrev && !showNext) {
      const startPage = totalPage - (pagerCount - 2);
      for (let i = startPage; i < totalPage; i++) {
        array.push(i);
      }
    } else if (!showPrev && showNext) {
      for (let i = 2; i <= pagerCount - 1; i++) {
        array.push(i);
      }
    } else if (showPrev && showNext) {
      const offset = Math.floor(pagerCount / 2) - 1;
      for (let i = currentPage - offset; i <= currentPage + offset; i++) {
        array.push(i);
      }
    } else {
      for (let i = 2; i < totalPage; i++) {
        array.push(i);
      }
    }

    return array;
  });

  const isActive = (i: number) => {
    return i == model.value;
  };

  const handleClick = (targetPageNumber: number) => {
    if (targetPageNumber < 1 || targetPageNumber > total.value) {
      return;
    }
    model.value = targetPageNumber;
    emits('change', targetPageNumber, total.value);
  };

  const handleJumpPage = () => {
    if (!isNumber(customPageNumber.value)) return;
    if (customPageNumber.value > total.value) {
      model.value = total.value;
      emits('change', total.value, total.value);
    } else if (customPageNumber.value < 1) {
      model.value = 1;
      emits('change', 1, total.value);
    } else {
      model.value = customPageNumber.value;
      emits('change', customPageNumber.value, total.value);
    }
    customPageNumber.value = null;
    activeInput.value = null;
  };

  const handleDisplayInput = (sign: 'left' | 'right') => {
    customPageNumber.value = null;
    activeInput.value = sign;
  };

  watch(activeInput, async (newVal) => {
    if (newVal === 'left') {
      await nextTick();
      leftInputRef.value?.focus();
    } else if (newVal === 'right') {
      await nextTick();
      rightInputRef.value?.focus();
    }
  });

</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('btn-container')">
      <CaButton v-if="quick"
                :icon="ChevronDoubleLeftIcon"
                :type="'text'"
                :disabled="model == 1"
                @click="handleClick(1)" />
      <CaButton :icon="ChevronLeftIcon"
                :type="'text'"
                :disabled="model == 1"
                @click="handleClick(model - 1)" />
    </div>

    <div :class="ns.e('number-container')">
      <!-- 第一页 -->
      <div v-if="total >= 1"
           :class="[ns.e('number-cell'), { 'is-active': isActive(1) }]"
           @click="handleClick(1)">
        1
      </div>

      <!-- 左侧省略号 -->
      <div :class="ns.e('more')"
           v-show="showPrevMore && activeInput !== 'left'"
           @click="handleDisplayInput('left')">
        <CaIcon :icon="EllipsisHorizontalIcon"
                :size="24" />
      </div>

      <!-- 左侧页码输入框 -->
      <div :class="ns.e('input')"
           v-show="activeInput === 'left'">
        <input ref="leftInputRef"
               type="number"
               v-model="customPageNumber"
               @keyup.enter="handleJumpPage"
               @blur="activeInput = null" />
      </div>

      <!-- 中间页码列表 -->
      <div v-for="pager in pagers"
           :key="pager"
           :class="[ns.e('number-cell'), { 'is-active': isActive(pager) }]"
           @click="handleClick(pager)">
        {{ pager }}
      </div>

      <!-- 右侧省略号 -->
      <div :class="ns.e('more')"
           v-show="showNextMore && activeInput !== 'right'"
           @click="handleDisplayInput('right')">
        <CaIcon :icon="EllipsisHorizontalIcon"
                :size="24" />
      </div>

      <!-- 右侧页码输入框 -->
      <div :class="ns.e('input')"
           v-show="activeInput === 'right'">
        <input ref="rightInputRef"
               type="number"
               v-model="customPageNumber"
               @keyup.enter="handleJumpPage"
               @blur="activeInput = null" />
      </div>

      <!-- 最后一页 -->
      <div v-if="total > 1"
           :class="[ns.e('number-cell'), { 'is-active': isActive(total) }]"
           @click="handleClick(total)">
        {{ total }}
      </div>
    </div>

    <div :class="ns.e('btn-container')">
      <CaButton :icon="ChevronRightIcon"
                :type="'text'"
                :disabled="model == total"
                @click="handleClick(model + 1)" />
      <CaButton v-if="quick"
                :icon="ChevronDoubleRightIcon"
                :type="'text'"
                :disabled="model == total"
                @click="handleClick(total)" />
    </div>
  </div>
</template>

<style scoped>
  .ca-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ca-pagination__number-container {
    display: flex;
    flex-wrap: nowrap;
    column-gap: 6px;
    justify-content: center;
    align-items: center;
  }

  .ca-pagination__number-cell {
    width: 30px;
    height: 30px;
    padding: 4px;
    aspect-ratio: 1/1;
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 250ms ease-out;
  }

  .ca-pagination__number-cell:hover {
    color: var(--color-accent);
    border-color: var(--color-border-hover-accent);
  }

  .is-active {
    color: var(--color-accent);
    border-color: var(--color-border-hover-accent);
  }

  .ca-pagination__more {
    cursor: pointer;
  }

  .ca-pagination__input {
    width: 30px;
    height: 30px;
    aspect-ratio: 1/1;
    border: 1px solid var(--color-border);
  }

  .ca-pagination__input input[type="number"] {
    height: 100%;
    max-width: 100%;
    background-color: unset;
    border: 1px solid transparent;
    outline: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: var(--font-text);
    color: var(--color-text-primary);
  }

  .ca-pagination__input input[type=number]::-webkit-outer-spin-button,
  .ca-pagination__input input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .ca-pagination__input input[type=number] {
    -moz-appearance: textfield;
  }
</style>