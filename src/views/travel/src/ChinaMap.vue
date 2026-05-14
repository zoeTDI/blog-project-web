<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from "vue";
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

const processedFeatures = ref<any[]>([]);
const activeCity = ref('');
const tooltip = reactive({ show: false, name: '', province: '', x: 0, y: 0 });

// 地图容器引用，用于精确获取鼠标相对容器的坐标
const mapContainerRef = ref<HTMLElement | null>(null);

const mapTransform = reactive({
  scale: 1,
  x: 0,
  y: 0,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0
});

const innerTransform = computed(() => {
  return `translate(${mapTransform.x}, ${mapTransform.y}) scale(${mapTransform.scale})`;
});

// --- 核心优化：以鼠标为中心缩放 ---
const handleWheel = (event: WheelEvent) => {
  event.preventDefault();
  if (!mapContainerRef.value) return;

  const zoomSpeed = 0.1;
  const delta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  const oldScale = mapTransform.scale;
  const newScale = Math.min(Math.max(oldScale + delta, 0.5), 15);

  if (oldScale === newScale) return;

  // 1. 获取鼠标相对于地图容器的坐标 (px)
  const rect = mapContainerRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // 2. 计算鼠标在当前“缩放平移坐标系”下的位置
  // 公式：(鼠标坐标 - 当前平移) / 当前缩放
  const svgMouseX = (mouseX - mapTransform.x) / oldScale;
  const svgMouseY = (mouseY - mapTransform.y) / oldScale;

  // 3. 更新缩放倍数
  mapTransform.scale = newScale;

  // 4. 计算新的平移量，使得刚才记录的 svgMouseX/Y 在新坐标系下位置不变
  // 公式：鼠标坐标 - (内部坐标 * 新缩放)
  mapTransform.x = mouseX - svgMouseX * newScale;
  mapTransform.y = mouseY - svgMouseY * newScale;
};

// --- 平移逻辑 (保持 Client 坐标系计算) ---
const startDrag = (event: MouseEvent) => {
  if (event.button !== 0) return;
  mapTransform.isDragging = true;
  mapTransform.lastMouseX = event.clientX;
  mapTransform.lastMouseY = event.clientY;
  document.body.style.cursor = 'grabbing';
};

const onDrag = (event: MouseEvent) => {
  if (!mapTransform.isDragging) return;
  const dx = event.clientX - mapTransform.lastMouseX;
  const dy = event.clientY - mapTransform.lastMouseY;

  mapTransform.x += dx;
  mapTransform.y += dy;

  mapTransform.lastMouseX = event.clientX;
  mapTransform.lastMouseY = event.clientY;
};

const stopDrag = () => {
  mapTransform.isDragging = false;
  document.body.style.cursor = 'default';
};

// 投影转换
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

onMounted(() => {
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  processedFeatures.value = ChinaCityGeoJSON.features.map(feature => ({
    id: feature.properties.adcode || Math.random(),
    pathData: getPathData(feature),
    properties: feature.properties
  }));
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
});

const handleMouseEnter = (event: MouseEvent, props: any) => {
  activeCity.value = props.name;
  tooltip.show = true;
  tooltip.name = props.name;
  tooltip.province = props.province || '';
  tooltip.x = event.clientX;
  tooltip.y = event.clientY;
};

const handleMouseLeave = () => {
  activeCity.value = '';
  tooltip.show = false;
};
</script>

<template>
  <div
      class="china-map"
      ref="mapContainerRef"
      @wheel="handleWheel"
      @mousedown="startDrag"
  >
    <svg
        v-if="processedFeatures.length"
        :viewBox="`0 0 ${width} ${height}`"
        xmlns="http://www.w3.org/2000/svg"
        class="china-map-svg"
    >
      <g :transform="innerTransform">
        <path
            v-for="item in processedFeatures"
            :key="item.id"
            :d="item.pathData"
            :class="{ 'active-city': activeCity === item.properties.name }"
            @mouseenter="handleMouseEnter($event, item.properties)"
            @mouseleave="handleMouseLeave"
        />
      </g>
    </svg>

    <Teleport to="body">
      <div
          v-show="tooltip.show"
          class="map-tooltip"
          :style="{ transform: `translate(${tooltip.x + 15}px, ${tooltip.y + 15}px)` }"
      >
        <span class="city-name">{{ tooltip.name }}</span>
        <span v-if="tooltip.province" class="province-tag">{{ tooltip.province }}</span>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* 样式保持不变，确保容器 overflow: hidden 以切除超出部分 */
.china-map {
  position: relative;
  width: 100%;
  max-width: var(--content-max-width-M);
  margin: 0 auto;
  overflow: hidden;
  cursor: grab;
  touch-action: none;
}
.china-map:active { cursor: grabbing; }
.china-map-svg { width: 100%; height: auto; display: block; }

path {
  fill: var(--color-bg);
  stroke: var(--color-border);
  stroke-width: 0.3px;
  vector-effect: non-scaling-stroke;
  transition: fill 0.1s ease;
}
path:hover { fill: var(--color-bg-hover-accent); stroke: var(--color-accent); stroke-width: 0.8; }
.active-city { fill: var(--color-bg-hover-accent); }

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
}
</style>