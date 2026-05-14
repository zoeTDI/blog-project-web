<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue";
import ChinaCityGeoJSON from '@/assets/data/China.json'

const props = withDefaults(defineProps<{
  width?: number,
  height?: number
}>(), {
  width: 800,
  height: 600
})

const width = computed(() => props.width);
const height = computed(() => props.height);

// --- 优化点 1: 预处理数据 ---
// 存储处理后的路径数据，避免在模板中实时调用 generatePath
const processedFeatures = ref<any[]>([]);
const activeCity = ref('');
const tooltip = reactive({
  show: false,
  name: '',
  province: '',
  x: 0,
  y: 0,
})

const projection = (coords: any) => {
  const x = (coords[0] - 73) * (width.value / (135 - 73));
  const y = height.value - (coords[1] - 18) * (height.value / (54 - 18));
  return [x, y];
};

const getPathData = (feature: any) => {
  const { geometry } = feature;
  if (!geometry) return "";
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  return polygons.map((polygon: any) => {
    return polygon.map((ring: any, index: number) => {
      const points = ring.map((p: any) => projection(p));
      return (index === 0 ? "M" : "L") + points.map((p: any) => p.join(",")).join(" L") + "Z";
    }).join(" ");
  }).join(" ");
};

// 在组件挂载时一次性计算好所有路径
onMounted(() => {
  processedFeatures.value = ChinaCityGeoJSON.features.map(feature => ({
    id: feature.properties.adcode || Math.random(),
    pathData: getPathData(feature),
    properties: feature.properties
  }));
});

// --- 优化点 2: 提高交互响应速度 ---
const handleMouseEnter = (event: MouseEvent, props: any) => {
  activeCity.value = props.name;
  tooltip.show = true;
  tooltip.name = props.name;
  tooltip.province = props.province || '';
  // 使用 clientX/Y 配合 fixed 定位
  tooltip.x = event.clientX + 15;
  tooltip.y = event.clientY + 15;
};

const handleMouseLeave = () => {
  activeCity.value = '';
  tooltip.show = false;
};
</script>

<template>
  <div class="china-map">
    <svg
        v-if="processedFeatures.length"
        :viewBox="`0 0 ${width} ${height}`"
        xmlns="http://www.w3.org/2000/svg"
        class="china-map-svg"
        shape-rendering="geometricPrecision"
    >
      <path
          v-for="item in processedFeatures"
          :key="item.id"
          :d="item.pathData"
          :class="{ 'active-city': activeCity === item.properties.name }"
          @mouseenter="handleMouseEnter($event, item.properties)"
          @mouseleave="handleMouseLeave"
      />
    </svg>

    <div
        v-show="tooltip.show"
        class="map-tooltip"
        :style="{ transform: `translate(${tooltip.x}px, ${tooltip.y}px)` }"
    >
      <span class="city-name">{{ tooltip.name }}</span>
      <span v-if="tooltip.province" class="province-tag">{{ tooltip.province }}</span>
    </div>
  </div>
</template>

<style scoped>
.china-map {
  position: relative;
  width: 100%;
  max-width: var(--content-max-width-M);
  margin: 0 auto;
  /* 优化鼠标移动时的重绘区域 */
  contain: layout paint;
}

.china-map-svg {
  width: 100%;
  height: auto;
  /* 只有在非移动端或高性能设备开启滤镜，滤镜非常吃性能 */
  /* filter: drop-shadow(0 4px 12px var(--color-border)); */
}

path {
  fill: var(--color-bg);
  stroke: var(--color-border);
  stroke-width: 0.3;
  /* 优化渲染性能的关键 CSS */
  vector-effect: non-scaling-stroke; /* 缩放时保持线宽 */
  pointer-events: all;
  transition: fill 0.15s ease; /* 缩短动画时间，减少重绘帧数 */
}

path:hover {
  fill: var(--color-bg-hover-accent);
  stroke: var(--color-accent);
  stroke-width: 1px;
  /* 移除 hover 时的 drop-shadow 滤镜，改用 fill 变化 */
}

.active-city {
  fill: var(--color-bg-hover-accent);
}

.map-tooltip {
  position: fixed;
  left: 0;
  top: 0;
  background: var(--color-container-bg);
  color: var(--color-text-h);
  border: 1px solid var(--color-border);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px);
  /* 使用 transform 性能优于 left/top */
  will-change: transform;
}

.city-name { font-weight: 600; }
.province-tag { font-size: 11px; color: var(--color-text-primary); opacity: 0.8; }
</style>