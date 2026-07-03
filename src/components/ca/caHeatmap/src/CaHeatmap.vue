<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue';

  interface Props {
    rate?: number | null;
    height?: number;
    bottomHeight?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    rate: null,
    height: 220,
    bottomHeight: 10,
  });

  const mapWrapperRef = ref<HTMLElement | null>(null);
  const viewBox = ref<string>(`0 0 600 220`);

  const svgWidth = ref(600);
  const svgHeight = ref(220);

  let observer: ResizeObserver | null = null;

  const lineYCoordinate = computed(() => {
    return svgHeight.value * (1 - props.bottomHeight / 100);
  });

  const gridConfig = computed(() => {
    const gapRatio = 0.15;
    const rows = 7; // 固定 7 行

    const size = lineYCoordinate.value / (rows + rows * gapRatio);
    const gap = size * gapRatio;

    const cols = Math.floor((svgWidth.value + gap) / (size + gap));

    const rects = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
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
