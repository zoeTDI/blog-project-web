<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

interface Tag {
  name: string;
  count: number;
}

// const props = defineProps<{
//   tags: Tag[];
// }>();

const props = withDefaults(defineProps<{
  tags: Tag[];
  height: number
}>(), {
  tags: [],
  height: 280,
})

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const router = useRouter();

interface Box {
  x: number; y: number; w: number; h: number; name: string;
}

let placedBoxes: Box[] = [];
const hoverName = ref<string | null>(null);

// 核心绘制逻辑
const draw = async () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // --- 关键修复 1：确保获取到真实有效的尺寸 ---
  // nextTick 保证 DOM 已挂载，但布局可能仍需微秒级延迟
  const w = container.offsetWidth;
  const h = container.offsetHeight;

  if (w === 0 || h === 0) {
    // 如果尺寸为 0，等待下一帧重试，直到容器被撑开
    requestAnimationFrame(draw);
    return;
  }

  // --- 关键修复 2：等待字体加载 ---
  // 如果 Canvas 在字体（Source Serif 4）加载前绘图，measureText 会出错
  if (document.fonts) {
    await document.fonts.ready;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  // 必须手动设置 style 宽高，否则 dpr 缩放会导致画布显示异常
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;

  ctx.clearRect(0, 0, w, h);
  placedBoxes = [];

  const style = getComputedStyle(document.documentElement);
  const textColor = style.getPropertyValue('--text-h').trim() || '#08060d';
  const accentColor = style.getPropertyValue('--accent').trim() || '#aa3bff';
  const headingFont = style.getPropertyValue('--heading').trim() || 'serif';

  const aspectRatio = (w / h) * 1.1;

  const sortedTags = [...props.tags].sort((a, b) => b.count - a.count);

  sortedTags.forEach(tag => {
    // 1. 核心：无论是否 Hover，字体属性必须保持绝对一致
    const fontSize = Math.max(13, Math.min(26, 11 + tag.count * 0.4));
    const isHover = hoverName.value === tag.name;

    // 取消之前的 700 粗细切换，统一使用 500 或 600
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
        // 2. 仅在这里改变颜色，不重新排列
        ctx.fillStyle = isHover ? accentColor : (tag.count > 15 ? textColor : `${textColor}88`);
        ctx.fillText(`#${tag.name}`, x, y);

        // 如果希望有交互感且不产生位移，可以画一个下划线
        if (isHover) {
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y + 2); // 文本基线下方的偏移
          ctx.lineTo(x + metrics.width, y + 2);
          ctx.stroke();
        }

        placedBoxes.push({ x, y, w: textW, h: textH, name: tag.name });
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
  if (hoverName.value) {
    router.push({ name: 'NoteList', query: { tag: hoverName.value } });
  }
};

onMounted(async () => {
  await nextTick();
  draw();
  window.addEventListener('resize', draw);
});

onUnmounted(() => {
  window.removeEventListener('resize', draw);
});

watch(() => props.tags, draw, { deep: true });
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
  /*height: 280px;  显式高度防止容器坍缩 */
  overflow: hidden;
  position: relative;
}
.ca-tag-canvas {
  display: block;
}
</style>