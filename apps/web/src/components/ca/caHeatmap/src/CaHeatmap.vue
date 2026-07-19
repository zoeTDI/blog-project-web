<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { mockApiFetch } from '@/utils/mock.ts';
  import {
    CaHeatmapTip,
    type HeatmapData,
    type HeatmapValue,
  } from '@/components/ca/caHeatmap';

  interface Props {
    data?: HeatmapData | null; // 允许外部不传或传空，若为空则启用组件内挂载时的模拟数据
    rate?: number | null;
    height?: number;
    bottomHeight?: number;
    firstDayOfWeek?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: null,
    rate: null,
    height: 240, // 略微增加了默认高度，给底部的图例留出更充裕的纵向空间
    bottomHeight: 18, // 略微增加底部占比，用于容纳日期和说明
    firstDayOfWeek: 1,
  });

  const mapWrapperRef = ref<HTMLElement | null>(null);
  const viewBox = ref<string>(`0 0 600 240`);

  const svgWidth = ref(600);
  const svgHeight = ref(240);

  // 组件内部自治的异步模拟数据源与加载状态
  const internalData = ref<HeatmapData>({});
  const internalLoading = ref(false);

  let observer: ResizeObserver | null = null;

  // --- Tip 状态相关变量 ---
  const tipVisible = ref(false);
  const tipX = ref(0);
  const tipY = ref(0);
  const tipActiveData = ref<HeatmapValue | null>(null);

  // 分隔线的绝对 Y 坐标
  const lineYCoordinate = computed(() => {
    return svgHeight.value * (1 - props.bottomHeight / 100);
  });

  // 获取今天在当前自定义星期排列下的索引位置 (0 到 6)
  const todayGridIndex = computed(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return (dayOfWeek - props.firstDayOfWeek + 7) % 7;
  });

  // 辅助函数：将 Date 对象格式化为 "YYYY-MM-DD"
  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  /**
   * 核心修改：根据新的默认规则映射 level
   */
  const getLevelByCount = (count: number): number => {
    if (count <= 1) return 0;
    if (count > 1 && count <= 3) return 1;
    if (count > 3 && count <= 5) return 2;
    if (count > 5 && count <= 10) return 3;
    if (count > 10 && count <= 15) return 4;
    return 5; // 大于 15 阶段
  };

  // 内部方法：根据渲染所需的起止时间跨度，精确生成模拟数据
  const generateInternalMockData = (earliestDate: Date): HeatmapData => {
    const mockData: HeatmapData = {};
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const diffTime = todayStart.getTime() - earliestDate.getTime();
    const totalDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000)) + 1;

    for (let i = 0; i < totalDays; i++) {
      const currentLoopDate = new Date(
        earliestDate.getTime() + i * 24 * 60 * 60 * 1000
      );
      const dateStr = formatDateString(currentLoopDate);

      // 模拟生成 0 ~ 25 之间的记录数据
      const count = Math.floor(Math.random() * 26);
      const level = getLevelByCount(count);

      mockData[dateStr] = {
        date: dateStr,
        count,
        level,
      };
    }
    return mockData;
  };

  // 动态计算方格的尺寸、布局、数据及底部的日期标签
  const gridConfig = computed(() => {
    const gapRatio = 0.15;
    const rows = 7;

    const size = lineYCoordinate.value / (rows + rows * gapRatio);
    const gap = size * gapRatio;

    const cols = Math.floor((svgWidth.value + gap) / (size + gap));

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const lastColFirstDayTime =
      todayStart - todayGridIndex.value * 24 * 60 * 60 * 1000;

    const rects = [];
    const labels = [];
    let lastDisplayedMonthKey = '';

    const activeData = props.data || internalData.value;

    for (let c = 0; c < cols; c++) {
      const weeksAgo = cols - 1 - c;
      const colFirstDay = new Date(
        lastColFirstDayTime - weeksAgo * 7 * 24 * 60 * 60 * 1000
      );
      const colLastDay = new Date(
        colFirstDay.getTime() + 6 * 24 * 60 * 60 * 1000
      );

      // 构造这一列的网格方格
      for (let r = 0; r < rows; r++) {
        const isLastColumn = c === cols - 1;
        if (isLastColumn && r > todayGridIndex.value) {
          continue;
        }

        const currentRectDate = new Date(
          colFirstDay.getTime() + r * 24 * 60 * 60 * 1000
        );
        const dateStr = formatDateString(currentRectDate);

        const cellData: HeatmapValue = activeData[dateStr] || {
          date: dateStr,
          count: 0,
          level: 0,
        };

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

    return {
      rects,
      labels,
      size,
      gap,
      earliestDate: new Date(
        lastColFirstDayTime - (cols - 1) * 7 * 24 * 60 * 60 * 1000
      ),
    };
  });

  // 计算说明图例（Legend）方块的相关配置坐标
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

  let isMockInitialized = false;

  const initInternalMockData = async () => {
    if (props.data || isMockInitialized) return;
    isMockInitialized = true;

    try {
      internalLoading.value = true;
      const generatedData = generateInternalMockData(
        gridConfig.value.earliestDate
      );
      const result = await mockApiFetch(generatedData, 800);
      internalData.value = result;
    } catch (error) {
      console.error('内部热力图数据加载失败:', error);
    } finally {
      internalLoading.value = false;
    }
  };

  // --- 处理鼠标滑过事件以精确定位 Tip ---
  const handleMouseEnter = (event: MouseEvent, cellData: HeatmapValue) => {
    const rectElement = event.currentTarget as SVRECTElement;
    if (!rectElement || !mapWrapperRef.value) return;

    const rectBounds = rectElement.getBoundingClientRect();
    const containerBounds = mapWrapperRef.value.getBoundingClientRect();

    tipX.value = rectBounds.left - containerBounds.left + rectBounds.width / 2;
    tipY.value = rectBounds.top - containerBounds.top;

    tipActiveData.value = cellData;
    tipVisible.value = true;
  };

  const handleMouseLeave = () => {
    tipVisible.value = false;
  };

  onMounted(async () => {
    if (mapWrapperRef.value) {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          let height = props.height;
          if (typeof props.rate === 'number') {
            height /= props.rate;
          }
          svgWidth.value = width;
          svgHeight.value = height;
          viewBox.value = `0 0 ${width} ${height}`;
          initInternalMockData();
        }
      });
      observer.observe(mapWrapperRef.value);
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
</script>

<template>
  <div class="ca-heatmap">
    <div class="container">
      <div
        class="map-wrapper"
        ref="mapWrapperRef">
        <div
          v-if="internalLoading && !props.data"
          class="internal-loading-tips">
          热力图数据同步中...
        </div>

        <svg
          v-else
          :viewBox="viewBox">
          <g class="grid-group">
            <rect
              v-for="rect in gridConfig.rects"
              :key="rect.id"
              :x="rect.x"
              :y="rect.y"
              :width="rect.size"
              :height="rect.size"
              :data-level="rect.data.level"
              rx="2"
              class="heatmap-cell"
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

          <g class="label-group">
            <text
              v-for="label in gridConfig.labels"
              :key="label.id"
              :x="label.x"
              :y="label.y"
              text-anchor="middle"
              class="heatmap-label">
              {{ label.text }}
            </text>
          </g>

          <g class="legend-group">
            <text
              :x="legendConfig.startX"
              :y="legendConfig.startY + 10"
              class="heatmap-label legend-text"
              text-anchor="start">
              Less
            </text>

            <rect
              v-for="level in [0, 1, 2, 3, 4, 5]"
              :key="'legend-' + level"
              :x="
                legendConfig.startX +
                32 +
                level * (legendConfig.boxSize + legendConfig.boxGap)
              "
              :y="legendConfig.startY"
              :width="legendConfig.boxSize"
              :height="legendConfig.boxSize"
              :data-level="level"
              rx="1.5"
              class="heatmap-cell legend-cell" />

            <text
              :x="
                legendConfig.startX +
                32 +
                6 * (legendConfig.boxSize + legendConfig.boxGap) +
                4
              "
              :y="legendConfig.startY + 10"
              class="heatmap-label legend-text"
              text-anchor="start">
              More
            </text>
          </g>
        </svg>

        <ca-heatmap-tip
          :visible="tipVisible"
          :x="tipX"
          :y="tipY"
          :data="tipActiveData" />
      </div>
    </div>
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
  .map-wrapper {
    width: 100%;
    position: relative;
  }
  svg {
    width: 100%;
    display: block;
  }
  .internal-loading-tips {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    color: #64748b;
    font-size: 13px;
  }

  /* 基本方格样式 */
  .heatmap-cell {
    fill: var(--color-bg-hover, #eef0f2);
    transition:
      fill 0.2s ease,
      filter 0.2s ease;
    cursor: pointer;
    stroke: color-mix(
      in srgb,
      var(--color-border) 75%,
      var(--color-text-primary)
    );
  }

  .heatmap-cell:hover {
    filter: brightness(1.15);
  }

  /* 核心修改：5个等级色彩梯度设计，完美支持 color-mix 的跨主题自适应 */
  .heatmap-cell[data-level='1'] {
    fill: color-mix(in srgb, var(--color-accent) 15%, var(--color-bg, #ffffff));
  }
  .heatmap-cell[data-level='2'] {
    fill: color-mix(in srgb, var(--color-accent) 35%, var(--color-bg, #ffffff));
  }
  .heatmap-cell[data-level='3'] {
    fill: color-mix(in srgb, var(--color-accent) 55%, var(--color-bg, #ffffff));
  }
  .heatmap-cell[data-level='4'] {
    fill: color-mix(in srgb, var(--color-accent) 75%, var(--color-bg, #ffffff));
  }
  .heatmap-cell[data-level='5'] {
    fill: var(--color-accent); /* 第五阶段最高亮：100% 用户自定义主题色 */
  }

  /* 图例专属样式：去除手型指针，不响应 hover 变色效果 */
  .legend-cell {
    cursor: default;
  }
  .legend-cell:hover {
    filter: none;
  }
  .legend-text {
    font-size: 11px;
    opacity: 0.8;
  }

  .heatmap-label {
    font-size: 11px;
    fill: #64748b;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
</style>
