<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import type { CaInkTreeProps } from './types.ts';
  import { useCSSNamespace, useDebounceFn } from '@caldm/hook';

  const props = withDefaults(defineProps<CaInkTreeProps>(), {
    maxTrees: 5,
    maxGenerations: 5,
    minBranchLen: 15,
    maxBranchLen: 30,
    spawnInterval: 3000,
    colorVarName: '--text',
  });

  const ns = useCSSNamespace('ink-tree');

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrameId: number;

  let lastWidth = 0;
  let lastHeight = 0;
  let resizeTimer: number | null = null;

  // 2. 主题色获取逻辑优化 (做降级兼容处理)
  const getThemeColor = (alpha = 0.15) => {
    if (typeof window === 'undefined') return `rgba(128, 128, 128, ${alpha})`;

    if (props.colorGetter) {
      return props.colorGetter(alpha);
    }

    const varName = props.colorVarName.startsWith('--') ? props.colorVarName : ns.cssVarName(props.colorVarName);

    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();

    if (textColor.startsWith('#')) {
      const hex = textColor.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (textColor.startsWith('rgb')) {
      // 增加对 rgb/rgba 的正则解析，提升兼容性
      const match = textColor.match(/\d+/g);
      if (match && match.length >= 3) {
        return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`;
      }
    }

    return `rgba(120, 120, 120, ${alpha})`;
  };

  // --- 单个分枝任务类 ---
  class BranchTask {
    startX: number;
    startY: number;
    currX: number;
    currY: number;
    angle: number;
    width: number;
    targetLen: number;
    currLen: number = 0;
    generation: number;
    isFinished: boolean = false;

    constructor(x: number, y: number, angle: number, width: number, gen: number) {
      this.startX = this.currX = x;
      this.startY = this.currY = y;
      this.angle = angle;
      this.width = width;
      this.generation = gen;
      this.targetLen = props.minBranchLen + Math.random() * (props.maxBranchLen - props.minBranchLen);
    }

    step(speed: number) {
      if (this.isFinished) return null;

      const prevX = this.currX;
      const prevY = this.currY;

      this.angle += (Math.random() - 0.5) * 0.1;
      this.currX += Math.cos(this.angle) * speed;
      this.currY += Math.sin(this.angle) * speed;
      this.currLen += speed;

      if (this.currLen >= this.targetLen) {
        this.isFinished = true;
      }

      return { prevX, prevY, currX: this.currX, currY: this.currY };
    }
  }

  // --- 树类 ---
  class InkTree {
    activeTasks: BranchTask[] = [];
    isDead: boolean = false;

    constructor(x: number, y: number, angle: number) {
      const root = new BranchTask(x, y, angle, 2.5, 0);
      this.activeTasks.push(root);
    }

    update() {
      if (this.isDead) return;

      const newActiveTasks: BranchTask[] = [];

      for (const task of this.activeTasks) {
        const pos = task.step(0.8);
        if (pos && ctx) {
          ctx.beginPath();
          ctx.moveTo(pos.prevX, pos.prevY);
          ctx.lineTo(pos.currX, pos.currY);
          ctx.lineWidth = task.width;
          ctx.strokeStyle = getThemeColor(0.25 - task.generation * 0.04);
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        if (task.isFinished) {
          if (task.generation < props.maxGenerations && task.width > 0.4) {
            const branchCount = Math.random() > 0.4 ? 2 : 1;
            for (let i = 0; i < branchCount; i++) {
              const offset = (Math.random() - 0.5) * 1.5;
              newActiveTasks.push(new BranchTask(
                task.currX, task.currY,
                task.angle + offset,
                task.width * 0.7,
                task.generation + 1,
              ));
            }
          }
        } else {
          newActiveTasks.push(task);
        }
      }

      this.activeTasks = newActiveTasks;
      if (this.activeTasks.length === 0) this.isDead = true;
    }
  }

  let trees: InkTree[] = [];
  let lastSpawnTime = 0;

  const getDistributedSpawnPoint = () => {
    if (typeof window === 'undefined') return { x: 0, y: 0, a: 0 };
    const w = window.innerWidth, h = window.innerHeight;
    const sectors = [
      { x: Math.random() * w, y: 0, a: Math.PI / 2 },
      { x: Math.random() * w, y: 0, a: Math.PI / 2 },
      { x: w, y: Math.random() * h, a: Math.PI },
      { x: w, y: Math.random() * h, a: Math.PI },
      { x: Math.random() * w, y: h, a: -Math.PI / 2 },
      { x: Math.random() * w, y: h, a: -Math.PI / 2 },
      { x: 0, y: Math.random() * h, a: 0 },
      { x: 0, y: Math.random() * h, a: 0 },
    ];
    return sectors[Math.floor(Math.random() * sectors.length)];
  };

  const animate = (time: number) => {
    if (!ctx) return;

    if (trees.length < props.maxTrees && time - lastSpawnTime > props.spawnInterval) {
      const point = getDistributedSpawnPoint();
      trees.push(new InkTree(point.x, point.y, point.a));
      lastSpawnTime = time;
    }

    trees.forEach(tree => tree.update());
    animationFrameId = requestAnimationFrame(animate);
  };

  const updateCanvasSize = (w: number, h: number) => {
    if (!canvasRef.value) return;
    const dpr = window.devicePixelRatio || 1;
    canvasRef.value.width = w * dpr;
    canvasRef.value.height = h * dpr;

    ctx = canvasRef.value.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    trees = [];
  };

  const debouncedUpdateCanvasSize = useDebounceFn((w: number, h: number) => {
    lastWidth = w;
    lastHeight = h;
    updateCanvasSize(w, h);
  }, 200);

  const handleResize = () => {
    if (!canvasRef.value || typeof window === 'undefined') return;

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    // 首次加载：同步立即初始化，不防抖
    if (lastWidth === 0 && lastHeight === 0) {
      lastWidth = currentWidth;
      lastHeight = currentHeight;
      updateCanvasSize(currentWidth, currentHeight);
      return;
    }

    // 判定尺寸变化程度
    const isWidthChanged = Math.abs(currentWidth - lastWidth) > 5;
    const isHeightChangedLarge = Math.abs(currentHeight - lastHeight) > 150;

    // 过滤移动端滚动引发的微小高度变化
    if (!isWidthChanged && !isHeightChangedLarge) {
      return;
    }

    debouncedUpdateCanvasSize(currentWidth, currentHeight);
  };

  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    animate(0);
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize);
    }
    cancelAnimationFrame(animationFrameId);
    trees = []; // 清理引用
  });
</script>

<template>
  <canvas ref="canvasRef" :class="[ns.b(),ns.e('canvas')]" />
</template>

<style scoped>
  .ca-ink-tree__canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    background: transparent;
  }
</style>