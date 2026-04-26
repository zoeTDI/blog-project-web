<script setup lang="ts">
import {onMounted, ref, watch, onUnmounted, nextTick} from 'vue';

interface Tag {
  id: number;
  name: string;
  count: number;
}

const props = withDefaults(defineProps<{
  tags: Tag[];
  height: number;
  onTagClick?: (tag: Tag) => void;
}>(), {
  tags: () => [],
  height: 280,
})

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
}

let placedBoxes: Box[] = [];
const hoverName = ref<string | null>(null);
let observer: MutationObserver | null = null;

// 核心绘制逻辑
const draw = async () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = container.offsetWidth;
  const h = container.offsetHeight;
  if (w === 0 || h === 0) {
    requestAnimationFrame(draw);
    return;
  }

  if (document.fonts) await document.fonts.ready;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx.clearRect(0, 0, w, h);
  placedBoxes = [];

  // --- 关键点：每次重绘时重新获取当前主题的颜色 ---
  const style = getComputedStyle(document.documentElement);
  // 获取主题定义的 CSS 变量，如果获取不到则使用备选色
  const textColor = style.getPropertyValue('--text').trim() || '#08060d';
  const accentColor = style.getPropertyValue('--accent').trim() || '#aa3bff';
  const headingFont = style.getPropertyValue('--heading').trim() || 'serif';

  const aspectRatio = (w / h) * 1.1;
  const sortedTags = [...props.tags].sort((a, b) => b.count - a.count);

  sortedTags.forEach(tag => {
    const fontSize = Math.max(13, Math.min(26, 11 + tag.count * 0.4));
    const isHover = hoverName.value === tag.name;
    ctx.font = `500 ${fontSize}px ${headingFont}`;

    const metrics = ctx.measureText(`#${tag.name}`);
    const textW = metrics.width + 8;
    const textH = fontSize * 1.1;

    let angle = 0;
    let radius = 0;
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 1500) {
      attempts++;
      const x = w / 2 + (Math.cos(angle) * radius * aspectRatio) - textW / 2;
      const y = h / 2 + (Math.sin(angle) * radius) + textH / 4;

      const isOverlap = placedBoxes.some(box => (
          x < box.x + box.w &&
          x + textW > box.x &&
          y - textH < box.y &&
          y > box.y - box.h
      ));

      const padding = 1;
      const isOut = x < padding || x + textW > w - padding || y - textH < padding || y > h - padding;

      if (!isOverlap && !isOut) {
        // 使用读取到的最新颜色
        ctx.fillStyle = isHover ? accentColor : (tag.count > 15 ? textColor : `${textColor}88`);
        ctx.fillText(`#${tag.name}`, x, y);

        if (isHover) {
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y + 2, metrics.width, 0); // 或者画线
        }

        placedBoxes.push({x, y, w: textW, h: textH, name: tag.name});
        placed = true;
      }
      angle += 0.1;
      radius += 0.25;
    }
  });
}

const handleMouseMove = (e: MouseEvent) => {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  const hit = placedBoxes.find(box => (
      mx >= box.x && mx <= box.x + box.w &&
      my <= box.y && my >= box.y - box.h
  ));

  const newHover = hit ? hit.name : null;
  if (newHover !== hoverName.value) {
    hoverName.value = newHover;
    if (canvasRef.value) canvasRef.value.style.cursor = hit ? 'pointer' : 'default';
    draw();
  }
};

const handleCanvasClick = () => {
  if (hoverName.value && props.onTagClick) {
    const targetTag = props.tags.find(t => t.name === hoverName.value);
    props.onTagClick(targetTag);
  }
};

onMounted(async () => {
  await nextTick();
  draw();
  window.addEventListener('resize', draw);

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
        draw();
      }
    });
  });

  const targetNode = document.querySelector('.app-wrapper') || document.documentElement;
  observer.observe(targetNode, {attributes: true});
});

onUnmounted(() => {
  window.removeEventListener('resize', draw);
  if (observer) observer.disconnect();
});

watch(() => props.tags, draw, {deep: true});
</script>

<template>
  <div ref="containerRef" class="ca-tag-cloud-wrapper" :style="{height: `${height}px`}">
    <canvas
        ref="canvasRef"
        @mousemove="handleMouseMove"
        @click="handleCanvasClick"
        class="ca-tag-canvas"
    ></canvas>
  </div>
</template>

<style scoped>
.ca-tag-cloud-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.ca-tag-canvas {
  display: block;
}
</style>