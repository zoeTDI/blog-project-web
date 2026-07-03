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
    data: null, // 默认改为 null 方便判断是否启用内部模拟
    rate: null,
    height: 220,
    bottomHeight: 15,
    firstDayOfWeek: 1,
  });

  const mapWrapperRef = ref<HTMLElement | null>(null);
  const viewBox = ref<string>(`0 0 600 220`);

  const svgWidth = ref(600);
  const svgHeight = ref(220);

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
   * 内部方法：根据渲染所需的起止时间跨度，精确生成模拟数据
   */
  const generateInternalMockData = (earliestDate: Date): HeatmapData => {
    const mockData: HeatmapData = {};
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // 计算从最早那周的第一天到今天一共包含多少天
    const diffTime = todayStart.getTime() - earliestDate.getTime();
    const totalDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000)) + 1;

    for (let i = 0; i < totalDays; i++) {
      const currentLoopDate = new Date(
        earliestDate.getTime() + i * 24 * 60 * 60 * 1000
      );
      const dateStr = formatDateString(currentLoopDate);

      const count = Math.floor(Math.random() * 31);
      let level = 0;
      if (count > 0 && count <= 5) level = 1;
      else if (count > 5 && count <= 12) level = 2;
      else if (count > 12 && count <= 22) level = 3;
      else if (count > 22) level = 4;

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

    // 如果外部没有传入数据，则合并或采用内部生成的模拟数据状态
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

        // 匹配外部数据源或组件自治的模拟数据源
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
          y: lineYCoordinate.value + 20,
        });
      }
    }

    return {
      rects,
      labels,
      size,
      gap,
      // 将最左侧一列（即最早的一周）的第一天日期暴露出来，供初始化模拟数据使用
      earliestDate: new Date(
        lastColFirstDayTime - (cols - 1) * 7 * 24 * 60 * 60 * 1000
      ),
    };
  });

  // 标记是否已经初始化过内部模拟数据，防止 resize 时重复拉取请求
  let isMockInitialized = false;

  const initInternalMockData = async () => {
    if (props.data || isMockInitialized) return;
    isMockInitialized = true;

    try {
      internalLoading.value = true;
      // 精确根据视图所能容纳的最早方格日期，生成填满屏幕所需的模拟数据集
      const generatedData = generateInternalMockData(
        gridConfig.value.earliestDate
      );

      // 模拟接口延迟返回
      const result = await mockApiFetch(generatedData, 800);
      internalData.value = result;
    } catch (error) {
      console.error('内部热力图数据加载失败:', error);
    } finally {
      internalLoading.value = false;
    }
  };

  const handleMouseEnter = (event: MouseEvent, cellData: HeatmapValue) => {
    const rectElement = event.currentTarget as SVRECTElement;
    if (!rectElement || !mapWrapperRef.value) return;

    // 获取方格和最外层包裹容器的视口相对位置
    const rectBounds = rectElement.getBoundingClientRect();
    const containerBounds = mapWrapperRef.value.getBoundingClientRect();

    // 像素差值计算：方格顶端中心点相对于包裹容器左上角的像素坐标
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

          // 当元素尺寸首次确定、并计算出满屏所需要的 earliestDate 后，触发异步数据的加载
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
              @mouseleave="handleMouseLeave">
              <title>{{ rect.data.date }} : {{ rect.data.count }} 次操作</title>
            </rect>
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
    fill: #eef0f2;
    transition: fill 0.2s ease;
  }
  .heatmap-cell:hover {
    filter: brightness(0.85);
  }

  .heatmap-cell[data-level='1'] {
    fill: #acd5f2;
  }
  .heatmap-cell[data-level='2'] {
    fill: #7fa8d9;
  }
  .heatmap-cell[data-level='3'] {
    fill: #4f7bc1;
  }
  .heatmap-cell[data-level='4'] {
    fill: #1f4ea8;
  }

  .heatmap-label {
    font-size: 11px;
    fill: #64748b;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
</style>
