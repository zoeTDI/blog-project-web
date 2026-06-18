<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { GeoJSON, Position } from 'geojson';
  import type { CityInfo, CityStyleFn, ProjectionFn } from './types';

  interface Props {
    geoJsonData: GeoJSON;
    cityStyle?: CityStyleFn;
    scale?: number; // 💡 新增：同步控制内部缩放
    offset?: { x: number; y: number }; // 💡 新增：同步控制内部平移
    isDragging?: boolean; // 💡 新增：同步拖拽状态以控制动画
    adcodes?: number[];
  }

  const props = withDefaults(defineProps<Props>(), {
    cityStyle: () => ({}),
    scale: 1,
    offset: () => ({ x: 0, y: 0 }),
    isDragging: false,
    adcodes: () => [],
  });

  const emit = defineEmits<{
    (e: 'hover-city', cityInfo: CityInfo | null): void;
    (e: 'click-city', cityInfo: CityInfo): void;
    (e: 'contextmenu-city', event: MouseEvent, cityInfo: CityInfo): void;
    (e: 'dblclick-city', cityInfo: CityInfo): void;
  }>();

  const WIDTH = 800;
  const HEIGHT = 600;
  const hoveredProvince = ref<string | null>(null);
  const svgRef = ref<SVGElement | null>(null); // 💡 新增：SVG DOM 引用

  const projection: ProjectionFn = (coord: Position): [number, number] => {
    const lng = coord[0];
    const lat = coord[1];
    const x = (lng - 73) * (WIDTH / (135 - 73));
    const y = HEIGHT - (lat - 18) * (HEIGHT / (54 - 18));
    return [x, y];
  };

  const convertCoordsToPath = (rings: Position[][]): string => {
    return rings
      .map(
        (ring) =>
          ring
            .map((coord, i) => {
              const [x, y] = projection(coord);
              return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
            })
            .join(' ') + ' Z'
      )
      .join(' ');
  };

  const mapFeatures = computed(() => {
    const data = props.geoJsonData;
    if (!data || data.type !== 'FeatureCollection') return [];

    return data.features.map((feature, index) => {
      const name = feature.properties?.name || `区域 ${index}`;
      const id = feature.properties?.adcode || feature.id || index.toString();
      const geo = feature.geometry;

      let pathData = '';
      if (geo) {
        if (geo.type === 'Polygon') {
          pathData = convertCoordsToPath(geo.coordinates as Position[][]);
        } else if (geo.type === 'MultiPolygon') {
          pathData = geo.coordinates
            .map((polygonCoords) =>
              convertCoordsToPath(polygonCoords as Position[][])
            )
            .join(' ');
        }
      }

      const cityInfo: CityInfo = { id, name, properties: feature.properties };

      return {
        info: cityInfo,
        pathData,
        customStyle: props.cityStyle(cityInfo),
      };
    });
  });

  const currentHoveredFeature = computed(() => {
    if (!hoveredProvince.value) return null;
    return (
      mapFeatures.value.find(
        (item) => item.info.name === hoveredProvince.value
      ) || null
    );
  });

  /**
   * 鼠标hover事件，添加hover高亮
   * @param item
   */
  const handleMouseOver = (item: CityInfo) => {
    hoveredProvince.value = item.name;
    emit('hover-city', item);
  };

  /**
   * 鼠标移出事件，清空hover高亮
   */
  const handleMouseLeave = () => {
    hoveredProvince.value = null;
    emit('hover-city', null);
  };

  /**
   * 点击事件
   * @param item 城市信息
   */
  const handleCityClick = (item: CityInfo) => {
    // 直接传递
    emit('click-city', item);
  };

  /**
   * 右键事件
   * @param e 右键鼠标点击事件
   * @param item 城市信息
   */
  const handleContextMenu = (e: MouseEvent, item: CityInfo) => {
    emit('contextmenu-city', e, item);
  };

  /**
   * 双击事件
   * @param item 城市信息
   */
  const handleDbClick = (item: CityInfo) => {
    emit('dblclick-city', item);
  };

  const pinnedFeature = computed(() => {
    return mapFeatures.value.filter((item) =>
      props.adcodes.includes(item.info.id)
    );
  });

  defineExpose({
    projection,
    WIDTH,
    HEIGHT,
    svgRef, // 💡 暴露给外层容器计算高精度矩阵坐标
  });
</script>

<template>
  <svg
    ref="svgRef"
    class="map-svg"
    viewBox="0 0 800 600"
    width="100%"
    height="100%">
    <g
      class="map-transform-g"
      :class="{ 'is-dragging': isDragging }"
      :transform="`translate(${offset!.x}, ${offset!.y}) scale(${scale})`">
      <g class="map-contour-layer">
        <path
          v-for="item in mapFeatures"
          :key="item.info.id"
          :d="item.pathData"
          class="province-path"
          :style="item.customStyle"
          @mouseover="handleMouseOver(item.info)"
          @mouseleave="handleMouseLeave"
          @click="handleCityClick(item.info)"
          @contextmenu.prevent="handleContextMenu($event, item.info)"
          @dblclick="handleDbClick(item.info)">
          <title>{{ item.info.name }}</title>
        </path>
      </g>

      <g
        class="map-highlight-layer"
        pointer-events="none">
        <path
          v-if="currentHoveredFeature"
          :d="currentHoveredFeature.pathData"
          class="province-stroke-highlight" />
      </g>
      <!--固定高亮地区-->
      <g
        class="map-hightlight-layer"
        pointer-events="none">
        <path
          v-for="item in pinnedFeature"
          :key="item.info.id"
          :d="item.pathData"
          class="province-stroke-highlight"></path>
      </g>

      <g class="map-overlay-svg-layer">
        <slot
          name="svg-overlay"
          :projection="projection" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
  .map-svg {
    display: block;
    overflow: visible;
    width: 100%;
    height: 100%;
  }

  .map-transform-g {
    transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
    will-change: transform;
  }

  .map-transform-g.is-dragging {
    transition: none; /* 拖拽时立即响应，杜绝手感延迟 */
  }

  .province-path {
    fill: var(--color-map-bg);
    fill-opacity: 0.05;
    stroke: var(--color-map-border);
    stroke-width: 0.5;
    vector-effect: non-scaling-stroke;
    paint-order: fill stroke;
    cursor: pointer;
    transition: fill 0.2s ease;
    pointer-events: all;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .province-path:hover {
    fill: var(--color-text-primary) !important;
  }

  .province-stroke-highlight {
    fill: var(--color-map-bg-hover);
    stroke: var(--color-map-border-hover) !important;
    stroke-width: 1.5px !important;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
</style>
