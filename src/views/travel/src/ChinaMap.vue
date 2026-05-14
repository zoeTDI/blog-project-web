<script setup lang="ts">
import { computed, reactive, ref, onMounted, onUnmounted } from "vue";
import ChinaCityGeoJSON from '@/assets/data/China.json'
import type {TravelDataResponse} from "@/views/travel/src/types.ts";

const props = withDefaults(defineProps<{
  data: TravelDataResponse,
  width?: number,
  height?: number
}>(), {
  width: 800,
  height: 600
})
const data = computed(() => props.data || {});
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

// --- 业务逻辑 1: 建立 adcode 到数据的映射表 ---
const footprintMap = computed(() => {
  const map: Record<number, any> = {};
  props.data.footprints.forEach(fp => {
    map[fp.adcode] = fp;
  });
  return map;
});

// --- 业务逻辑 2: 颜色阶梯函数 ---
const getFillColor = (adcode: number) => {
  const info = footprintMap.value[adcode];
  if (!info || !info.visited) return 'var(--color-bg)';

  const count = info.articleCount;
  // 根据文章数量返回不同透明度的强调色
  if (count >= 10) return 'var(--color-accent)'; // 核心地带
  if (count >= 5)  return 'var(--color-bg-hover-accent)'; // 常去
  return 'rgba(170, 59, 255, 0.2)'; // 初访
};

// --- 业务逻辑 3: 计算连线路径 ---
const routesPaths = computed(() => {
  return props.data.routes.map(route => {
    // 找到起点和终点的 Feature
    const fromFeature = ChinaCityGeoJSON.features.find(f => f.properties.adcode === route.fromAdcode);
    const toFeature = ChinaCityGeoJSON.features.find(f => f.properties.adcode === route.toAdcode);

    if (!fromFeature || !toFeature) return null;

    // 获取中心点 (使用 GeoJSON 中的 centroid 或计算中心)
    const start = projection(fromFeature.properties.centroid || fromFeature.properties.center);
    const end = projection(toFeature.properties.centroid || toFeature.properties.center);

    // 计算二次贝塞尔曲线控制点：取中点并向上（y轴减小）偏移
    const cx = (start[0] + end[0]) / 2;
    const cy = (start[1] + end[1]) / 2 - 30; // 30 是弧度高度

    return {
      id: route.id,
      d: `M ${start[0]} ${start[1]} Q ${cx} ${cy} ${end[0]} ${end[1]}`
    };
  }).filter(r => r !== null);
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

onMounted(async () => {
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
  const info = footprintMap.value[props.adcode];
  activeCity.value = props.name;
  tooltip.show = true;
  tooltip.name = props.name;
  tooltip.province = props.province || '';
  tooltip.articleCount = info ? info.articleCount : 0;
  tooltip.x = event.clientX;
  tooltip.y = event.clientY;
};

const handleMouseLeave = () => {
  activeCity.value = '';
  tooltip.show = false;
};
</script>

<template>
  <div class="china-map" ref="mapContainerRef" @wheel="handleWheel" @mousedown="startDrag">
    <svg v-if="processedFeatures.length" :viewBox="`0 0 ${width} ${height}`" class="china-map-svg">
      <g :transform="innerTransform">
        <path
            v-for="item in processedFeatures"
            :key="item.id"
            :d="item.pathData"
            :fill="getFillColor(item.properties.adcode)"
            :class="{ 'active-city': activeCity === item.properties.name }"
            @mouseenter="handleMouseEnter($event, item.properties)"
            @mouseleave="activeCity = ''; tooltip.show = false;"
        />

        <g class="routes-layer">
          <path
              v-for="route in routesPaths"
              :key="route.id"
              :d="route.d"
              class="travel-line"
          />
        </g>
      </g>
    </svg>

    <Teleport to="body">
      <div v-show="tooltip.show" class="map-tooltip" :style="{ transform: `translate(${tooltip.x + 15}px, ${tooltip.y + 15}px)` }">
        <span class="city-name">{{ tooltip.name }}</span>
        <span class="province-tag">{{ tooltip.province }}</span>
        <span class="article-count" v-if="tooltip.articleCount">足迹文章: {{ tooltip.articleCount }} 篇</span>
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
  stroke: var(--color-border);
  stroke-width: 0.3px;
  vector-effect: non-scaling-stroke;
  transition: fill 0.3s ease;
}
/* 路线样式 */
.travel-line {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 1.5px;
  stroke-linecap: round;
  stroke-dasharray: 5, 5; /* 虚线效果 */
  opacity: 0.6;
  pointer-events: none; /* 连线不响应鼠标，防止干扰城市选择 */
  vector-effect: non-scaling-stroke;
}

.article-count {
  font-size: 11px;
  margin-top: 4px;
  color: var(--color-accent);
  font-weight: bold;
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