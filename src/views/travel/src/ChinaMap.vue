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
const pinScale = computed(() => {
  return 1 / mapTransform.scale;
});
const processedFeatures = ref<any[]>([]);
const activeCity = ref('');
const tooltip = reactive({ show: false, name: '', province: '', x: 0, y: 0 });

// 找到当前选中的城市完整数据
const activeCityData = computed(() => {
  if (!activeCity.value) return null;
  // 通过名称在 GeoJSON 中找到 adcode，再在 map 中找数据
  const feature = ChinaCityGeoJSON.features.find(f => f.properties.name === activeCity.value);
  if (!feature) return null;

  const adcode = feature.properties.adcode;
  const info = footprintMap.value[adcode];

  return {
    name: activeCity.value,
    province: feature.properties.province || '',
    visited: info?.visited || false,
    articleCount: info?.articleCount || 0,
    articles: info?.articles || [] // 假设数据中包含文章列表
  };
});

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
const getVisitedStyle = (adcode: number) => {
  const info = footprintMap.value[adcode];
  if (!info || !info.visited) return null;

  const count = info.articleCount;
  // 计算透明度权重：文章越多，颜色越实
  // 基础透明度 0.15，最高 0.6
  const opacity = Math.min(0.15 + (count / 20) * 0.45, 0.6);

  return {
    fill: 'var(--color-accent)',
    fillOpacity: opacity,
    stroke: 'var(--color-accent)',
    strokeWidth: '1px'
  };
};

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

// 1. 获取城市的中心坐标（用于钉图钉）
const getCityCenter = (adcode: number) => {
  const feat = ChinaCityGeoJSON.features.find(f => f.properties.adcode === adcode);
  if (!feat) return null;
  const coords = feat.properties.centroid || feat.properties.center;
  return projection(coords);
};

// 2. 计算直线连接
const routesPaths = computed(() => {
  return props.data.routes.map(route => {
    const start = getCityCenter(route.fromAdcode);
    const end = getCityCenter(route.toAdcode);
    if (!start || !end) return null;
    // 使用直线 L 替代 曲线 Q
    return { id: route.id, d: `M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}` };
  }).filter(r => r);
});

// 3. 已去过城市的图钉数据
const cityPins = computed(() => {
  return props.data.footprints
      .filter(fp => fp.visited)
      .map(fp => ({
        ...fp,
        pos: getCityCenter(fp.adcode)
      }))
      .filter(p => p.pos);
});

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

</script>

<template>
  <div class="map-board" ref="mapContainerRef" @wheel="handleWheel" @mousedown="startDrag">
    <svg v-if="processedFeatures.length" :viewBox="`0 0 ${width} ${height}`" class="china-map-svg">
      <g :transform="innerTransform">
        <path
            v-for="item in processedFeatures"
            :key="item.id"
            :d="item.pathData"
            :style="getVisitedStyle(item.properties.adcode)"
            :class="[
              'map-path',
              {
                'is-active': activeCity === item.properties.name,
                'is-visited': footprintMap[item.properties.adcode]?.visited
              }
            ]"
            @mouseenter="handleMouseEnter($event, item.properties)"
            @mouseleave="activeCity = ''; tooltip.show = false;"
        />

        <g class="routes-layer">
          <path
              v-for="line in routesPaths"
              :key="line.id"
              :d="line.d"
              class="thread-line"
          />
        </g>

        <g class="pins-layer">
          <g
              v-for="pin in cityPins"
              :key="pin.adcode"
              :transform="`translate(${pin.pos[0]}, ${pin.pos[1]}) scale(${pinScale})`"
          >
            <circle r="4" class="pin-shadow" cy="2" cx="1" />
            <circle r="3.5" class="pin-head" />
            <circle r="1" fill="white" opacity="0.4" cy="-1" cx="-1" />
          </g>
        </g>
      </g>
    </svg>

    <div class="info-card" :class="{ 'is-empty': !activeCityData }">
      <template v-if="activeCityData">
        <div class="card-header">
          <span class="city-title">{{ activeCityData.name }}</span>
          <span :class="['status-tag', activeCityData.visited ? 'is-visited' : 'is-unknown']">
            {{ activeCityData.visited ? '已点亮' : '未知' }}
            <span v-if="activeCityData.visited" class="count-badge">{{ activeCityData.articleCount }}</span>
          </span>
        </div>

        <div class="card-body">
          <div class="province-label">{{ activeCityData.province }}</div>

          <div v-if="activeCityData.visited && activeCityData.articles.length > 0" class="article-section">
            <div class="section-title">相关文章</div>
            <ul class="article-list">
              <li v-for="(title, index) in activeCityData.articles.slice(0, 3)" :key="index">
                • {{ title }}
              </li>
            </ul>
          </div>
        </div>
      </template>

      <div v-else class="empty-state">
        <p>鼠标悬停以查看详情</p>
      </div>
    </div>
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
/* 适配主题的“板子”容器 */
.map-board {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  cursor: grab;
  /* 使用全局变量：卡片背景色 */
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  /* 增加软木/毛毡颗粒感纹理 */
  background-image: radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0);
  background-size: 8px 8px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.map-board:active { cursor: grabbing; }

/* 地图路径：使用全局文字颜色做极淡的填充 */
.map-path {
  fill: var(--color-text-primary);
  fill-opacity: 0.05;

  stroke: var(--color-border);
  stroke-width: 0.8px;
  vector-effect: non-scaling-stroke;
  paint-order: fill stroke;

  transition: all 0.3s ease;
  cursor: pointer;
}

.is-visited {
  filter: drop-shadow(0 0 1px var(--color-border-hover-accent));
}

.map-path:hover,
.is-active {
  fill: var(--color-bg-hover-accent) !important;
  fill-opacity: 0.7 !important;
  stroke: var(--color-accent) !important;
  stroke-width: 1.5px !important;
  filter: drop-shadow(0 0 5px var(--color-border-hover-accent)) !important;
  z-index: 10;
}

:deep(.dark) .map-path {
  filter: drop-shadow(0 0 2px var(--color-accent));
}

:deep(.dark) .map-path:hover {
  fill: var(--color-accent);
  fill-opacity: 0.3;
  stroke: var(--color-accent);
  filter: drop-shadow(0 0 5px var(--color-accent));
}

/* 适配样式表中未合并的冗余 path 定义 */
path {
  /* 统一合并到 .map-path 类中，避免全局 path 选择器冲突 */
  stroke-linejoin: round;
  stroke-linecap: round;
}

.routes-layer {
  pointer-events: none;
}

.pins-layer {
  pointer-events: none;
}

/* 缠绕线：使用全局强调色变量 */
.thread-line {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 1px; /* 无论缩放多少，视觉上永远是 1px */
  stroke-linecap: round;
  stroke-dasharray: 0.5 1.5;
  opacity: 0.8;
  /* 关键属性：防止缩放导致线条变粗 */
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));
}

/* 图钉：针头使用强调色 */
.pin-head {
  fill: var(--color-accent);
  stroke: var(--color-border-accent);
  stroke-width: 0.5;
}

.pin-shadow {
  fill: rgba(0, 0, 0, 0.3);
}

/* 深色模式下的特殊微调 */
:deep(.dark) .pin-shadow {
  fill: rgba(0, 0, 0, 0.6);
}

:deep(.dark) .map-board {
  /* 深色模式下颗粒感减弱，更像黑板 */
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
}

/* Tooltip 样式已经完美适配全局变量，无需大改 */
.map-tooltip {
  position: fixed;
  left: 0; top: 0;
  background: var(--color-container-bg);
  color: var(--color-text-h);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 8px;
  font-family: var(--font-text);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 9999;
  backdrop-filter: blur(8px);
}

/* 信息卡片基础样式 */
.info-card {
  position: absolute;
  left: 20px;
  bottom: 20px;
  width: 240px;
  min-height: 100px;
  background: var(--color-container-bg);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  z-index: 100;
  pointer-events: none;
  /* 确保切换内容时也没有位移感 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: var(--color-text-primary);
  opacity: 0.5;
  font-size: 13px;
  font-style: italic;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.city-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-h);
}

/* 状态标签 */
.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.count-badge {
  font-weight: bold;
  background: var(--color-accent);
  color: white;
  border-radius: 10px;
  padding: 0 5px;
  font-size: 10px;
}

.province-label {
  font-size: 13px;
  color: var(--color-text-primary);
  opacity: 0.7;
  margin-bottom: 12px;
}

/* 文章列表 */
.article-section {
  border-top: 1px dashed var(--color-border);
  padding-top: 10px;
}

.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-list li {
  font-size: 12px;
  color: var(--color-text-primary);
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 深色模式微调 */
:deep(.dark) .info-card {
  background: rgba(26, 26, 26, 0.85);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
</style>