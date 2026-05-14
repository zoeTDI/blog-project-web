<script setup lang="ts">
import {computed, reactive, ref} from "vue";
import ChinaGeoJSON from '@/assets/data/China.json'

const props = withDefaults(defineProps<{
  width: number,
  height: number
}>(), {
  width: 800,
  height: 600
})

const width = computed(() => props.width);
const height = computed(() => props.height);

const mapData = ref(ChinaGeoJSON);
const activeProvince = ref('');
const tooltip = reactive({
  show: false,
  name: '',
  x: 0,
  y: 0,
})

const projection = (coords) => {
  const x = (coords[0] - 73) * (width.value / (135 - 73));
  const y = height.value - (coords[1] - 18) * (height.value / (54 - 18));
  return [x, y];
};

const generatePath = (feature) => {
  const { geometry } = feature;
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  return polygons.map(polygon => {
    return polygon.map((ring, index) => {
      const points = ring.map(p => projection(p));
      return (index === 0 ? "M" : "L") + points.map(p => p.join(",")).join(" L") + "Z";
    }).join(" ");
  }).join(" ");
};

const handleMouseEnter = (event, name) => {
  activeProvince.value = name;
  tooltip.show = true;
  tooltip.name = name;
  tooltip.x = event.pageX + 15;
  tooltip.y = event.pageY + 15;
};

const handleMouseLeave = () => {
  activeProvince.value = '';
  tooltip.show = false;
};

const handleProvinceClick = (props) => {
  console.log('点击了省份：', props.name, ' 编码：', props.adcode);
  // 这里可以触发跳转或弹窗
};
</script>

<template>
<div class="china-map">
  <svg
      v-if="mapData"
      :viewBox="`0 0 ${width} ${height}`"
      xmlns="http://www.w3.org/2000/svg"
      class="china-map-svg"
  >
    <path
        v-for="(feature, index) in mapData.features"
        :key="feature.properties.adcode || index"
        :d="generatePath(feature)"
        :class="{ 'active-province': activeProvince === feature.properties.name }"
        @mouseenter="handleMouseEnter($event, feature.properties.name)"
        @mouseleave="handleMouseLeave"
        @click="handleProvinceClick(feature.properties)"
    />
  </svg>

  <div
      v-show="tooltip.show"
      class="map-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
  >
    {{ tooltip.name }}
  </div>
</div>
</template>

<style scoped>
.china-map {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

.china-map-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 12px var(--color-border));
}

path {
  fill: var(--color-bg);
  stroke: var(--color-border);
  stroke-width: 0.5;
  transition: all 0.3s ease;
  cursor: pointer;
}

path:hover {
  fill: var(--color-bg-hover-accent);
  stroke: var(--color-accent);
  stroke-width: 1.5;
  filter: drop-shadow(0 0 8px var(--color-border-hover-accent));
}

/* 激活状态（可选） */
.active-province {
  fill: var(--color-bg-hover-accent);
}

.map-tooltip {
  position: fixed;
  background: var(--color-container-bg);
  color: var(--color-text-h);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-text);
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 9999;
  white-space: nowrap;
  backdrop-filter: blur(4px);
}

/* 深色模式下的额外微调 */
:deep(.dark) .map-tooltip {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
</style>