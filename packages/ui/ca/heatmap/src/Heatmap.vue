<script setup lang="ts">
  import type { CaHeatmapProps, HeatmapValue } from './types.ts';
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';
  import CaHeatmapTip from './HeatmapTip.vue';

  defineOptions({
    name: 'CaHeatmap',
  });

  const props = withDefaults(defineProps<CaHeatmapProps>(), {
    data: () => ({}),
    rate: null,
    height: 240, // 略微增加了默认高度，给底部的图例留出更充裕的纵向空间
    bottomHeight: 18, // 略微增加底部占比，用于容纳日期和说明
    firstDayOfWeek: 1,
    levelBy: () => [3, 5, 10, 15],
    loading: false,
  });

  const ns = useCSSNamespace('heatmap');

  const mapWrapperRef = ref<HTMLElement | null>(null);
  const viewBox = ref<string>(`0 0 600 240`);

  const svgWidth = ref(600);
  const svgHeight = ref(240);

  let observer: ResizeObserver | null = null;

  const tipVisible = ref(false);
  const tipX = ref(0);
  const tipY = ref(0);
  const tipActiveData = ref<HeatmapValue | null>(null);

  const lineYCoordinate = computed(() => {
    return svgHeight.value * (1 - props.bottomHeight / 100);
  });

  const todayGridIndex = computed(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return (dayOfWeek - props.firstDayOfWeek + 7) % 7;
  });

  const gridConfig = computed(() => {
    const gapRatio = 0.15;
    const rows = 7;

    const size = lineYCoordinate.value / (rows + rows * gapRatio);
    const gap = size * gapRatio;

    const cols = Math.floor((svgWidth.value + gap) / (size + gap));

    if (cols < 1) {
      return {
        rects: [],
        labels: [],
        size: 0,
        gap: 0,
        earliestDate: new Date(),
      };
    }

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const lastColFirstDayTime =
      todayStart - todayGridIndex.value * 24 * 60 * 60 * 1000;

    const rects: { id: string; x: number; y: number; size: number; data: HeatmapValue }[] = [];
    let labels = [];
    let lastDisplayedMonthKey = '';

    const activeData = props.data;

    for (let c = 0; c < cols; c++) {
      const weeksAgo = cols - 1 - c;
      const colFirstDay = new Date(
        lastColFirstDayTime - weeksAgo * 7 * 24 * 60 * 60 * 1000,
      );
      const colLastDay = new Date(
        colFirstDay.getTime() + 6 * 24 * 60 * 60 * 1000,
      );

      // 构造这一列的网格方格
      for (let r = 0; r < rows; r++) {
        const isLastColumn = c === cols - 1;
        if (isLastColumn && r > todayGridIndex.value) {
          continue;
        }

        const currentRectDate = new Date(
          colFirstDay.getTime() + r * 24 * 60 * 60 * 1000,
        );
        const dateStr = formatDateString(currentRectDate);

        const cellData: HeatmapValue = activeData[dateStr];

        rects.push({
          id: `${c}-${r}`,
          x: c * (size + gap),
          y: r * (size + gap),
          size: size,
          data: cellData,
        });
      }

      // 计算底部的文本标签
      let labelText = '';
      const colXCenter = c * (size + gap) + size / 2;
      const startYear = colFirstDay.getFullYear();
      const startMonth = colFirstDay.getMonth() + 1;
      const startLabelMonth = String(startMonth).padStart(2, '0');
      const endYear = colLastDay.getFullYear();
      const endMonth = colLastDay.getMonth() + 1;

      if (startYear !== endYear) {
        const endLabelMonth = String(endMonth).padStart(2, '0');
        labelText = `${startYear}/${startLabelMonth}-${endYear}/${endLabelMonth}`;
        lastDisplayedMonthKey = `${endYear}-${endMonth}`;
      } else if (startMonth !== endMonth) {
        const startDate = String(colFirstDay.getDate()).padStart(2, '0');
        const endDate = String(colLastDay.getDate()).padStart(2, '0');
        const endLabelMonth = String(endMonth).padStart(2, '0');
        labelText = `${startLabelMonth}/${startDate}-${endLabelMonth}/${endDate}`;
        lastDisplayedMonthKey = `${endYear}-${endMonth}`;
      } else {
        const currentMonthKey = `${startYear}-${startMonth}`;
        if (currentMonthKey !== lastDisplayedMonthKey) {
          labelText = `${startMonth}月`;
          lastDisplayedMonthKey = currentMonthKey;
        }
      }

      if (labelText) {
        labels.push({
          id: `label-${c}`,
          text: labelText,
          x: colXCenter,
          y: lineYCoordinate.value + 16, // 日期文本纵向位置微调
        });
      }
    }

    // 删除间隔过近的label，防止文字重叠
    const minLabelSpacing = (size + gap) * 1.8;
    labels = filterCloseLabels(labels, minLabelSpacing);
    return {
      rects,
      labels,
      size,
      gap,
      earliestDate: new Date(
        lastColFirstDayTime - (cols - 1) * 7 * 24 * 60 * 60 * 1000,
      ),
    };
  });

  const legendConfig = computed(() => {
    const boxSize = 11; // 说明方块稍微小一点，显得精致
    const boxGap = 4;
    const totalBoxes = 6; // 0级 到 5级 共 6 个方块

    // 图例整体的宽度
    const legendWidth = 30 + (boxSize + boxGap) * totalBoxes + 35;

    // 至于右下角
    const startX = svgWidth.value - legendWidth;
    const startY = lineYCoordinate.value + 22;

    return {
      startX,
      startY,
      boxSize,
      boxGap,
    };
  });

  function filterCloseLabels(
    labels: { id: string; text: string; x: number; y: number }[],
    minSpacing: number,
  ) {
    for (let i = labels.length - 1; i > 0; i--) {
      if (labels[i].x - labels[i - 1].x < minSpacing) {
        labels.splice(i - 1, 1);
      }
    }
    return labels;
  }

  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getLevelByCount = (count: number): number => {
    const l1 = props.levelBy?.[0];
    const l2 = props.levelBy?.[1];
    const l3 = props.levelBy?.[2];
    const l4 = props.levelBy?.[3];
    if (count < 1) return 0;
    if (count > 0 && count <= l1) return 1;
    if (count > l1 && count <= l2) return 2;
    if (count > l2 && count <= l3) return 3;
    if (count > l3 && count <= l4) return 4;
    return 5;
  };

  const handleMouseEnter = (event: MouseEvent, cellData: HeatmapValue) => {
    const rectElement = event.currentTarget as SVGRectElement;
    if (!rectElement) return;

    const rectBounds = rectElement.getBoundingClientRect();

    tipX.value = rectBounds.left + rectBounds.width / 2;
    tipY.value = rectBounds.top;

    tipActiveData.value = cellData;
    tipVisible.value = true;
  };

  const handleMouseLeave = () => {
    tipVisible.value = false;
  };

  const updateDimensions = () => {
    if (!mapWrapperRef.value) return;
    const width = mapWrapperRef.value.clientWidth || 600;
    let height = props.height;
    if (typeof props.rate === 'number' && props.rate > 0) {
      height = props.height / props.rate;
    }
    svgWidth.value = width;
    svgHeight.value = height;
    viewBox.value = `0 0 ${width} ${height}`;
  };

  watch(
    [() => props.rate, () => props.height],
    () => {
      updateDimensions();
    },
    { immediate: false, deep: false }, // 无需深度监听
  );

  onMounted(async () => {
    if (mapWrapperRef.value) {
      await nextTick();
      updateDimensions();

      requestAnimationFrame(() => {
        updateDimensions();
      });

      observer = new ResizeObserver(() => updateDimensions());
      observer.observe(mapWrapperRef.value);
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('container')">
      <div :class="ns.e('map-wrapper')"
           ref="mapWrapperRef">
        <svg :viewBox="viewBox">
          <g :class="[ns.e('grid-group'), ns.is('loading', props.loading)]">
            <rect v-for="rect in gridConfig.rects"
                  :key="rect.id"
                  :x="rect.x"
                  :y="rect.y"
                  :width="rect.size"
                  :height="rect.size"
                  :data-level="getLevelByCount(rect.data?.count || 0)"
                  rx="2"
                  :class="ns.e('cell')"
                  @mouseenter="handleMouseEnter($event, rect.data)"
                  @mouseleave="handleMouseLeave" />
          </g>

          <line
            x1="0"
            :y1="lineYCoordinate"
            :x2="svgWidth"
            :y2="lineYCoordinate"
            stroke="var(--color-border)"
            stroke-width="1" />

          <g :class="ns.e('label-group')">
            <text v-for="label in gridConfig.labels"
                  :key="label.id"
                  :x="label.x"
                  :y="label.y"
                  text-anchor="middle"
                  :class="ns.e('label')">
              {{ label.text }}
            </text>
          </g>

          <g :class="ns.e('legend-group')">
            <text :class="ns.e('legend-label')"
                  :x="legendConfig.startX"
                  :y="legendConfig.startY + 10"
                  text-anchor="start">
              Less
            </text>

            <rect :class="[ns.e('cell'), ns.e('legend-cell')]"
                  v-for="level in [0, 1, 2, 3, 4, 5]"
                  :key="`legend-${level}`"
                  :x="legendConfig.startX + 32 + level * (legendConfig.boxSize + legendConfig.boxGap)"
                  :y="legendConfig.startY"
                  :width="legendConfig.boxSize"
                  :height="legendConfig.boxSize"
                  :data-level="level"
                  rx="1.5" />

            <text :class="ns.e('legend-label')"
                  :x="legendConfig.startX + 32 + 6 * (legendConfig.boxSize + legendConfig.boxGap) + 4"
                  :y="legendConfig.startY + 10"
                  text-anchor="start">
              More
            </text>
          </g>
        </svg>
        <transition name="fade">
          <div v-if="props.loading" :class="ns.e('loading-overlay')">
            <div :class="ns.e('spinner')" />
          </div>
        </transition>
      </div>
    </div>
    <Teleport to="body">
      <CaHeatmapTip v-if="tipVisible"
                    :x="tipX"
                    :y="tipY"
                    :data="tipActiveData">
        <template #default="{data}">
          <slot name="tip" :data="data"></slot>
        </template>
      </CaHeatmapTip>
    </Teleport>
  </div>
</template>

<style scoped>
  .ca-heatmap {
    border: 1px solid var(--color-border);
    padding: 10px;
    position: relative;
    min-height: 100px;
    background-color: transparent;
  }

  .ca-heatmap__container {
    width: 100%;
    position: relative;
  }

  .ca-heatmap svg {
    width: 100%;
    display: block;
  }

  .ca-heatmap svg.is-loading {
    filter: blur(2px);
    opacity: 0.6;
    pointer-events: none;
  }

  .ca-heatmap__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background-color: #000;
    opacity: 0.3;
  }

  .ca-heatmap__spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(100, 116, 139, 0.2);
    border-top-color: var(--color-accent, #3b82f6);
    border-radius: 50%;
    animation: ca-heatmap-spin 0.8s linear infinite;
  }

  @keyframes ca-heatmap-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .ca-heatmap__cell {
    fill: var(--color-bg-hover, #eef0f2);
    transition: fill 0.2s ease,
    filter 0.2s ease;
    cursor: pointer;
    stroke: color-mix(
      in srgb,
      var(--color-border) 75%,
      var(--color-text-primary)
    );
  }

  .ca-heatmap__cell:hover {
    filter: brightness(1.15);
  }

  .ca-heatmap__cell[data-level='0'] {
    fill: var(--color-bg-hover, #eef0f2);
  }

  .ca-heatmap__cell[data-level='1'] {
    fill: color-mix(in srgb, var(--color-accent) 15%, var(--color-bg, #ffffff));
  }

  .ca-heatmap__cell[data-level='2'] {
    fill: color-mix(in srgb, var(--color-accent) 35%, var(--color-bg, #ffffff));
  }

  .ca-heatmap__cell[data-level='3'] {
    fill: color-mix(in srgb, var(--color-accent) 55%, var(--color-bg, #ffffff));
  }

  .ca-heatmap__cell[data-level='4'] {
    fill: color-mix(in srgb, var(--color-accent) 75%, var(--color-bg, #ffffff));
  }

  .ca-heatmap__cell[data-level='5'] {
    fill: var(--color-accent); /* 第五阶段最高亮：100% 用户自定义主题色 */
  }

  .ca-heatmap__legend-cell {
    cursor: default;
  }

  .ca-heatmap__legend-cell {
    filter: none;
  }

  .ca-heatmap__legend-label {
    font-size: 11px;
    opacity: 0.8;
  }

  .ca-heatmap__label {
    font-size: 11px;
    fill: #64748b;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
</style>