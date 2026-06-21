<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { GeoJSON, Position } from 'geojson';
  import type {
    CityInfo,
    CityStyleFn,
    Feature,
    MarkedCityFeatureGroup,
    MarkedCityGroup,
    ProjectionFn,
  } from './types';
  import { parseToHexColor } from '@/utils/parse.ts';

  interface Props {
    geoJsonData: GeoJSON;
    cityStyle?: CityStyleFn;
    scale?: number; // 💡 新增：同步控制内部缩放
    offset?: { x: number; y: number }; // 💡 新增：同步控制内部平移
    isDragging?: boolean; // 💡 新增：同步拖拽状态以控制动画
    markedCityGroups?: MarkedCityGroup[];
  }

  const props = withDefaults(defineProps<Props>(), {
    cityStyle: () => ({}),
    scale: 1,
    offset: () => ({ x: 0, y: 0 }),
    isDragging: false,
    markedCityGroups: () => [],
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

  const projectionX = (lng: number): number => {
    if (typeof lng !== 'number') return 0;
    return (lng - 73) * (WIDTH / (135 - 73));
  };

  const projectionY = (lat: number): number => {
    if (typeof lat !== 'number') return 0;
    return HEIGHT - (lat - 18) * (HEIGHT / (54 - 18));
  };

  const projection: ProjectionFn = (coord: Position): [number, number] => {
    return [projectionX(coord[0]), projectionY(coord[1])];
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

  const mapFeatures = computed<Feature[]>(() => {
    const data = props.geoJsonData;
    if (!data || data.type !== 'FeatureCollection') return [];

    return data.features.map((feature, index) => {
      const name = feature.properties?.name || `区域 ${index}`;
      const id = feature.properties?.adcode || feature.id || index.toString();
      const geo = feature.geometry;

      let pathData = '';
      if (!Array.isArray(geo.coordinates)) {
        geo.coordinates = [geo.coordinates];
      }

      pathData = geo.coordinates
        .map((coords) => convertCoordsToPath(coords as Position[][]))
        .join(' ');

      const rawCenter = feature.properties?.center as
        | [number, number]
        | undefined;

      const cityInfo: CityInfo = {
        id,
        name,
        center: rawCenter,
        properties: feature.properties,
      };

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

  const pinnedCityFeature = computed<MarkedCityFeatureGroup[]>(() => {
    const rs: MarkedCityFeatureGroup[] = props.markedCityGroups.map(
      (item: MarkedCityGroup) => {
        const hexColor = parseToHexColor(item?.style?.color);
        if (hexColor) {
          return {
            id: item.id,
            adcodes: item.adcodes,
            style: { color: hexColor },
            features: [],
          };
        } else {
          return {
            id: item.id,
            adcodes: item.adcodes,
            features: [],
          };
        }
      }
    );
    mapFeatures.value.forEach((item: Feature) => {
      rs.forEach((pcf: MarkedCityFeatureGroup) => {
        if (pcf.adcodes.includes(item.info.id)) {
          pcf.features.push(item);
        }
      });
    });
    return rs;
  });

  const getLinePosition = (
    groupIndex: number,
    featureIndex: number
  ): { x1: number; y1: number; x2: number; y2: number } | null => {
    if (featureIndex === 0) return null;
    const last = pinnedCityFeature.value[groupIndex].features[featureIndex - 1];
    const cur = pinnedCityFeature.value[groupIndex].features[featureIndex];
    const [x1, y1] = projection(last.info.center);
    const [x2, y2] = projection(cur.info.center);
    return { x1, y1, x2, y2 };
  };
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
        class="map-pinned-layer"
        pointer-events="none"
        v-for="(item, itemIndex) in pinnedCityFeature"
        :key="item.id">
        <g
          v-for="(feature, featureIndex) in item.features"
          :key="feature.info.id">
          <path
            class="province-stroke-highlight"
            :d="feature.pathData"
            :style="
              item?.style?.color
                ? {
                    stroke: item.style.color,
                    fill: `color-mix(in srgb, ${item.style.color} 10%, transparent)`,
                  }
                : {}
            "></path>
          <circle
            v-if="feature.info.center && feature.info.center.length >= 2"
            :cx="projectionX(feature.info.center[0])"
            :cy="projectionY(feature.info.center[1])"
            r="6"
            fill="#ffff00"
            stroke="#000"
            stroke-width="1"
            :transform="`
              translate(${projectionX(feature.info.center[0])}, ${projectionY(feature.info.center[1])})
              scale(${1 / scale})
              translate(${-projectionX(feature.info.center[0])}, ${-projectionY(feature.info.center[1])})
            `"
            style="vector-effect: non-scaling-stroke" />
          <line
            v-if="getLinePosition(itemIndex, featureIndex)"
            :x1="projectionX(item.features[featureIndex - 1].info.center[0])"
            :y1="projectionY(item.features[featureIndex - 1].info.center[1])"
            :x2="projectionX(feature.info.center[0])"
            :y2="projectionY(feature.info.center[1])"
            style="vector-effect: non-scaling-stroke"
            stroke="black" />
        </g>
      </g>
      <g
        class="map-first-highlight-layer"
        pointer-events="none">
        <path
          class="province-stroke-highlight"
          v-if="currentHoveredFeature"
          :d="currentHoveredFeature.pathData" />
      </g>
      <g class="map-overlay-svg-layer">
        <slot
          name="svg-overlay"
          :projection="projection"></slot>
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
    transition: none;
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
    fill: var(--color-text-primary);
  }

  .province-stroke-highlight {
    fill: var(--color-map-bg-hover);
    stroke: var(--color-map-border-hover);
    stroke-width: 1.5px;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
</style>
