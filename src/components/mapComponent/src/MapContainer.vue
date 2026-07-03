<script setup lang="ts">
  import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
  import { Map, type MarkedCityGroup } from '@/components/mapComponent';
  import type { Position } from 'geojson';
  import type { CityInfo, CityStyleFn, MapTransformState } from './types';

  interface Props {
    cityStyle?: CityStyleFn;
    zoomable?: boolean;
    draggable?: boolean;
    markedCityGroups?: MarkedCityGroup[];
  }

  const props = withDefaults(defineProps<Props>(), {
    zoomable: true,
    draggable: true,
    markedCityGroups: () => [],
  });

  const emit = defineEmits<{
    (e: 'hover-city', cityInfo: CityInfo | null): void;
    (e: 'click-city', cityInfo: CityInfo): void;
    (e: 'dblclick-city', cityInfo: CityInfo): void;
    (e: 'transform-change', state: MapTransformState): void;
    (e: 'contextmenu-city', event: MouseEvent, cityInfo: CityInfo): void;
  }>();

  const scale = ref(1);
  const offset = ref({ x: 0, y: 0 });
  const isDragging = ref(false);
  const hoveredCity = ref<CityInfo | null>(null);
  const mousePosition = reactive({ x: 0, y: 0 });

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 30;
  const ZOOM_SPEED = 0.08;

  let startX = 0;
  let startY = 0;
  let animationFrameId: number | null = null;
  const containerRef = ref<HTMLDivElement | null>(null);
  const mapRef = ref<InstanceType<typeof Map> | null>(null);

  const notifyTransform = () => {
    emit('transform-change', {
      scale: scale.value,
      offset: { ...offset.value },
    });
  };

  /**
   * 💡 核心数学转换：利用逆矩阵将屏幕上的任意 mouse 像素位置
   * 精准映射为当前 SVG viewBox 空间(800x600)下的绝对矢量坐标点。
   * 此方法能自适应外部容器的任何高宽比变化及 letterbox 留白。
   */
  const getSvgSpaceCoords = (clientX: number, clientY: number) => {
    const svgElement = mapRef.value?.svgRef as SVGSVGElement | undefined;
    if (!svgElement) return { x: 0, y: 0 };

    const point = svgElement.createSVGPoint();
    point.x = clientX;
    point.y = clientY;

    const ctm = svgElement.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };

    // 利用逆矩阵还原出未被内部变换影响的原始 viewBox 坐标
    const svgPoint = point.matrixTransform(ctm.inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  };

  // 缩放控制
  const handleWheel = (e: WheelEvent) => {
    if (!props.zoomable) return;
    e.preventDefault();

    // 💡 转换为 SVG 空间坐标进行纯数变动
    const { x: mouseX, y: mouseY } = getSvgSpaceCoords(e.clientX, e.clientY);

    const mapX = (mouseX - offset.value.x) / scale.value;
    const mapY = (mouseY - offset.value.y) / scale.value;

    let delta = e.deltaY < 0 ? 1 + ZOOM_SPEED : 1 - ZOOM_SPEED;
    let newScale = scale.value * delta;

    if (newScale < MIN_SCALE) newScale = MIN_SCALE;
    if (newScale > MAX_SCALE) newScale = MAX_SCALE;

    scale.value = newScale;
    offset.value = {
      x: mouseX - mapX * scale.value,
      y: mouseY - mapY * scale.value,
    };
    notifyTransform();
  };

  // 拖拽控制
  const handleMouseDown = (e: MouseEvent) => {
    if (!props.draggable || e.button !== 0) return;
    isDragging.value = true;

    // 💡 记录拖拽起点的 SVG 虚拟坐标增量
    const { x: svgX, y: svgY } = getSvgSpaceCoords(e.clientX, e.clientY);
    startX = svgX - offset.value.x;
    startY = svgY - offset.value.y;

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    animationFrameId = requestAnimationFrame(() => {
      const { x: svgX, y: svgY } = getSvgSpaceCoords(e.clientX, e.clientY);
      offset.value = { x: svgX - startX, y: svgY - startY };
      notifyTransform();
    });
  };

  const handleMouseUp = () => {
    isDragging.value = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const updateGlobalMousePosition = (e: MouseEvent) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  };

  const resetTransform = () => {
    scale.value = 1;
    offset.value = { x: 0, y: 0 };
    notifyTransform();
  };

  /**
   * 编程式聚焦
   */
  const zoomToCoordinates = (coords: Position, targetScale?: number) => {
    if (!containerRef.value || !mapRef.value) return;

    const [x, y] = mapRef.value.projection(coords);
    if (targetScale !== undefined) {
      scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, targetScale));
    }

    // 💡 艺术级简化：由于现在全部在标准 800x600 的 SVG 闭包空间中做矩阵变换，
    // 整个视口物理中轴线恒定就是 (400, 300)，彻底免疫大屏拉伸带来的物理偏移。
    offset.value = {
      x: 400 - x * scale.value,
      y: 300 - y * scale.value,
    };

    notifyTransform();
  };

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('wheel', handleWheel, {
        passive: false,
      });
    }
    window.addEventListener('mousemove', updateGlobalMousePosition);
  });

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('wheel', handleWheel);
    }
    window.removeEventListener('mousemove', updateGlobalMousePosition);
  });

  defineExpose({
    resetTransform,
    zoomToCoordinates,
    transformState: computed(() => ({
      scale: scale.value,
      offset: offset.value,
    })),
    getProjection: () => mapRef.value?.projection,
  });

  const handleCityClick = (val: CityInfo): void => {
    emit('click-city', val);
  };
  const handleCityDbClick = (val: CityInfo): void => {
    emit('dblclick-city', val);
  };
  const handleCityHover = (val: CityInfo | null): void => {
    hoveredCity.value = val;
    emit('hover-city', val);
  };
  const handleContextMenu = (e: MouseEvent, item: CityInfo): void => {
    emit('contextmenu-city', e, item);
  };
</script>

<template>
  <div
    ref="containerRef"
    class="map-container"
    :class="{ 'is-grabbing': isDragging }"
    @mousedown="handleMouseDown">
    <div class="map-layer-background">
      <Map
        ref="mapRef"
        :city-style="cityStyle"
        :scale="scale"
        :offset="offset"
        :is-dragging="isDragging"
        :marked-city-groups="props.markedCityGroups"
        @hover-city="handleCityHover"
        @click-city="handleCityClick"
        @dblclick-city="handleCityDbClick"
        @contextmenu="handleContextMenu">
        <template #svg-overlay="{ projection }">
          <slot
            name="map-overlay-layer"
            :projection="projection" />
        </template>
      </Map>
    </div>

    <div class="map-layer-ui">
      <div class="info-panel-box">
        <slot
          name="info-panel"
          :hoveredCity="hoveredCity" />
      </div>
    </div>
    <Teleport to="div#app">
      <div
        class="mouse-tooltip-box"
        v-if="hoveredCity"
        :style="{
          left: `${mousePosition.x + 15}px`,
          top: `${mousePosition.y + 15}px`,
        }">
        <div class="tooltip-name">{{ hoveredCity.name }}</div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: grab;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    background-image: radial-gradient(
      circle at 1px 1px,
      var(--color-map-border) 1px,
      transparent 0
    );
    background-size: 8px 8px;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
    padding: var(--content-padding-M);
    user-select: none;
  }

  .map-container.is-grabbing {
    cursor: grabbing;
  }

  .map-layer-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .map-layer-ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    pointer-events: none;
  }

  .info-panel-box {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 10;
    pointer-events: none;

    background: var(--color-container-bg);
    color: var(--color-text-h);
    border: 1px solid var(--color-border);
    font-family: var(--font-text);

    padding: 12px 20px;
    min-width: 160px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mouse-tooltip-box {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    pointer-events: none;
    background: var(--color-container-bg);
    color: var(--color-text-h);
    border: 1px solid var(--color-border);
    padding: 8px 16px;
    font-family: var(--font-text);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    font-size: 12px;
  }
</style>
