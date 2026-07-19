<script setup lang="ts">
  import { CaRow } from '@/components/ca/CaRow';
  import { CaCol } from '@/components/ca/caCol';
  import { onMounted, ref } from 'vue';
  import {
    animateNumber,
    easingFunctionsOption,
    getDurationByValue,
  } from '@/utils/NumberAnimation.ts';

  interface DataBoardProps {
    data: { label: string; value: number }[];
    animation?: boolean;
  }

  const props = withDefaults(defineProps<DataBoardProps>(), {
    animation: false,
  });

  const data = ref<{ label: string; value: number }[]>([]);

  const formatNumber = (val: number): string => {
    const units = [
      { threshold: 100 * 10000, suffix: 'M', divisor: 100 * 10000 },
      { threshold: 10000, suffix: 'W', divisor: 10000 },
      { threshold: 1000, suffix: 'K', divisor: 1000 },
    ];
    for (const unit of units) {
      if (val >= unit.threshold) {
        const result = Math.round((val / unit.divisor) * 100) / 100;
        return `${result.toString().replace(/\.00$/, '').replace(/\.0$/, '')}${unit.suffix}`;
      }
    }

    const result = Math.round(val * 100) / 100;
    return result.toString().replace(/\.00$/, '').replace(/\.0$/, '');
  };

  onMounted(() => {
    if (props.animation) {
      data.value = props.data.map((item) => ({ label: item.label, value: 0 }));
      data.value.forEach((item, index) => {
        const end = props.data[index].value;
        animateNumber({
          delay: 100,
          duration: getDurationByValue(end),
          easing: easingFunctionsOption.easeInQuad,
          start: 0,
          end: end,
          onComplete(): void {},
          onUpdate(value: number): void {
            item.value = value;
          },
          roundToInt: true,
        });
      });
    } else {
      data.value = props.data;
    }
  });
</script>

<template>
  <div class="data-board">
    <ca-row>
      <ca-col
        class="data-board__item_wrapper"
        :span="8"
        v-for="(item, index) in data"
        :key="index">
        <div class="data-board__item">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ formatNumber(item.value) || 0 }}</div>
        </div>
      </ca-col>
    </ca-row>
  </div>
</template>

<style scoped>
  .data-board {
    border: 1px solid var(--color-border);
  }

  .data-board__item {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    row-gap: 14px;
    padding: 8px;
    border-right: 1px solid var(--color-border);
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .data-board__item_wrapper:last-child .data-board__item {
    border-right: unset;
  }

  .data-board__item .label {
    font-size: 16px;
  }

  .data-board__item .value {
    font-size: 28px;
    line-height: 1;
  }
</style>
