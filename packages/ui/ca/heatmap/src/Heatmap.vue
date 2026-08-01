<script setup lang="ts">
  import type {
    CaHeatmapEmits,
    CaHeatmapProps,
    GridConfigResult,
    HeatmapData,
    HeatmapRect,
    HeatmapValue,
    LabelItem,
    LayoutMetrics, WeekdayFormat,
  } from './types.ts';
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';
  import CaHeatmapTip from './HeatmapTip.vue';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
  import { CaIcon } from '../../../icon';

  defineOptions({
    name: 'CaHeatmap',
  });

  const props = withDefaults(defineProps<CaHeatmapProps>(), {
    year: undefined,
    data: () => ({}),
    rate: null,
    height: 240,
    bottomHeight: 25,
    firstDayOfWeek: 1,
    levelBy: () => [3, 5, 10, 15],
    loading: false,
    weekdayFormat: 'short',
    customWeekdayLabels: () => ({}),
  });

  const emits = defineEmits<CaHeatmapEmits>();

  const ns = useCSSNamespace('heatmap');

  const mapWrapperRef = ref<HTMLElement | null>(null);
  const viewBox = ref<string>(`0 0 600 240`);

  const svgWidth = ref(600);
  const svgHeight = ref(240);

  let observer: ResizeObserver | null = null;

  const tipVisible = ref(false);
  const tipX = ref(0);
  const tipY = ref(0);
  const tipActiveData = ref<HeatmapValue | undefined>(undefined);
  const displayYear = ref(props.year ?? new Date().getFullYear());

  // 表头宽度（固定值，可根据字体大小调整，此处设为 30 像素）
  const HEADER_WIDTH = 30;
  // 为右下角年份控件预留的宽度（避免与图例重叠）
  const YEAR_CONTROL_WIDTH = 72;

  const lineYCoordinate = computed(() => {
    return svgHeight.value * (1 - props.bottomHeight / 100);
  });

  // 生成星期标签（顺序依据 firstDayOfWeek）
  const weekdayLabels = computed(() => {
    const firstDay = props.firstDayOfWeek; // 0=周日, 1=周一
    const customMap = props.customWeekdayLabels || {};
    const format = props.weekdayFormat || 'short';

    // 如果提供了自定义映射，优先使用
    if (Object.keys(customMap).length > 0) {
      // 构建从 firstDay 开始的 7 个标签
      const labels: string[] = [];
      for (let i = 0; i < 7; i++) {
        const dayIndex = (firstDay + i) % 7; // 0=周日
        const key = dayIndex === 0 ? 7 : dayIndex; // 转为 1~7 (1=周一)
        labels.push(customMap[key] || '');
      }
      return labels;
    }

    // 否则根据 format 生成
    const localeMap: Record<WeekdayFormat, { locale: string; options?: any }> = {
      full: { locale: 'en-US', options: { weekday: 'long' } },
      short: { locale: 'en-US', options: { weekday: 'short' } },
      numeric: { locale: 'en-US', options: { weekday: 'numeric' } }, // 但 numeric 会返回数字，但我们希望 1-7
      chinese: { locale: 'zh-CN', options: { weekday: 'short' } }, // 中文简写 "周一"
    };

    const base = new Date(2026, 0, 1); // 任意日期，用于获取星期名称
    // 构建从 firstDay 开始的 7 个日期（每个相隔一天）
    const labels: string[] = [];
    const baseDay = base.getDay(); // 0=周日
    for (let i = 0; i < 7; i++) {
      const targetDay = (firstDay + i) % 7;
      // 计算偏移量，使目标日期恰好为 targetDay
      const offset = (targetDay - baseDay + 7) % 7;
      const date = new Date(base);
      date.setDate(date.getDate() + offset);
      if (format === 'numeric') {
        // 返回数字 1~7 (1=周一)
        const num = targetDay === 0 ? 7 : targetDay;
        labels.push(String(num));
      } else {
        const formatter = new Intl.DateTimeFormat(localeMap[format]?.locale || 'en-US', {
          weekday: localeMap[format]?.options?.weekday || 'short',
        });
        labels.push(formatter.format(date));
      }
    }
    return labels;
  });

  const gridConfig = computed(() => computeGridConfig(
    svgWidth.value,
    lineYCoordinate.value,
    props.data,
    props.firstDayOfWeek,
    HEADER_WIDTH,
    displayYear.value,
  ));

  const legendConfig = computed(() => {
    const boxSize = 11;
    const boxGap = 4;
    const totalBoxes = 6;

    const legendWidth = 30 + (boxSize + boxGap) * totalBoxes + 35;

    const startX = svgWidth.value - legendWidth - YEAR_CONTROL_WIDTH + HEADER_WIDTH;
    const startY = lineYCoordinate.value + 18;

    return {
      startX,
      startY,
      boxSize,
      boxGap,
    };
  });

  const goPrevYear = () => {
    const newYear = displayYear.value - 1;
    displayYear.value = newYear;
    emits('update:year', newYear);
  };

  const goNextYear = () => {
    const newYear = displayYear.value + 1;
    displayYear.value = newYear;
    emits('update:year', newYear);
  };

  const calculateLayoutMetrics = (
    svgWidth: number,
    lineY: number,
    rows: number = 7,
    gapRatio: number = 0.15,
  ): LayoutMetrics => {
    const size = lineY / (rows + rows * gapRatio);
    const gap = size * gapRatio;
    const cols = Math.floor((svgWidth + gap) / (size + gap));
    return { size, gap, cols: Math.max(cols, 0) };
  };

  const buildRectsForColumn = (
    colFirstDay: Date,
    colIndex: number,
    size: number,
    gap: number,
    data: HeatmapData,
    targetYear: number,
    now: Date,
    headerWidth: number,
  ): HeatmapRect[] => {
    const rects: HeatmapRect[] = [];
    for (let r = 0; r < 7; r++) {
      const currentDate = new Date(colFirstDay.getTime() + r * 24 * 60 * 60 * 1000);
      // 仅显示目标年份且不晚于今天
      if (currentDate.getFullYear() !== targetYear) continue;
      if (currentDate > now) continue;

      const dateStr = formatDateString(currentDate);
      const cellData = data[dateStr];

      rects.push({
        id: `${colIndex}-${r}`,
        x: colIndex * (size + gap) + headerWidth,
        y: r * (size + gap),
        size: size,
        data: cellData,
      });
    }
    return rects;
  };

  const computeGridConfig = (
    svgWidth: number,
    lineY: number,
    data: HeatmapData,
    firstDayOfWeek: number = 1,
    headerWidth: number = 0,
    targetYear: number,
  ): GridConfigResult => {
    const now = new Date();

    const { size, gap, cols } = calculateLayoutMetrics(svgWidth, lineY);
    if (cols < 1) {
      return {
        rects: [],
        labels: [],
        size: 0,
        gap: 0,
        earliestDate: new Date(),
      };
    }

    // 第一列以目标年份的 1 月 1 日所在周起始
    const yearStart = new Date(targetYear, 0, 1);
    const firstColFirstDay = getWeekStart(yearStart, firstDayOfWeek);

    const allRects: HeatmapRect[] = [];
    const monthMap = new Map<string, { colIndex: number; monthText: string }>();

    for (let c = 0; c < cols; c++) {
      const colFirstDay = new Date(firstColFirstDay.getTime() + c * 7 * 24 * 60 * 60 * 1000);
      const rects = buildRectsForColumn(
        colFirstDay,
        c,
        size,
        gap,
        data,
        targetYear,
        now,
        headerWidth,
      );

      if (rects.length > 0) {
        allRects.push(...rects);
        const monthKey = `${colFirstDay.getFullYear()}-${colFirstDay.getMonth() + 1}`;
        if (!monthMap.has(monthKey)) {
          const monthText = `${colFirstDay.getMonth() + 1}月`;
          monthMap.set(monthKey, { colIndex: c, monthText });
        }
      }
    }

    const allLabels: LabelItem[] = [];
    for (const [monthKey, { colIndex, monthText }] of monthMap) {
      const x = colIndex * (size + gap) + size / 2 + headerWidth;
      allLabels.push({
        id: `label-${monthKey}`,
        text: monthText,
        x,
        y: lineY + 14,
      });
    }

    const earliestDate = new Date(firstColFirstDay.getTime());

    return {
      rects: allRects,
      labels: allLabels,
      size,
      gap,
      earliestDate,
    };
  };

  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getWeekStart = (date: Date, firstDayOfWeek: number): Date => {
    const day = date.getDay();
    const diff = (day - firstDayOfWeek + 7) % 7;
    const result = new Date(date);
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
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

  const handleMouseEnter = (event: MouseEvent, cellData: HeatmapValue | undefined) => {
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
    // viewBox 宽度需要增加表头宽度，确保内容完整
    viewBox.value = `0 0 ${width + HEADER_WIDTH} ${height}`;
  };

  watch(
    () => props.year,
    (newYear) => {
      if (newYear !== undefined && newYear !== displayYear.value) {
        displayYear.value = newYear;
      }
    },
  );

  watch(
    [() => props.rate, () => props.height, () => props.bottomHeight],
    () => {
      updateDimensions();
    },
    { immediate: false, deep: false },
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
      <div :class="ns.e('map-wrapper')" ref="mapWrapperRef">
        <div :class="ns.e('year-control')">
          <button :class="ns.e('year-btn')" @click="goPrevYear" type="button">
            <CaIcon :icon="ChevronLeftIcon" :size="16" />
          </button>
          <span :class="ns.e('year-display')">{{ displayYear }}</span>
          <button :class="ns.e('year-btn')" @click="goNextYear" type="button">
            <CaIcon :icon="ChevronRightIcon" :size="16" />
          </button>
        </div>
        <svg :viewBox="viewBox">
          <!-- 星期表头 -->
          <g :class="ns.e('weekday-group')">
            <text v-for="(label, rowIndex) in weekdayLabels"
                  :key="rowIndex"
                  :x="HEADER_WIDTH / 2"
                  :y="rowIndex * (gridConfig.size + gridConfig.gap) + gridConfig.size / 2"
                  text-anchor="middle"
                  dominant-baseline="central"
                  :class="ns.e('weekday-label')">
              {{ label }}
            </text>
          </g>

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
            :x1="HEADER_WIDTH"
            :y1="lineYCoordinate"
            :x2="svgWidth + HEADER_WIDTH"
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

  .ca-heatmap__year-control {
    position: absolute;
    bottom: 3px;
    right: -6px;
    display: flex;
    align-items: center;
    padding: 2px 6px;
    z-index: 5;
    font-size: 12px;
    color: var(--color-text-primary, #1e293b);
  }

  .ca-heatmap__year-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 3px;
    color: var(--color-text-secondary, #64748b);
    transition: all 0.2s;
    padding: 0;
  }

  .ca-heatmap__year-btn:hover {
    color: var(--color-accent);
  }

  .ca-heatmap__year-display {
    min-width: 32px;
    text-align: center;
    font-weight: 500;
    font-size: 12px;
    user-select: none;
    padding: 0 2px;
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
    transition: fill 0.2s ease, filter 0.2s ease;
    cursor: pointer;
    stroke: color-mix(in srgb, var(--color-border) 75%, var(--color-text-primary));
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
    fill: var(--color-accent);
  }

  .ca-heatmap__legend-cell {
    cursor: default;
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

  /* 新增星期表头样式 */
  .ca-heatmap__weekday-label {
    font-size: 10px;
    fill: #94a3b8;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    text-anchor: middle;
    dominant-baseline: central;
  }
</style>