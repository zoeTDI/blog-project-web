<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue';

  interface Props {
    rate?: number | null;
    height?: number;
    bottomHeight?: number;
    // 新增字段：设置星期的第一天（0: 周日, 1: 周一, 2: 周二, ..., 6: 周六）
    firstDayOfWeek?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    rate: null,
    height: 220,
    bottomHeight: 10,
    firstDayOfWeek: 1, // 默认星期一为第一天
  });

  const mapWrapperRef = ref<HTMLElement | null>(null);
  const viewBox = ref<string>(`0 0 600 220`);

  const svgWidth = ref(600);
  const svgHeight = ref(220);

  let observer: ResizeObserver | null = null;

  // 分隔线的绝对 Y 坐标
  const lineYCoordinate = computed(() => {
    return svgHeight.value * (1 - props.bottomHeight / 100);
  });

  // 获取今天在当前自定义星期排列下的索引位置 (0 到 6)
  const todayGridIndex = computed(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (周日) 到 6 (周六)

    // 计算今天对应当前周设置的第几天
    // 例如：如果 firstDayOfWeek 是 1 (周一)，今天周一(1)，则结果为 0
    // 如果今天周日(0)，则结果为 (0 - 1 + 7) % 7 = 6
    return (dayOfWeek - props.firstDayOfWeek + 7) % 7;
  });

  // 动态计算方格的尺寸和布局
  const gridConfig = computed(() => {
    const gapRatio = 0.15;
    const rows = 7; // 固定 7 行

    const size = lineYCoordinate.value / (rows + rows * gapRatio);
    const gap = size * gapRatio;

    // 计算总列数
    const cols = Math.floor((svgWidth.value + gap) / (size + gap));

    const rects = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // 判断是否为最后一列（即本周）
        const isLastColumn = c === cols - 1;

        // 如果是最后一列，并且当前行的索引大于今天的索引，说明是本周的未来日期，直接跳过不绘制
        if (isLastColumn && r > todayGridIndex.value) {
          continue;
        }

        rects.push({
          id: `${c}-${r}`,
          x: c * (size + gap),
          y: r * (size + gap),
          size: size,
        });
      }
    }

    return {
      rects,
      size,
      gap,
    };
  });

  onMounted(() => {
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
        <svg :viewBox="viewBox">
          <g class="grid-group">
            <rect
              v-for="rect in gridConfig.rects"
              :key="rect.id"
              :x="rect.x"
              :y="rect.y"
              :width="rect.size"
              :height="rect.size"
              rx="2"
              class="heatmap-cell" />
          </g>

          <line
            x1="0"
            :y1="lineYCoordinate"
            :x2="svgWidth"
            :y2="lineYCoordinate"
            stroke="var(--color-border)"
            stroke-width="1" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ca-heatmap {
    border: 1px solid var(--color-border);
    padding: 10px;
  }
  svg {
    width: 100%;
    display: block;
  }
  .heatmap-cell {
    fill: #eef0f2;
    transition: fill 0.2s ease;
  }
  .heatmap-cell:hover {
    fill: #cbd5e1;
  }
</style>
