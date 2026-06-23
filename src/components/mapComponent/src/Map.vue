<script setup lang="ts">
  import ChinaZhCnGeoJson from '@/assets/data/China_zh-cn.json';
  import ChinaEnUsGeoJSON from '@/assets/data/China_en-us.json';
  import { computed, ref } from 'vue';
  import type { GeoJSON, Position } from 'geojson';
  import type {
    CityInfo,
    CityStyleFn,
    Feature,
    MarkedCityGraphFeature,
    MarkedCityGroup,
    ProjectionFn,
  } from './types';
  import { parseToHexColor } from '@/utils/parse.ts';
  import { useI18n } from 'vue-i18n';

  interface Props {
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

  const { t, locale } = useI18n();

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
    const data = (
      locale.value === 'en-US' ? ChinaEnUsGeoJSON : ChinaZhCnGeoJson
    ) as GeoJSON;
    if (!data || data.type !== 'FeatureCollection') return [];

    return data.features.map((feature, index) => {
      const name = feature.properties?.name || `区域 ${index}`;
      const adcode =
        feature.properties?.adcode || feature.id || index.toString();
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
        adcode,
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

  const pinnedCityGraphFeatures = computed<MarkedCityGraphFeature[]>(() => {
    return props.markedCityGroups.map((group) => {
      const hexColor = parseToHexColor(group?.style?.color);
      const featureMap: Record<string, Feature> = {};
      const edges: { from: Feature; to: Feature }[] = [];
      // 构建 adcode -> Feature 的快速映射
      const targetAdcodes: string[] = Object.keys(group.nodes);
      mapFeatures.value.forEach((feat: Feature) => {
        const featAdcodeStr = String(feat.info.adcode);
        const isNode = targetAdcodes.includes(featAdcodeStr);
        const isTarget = Object.values(group.nodes).some((outs) =>
          outs.map(String).includes(featAdcodeStr)
        );
        if (isNode || isTarget) {
          featureMap[featAdcodeStr] = feat;
        }
      });
      // 根据邻接表构建有向边
      Object.entries(group.nodes).forEach(
        ([fromAdcode, outAdcodes]: [string, number[]]) => {
          const fromFeature = featureMap[fromAdcode];
          if (!fromFeature) return;
          outAdcodes.forEach((toAdcode) => {
            const toFeature = featureMap[toAdcode];
            if (toFeature) {
              edges.push({ from: fromFeature, to: toFeature });
            }
          });
        }
      );
      return {
        id: group.id,
        style: hexColor ? { color: hexColor } : undefined,
        featureMap,
        edges,
      };
    });
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
          :key="item.info.adcode"
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
        v-for="graph in pinnedCityGraphFeatures"
        :key="graph.id">
        <g
          v-for="feature in graph.featureMap"
          :key="feature.info.adcode">
          <path
            class="province-stroke-highlight"
            :d="feature.pathData"
            :style="
              graph?.style?.color
                ? {
                    stroke: graph.style.color,
                    fill: `color-mix(in srgb, ${graph.style.color} 10%, transparent)`,
                  }
                : {}
            "></path>
          <circle
            v-if="feature.info.center && feature.info.center.length >= 2"
            :cx="projectionX(feature.info.center[0])"
            :cy="projectionY(feature.info.center[1])"
            r="6"
            stroke-width="1"
            :transform="`
              translate(${projectionX(feature.info.center[0])}, ${projectionY(feature.info.center[1])})
              scale(${1 / scale})
              translate(${-projectionX(feature.info.center[0])}, ${-projectionY(feature.info.center[1])})
            `"
            style="vector-effect: non-scaling-stroke" />
        </g>
        <line
          v-for="(edge, index) in graph.edges"
          :key="index"
          :x1="projectionX(edge.from.info.center[0])"
          :y1="projectionY(edge.from.info.center[1])"
          :x2="projectionX(edge.to.info.center[0])"
          :y2="projectionY(edge.to.info.center[1])"
          style="vector-effect: non-scaling-stroke"
          :stroke="graph?.style?.color || 'black'"
          stroke-width="1.5"
          stroke-dasharray="10 15" />
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

  @keyframes dashMove {
    to {
      stroke-dashoffset: -25;
    }
  }

  .map-pinned-layer line {
    stroke: black;
    animation: dashMove 1s linear infinite;
  }

  .dark .map-pinned-layer line {
    stroke: white;
  }

  .map-pinned-layer circle {
    fill: var(--color-accent);
    stroke: color-mix(in srgb, var(--color-accent) 40%, transparent);
  }
</style>
