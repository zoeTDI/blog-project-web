<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;

// --- 配置参数 ---
const CONFIG = {
  branchColor: (alpha: number) => getThemeColor(alpha),
  maxTrees: 5,            // 同时存在的树的数量
  maxGenerations: 5,      // 最大分枝代数
  minBranchLen: 15,       // 每个小节的最小长度
  maxBranchLen: 30,       // 每个小节的最大长度
  spawnInterval: 3000,    // 新树生成的最小间隔（毫秒）
};

// --- 工具函数：获取主题色 ---
const getThemeColor = (alpha = 0.15) => {
  if (typeof window === 'undefined') return `rgba(128, 128, 128, ${alpha})`;
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();
  if (textColor.startsWith('#')) {
    const r = parseInt(textColor.slice(1, 3), 16), g = parseInt(textColor.slice(3, 5), 16), b = parseInt(textColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(120, 120, 120, ${alpha})`;
};

// --- 单个分枝任务类 ---
class BranchTask {
  startX: number; startY: number;
  currX: number; currY: number;
  angle: number; width: number;
  targetLen: number; currLen: number = 0;
  generation: number;
  isFinished: boolean = false;

  constructor(x: number, y: number, angle: number, width: number, gen: number) {
    this.startX = this.currX = x;
    this.startY = this.currY = y;
    this.angle = angle;
    this.width = width;
    this.generation = gen;
    this.targetLen = CONFIG.minBranchLen + Math.random() * (CONFIG.maxBranchLen - CONFIG.minBranchLen);
  }

  step(speed: number) {
    if (this.isFinished) return null;

    const prevX = this.currX;
    const prevY = this.currY;

    // 增加一点自然弯曲
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

// --- 树类：管理自己的生长顺序 ---
class InkTree {
  tasks: BranchTask[] = [];
  activeTasks: BranchTask[] = []; // 当前正在生长的分枝
  isDead: boolean = false;

  constructor(x: number, y: number, angle: number) {
    // 初始主干
    const root = new BranchTask(x, y, angle, 2.5, 0);
    this.activeTasks.push(root);
  }

  update() {
    if (this.isDead) return;

    const newActiveTasks: BranchTask[] = [];

    for (const task of this.activeTasks) {
      const pos = task.step(0.8); // 生长速度
      if (pos && ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.prevX, pos.prevY);
        ctx.lineTo(pos.currX, pos.currY);
        ctx.lineWidth = task.width;
        ctx.strokeStyle = CONFIG.branchColor(0.25 - task.generation * 0.04);
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      if (task.isFinished) {
        // 当一个任务结束时，根据逻辑生成下一代分枝任务
        if (task.generation < CONFIG.maxGenerations && task.width > 0.4) {
          // 概率产生 1 或 2 个分枝
          const branchCount = Math.random() > 0.4 ? 2 : 1;
          for (let i = 0; i < branchCount; i++) {
            const offset = (Math.random() - 0.5) * 1.5;
            newActiveTasks.push(new BranchTask(
                task.currX, task.currY,
                task.angle + offset,
                task.width * 0.7,
                task.generation + 1
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

// --- 解决点位集中问题：区域分配 ---
const getDistributedSpawnPoint = () => {
  const w = window.innerWidth, h = window.innerHeight;
  // 将四周分为 8 个区域
  const sectors = [
    { x: Math.random() * w, y: 0, a: Math.PI / 2 },     // 顶1
    { x: Math.random() * w, y: 0, a: Math.PI / 2 },     // 顶2
    { x: w, y: Math.random() * h, a: Math.PI },         // 右1
    { x: w, y: Math.random() * h, a: Math.PI },         // 右2
    { x: Math.random() * w, y: h, a: -Math.PI / 2 },    // 底1
    { x: Math.random() * w, y: h, a: -Math.PI / 2 },    // 底2
    { x: 0, y: Math.random() * h, a: 0 },               // 左1
    { x: 0, y: Math.random() * h, a: 0 },               // 左2
  ];

  // 简单逻辑：随机选一个区域，但避免和现有树太近
  return sectors[Math.floor(Math.random() * sectors.length)];
};

const animate = (time: number) => {
  if (!ctx) return;

  // 尝试生成新树
  if (trees.length < CONFIG.maxTrees && time - lastSpawnTime > CONFIG.spawnInterval) {
    const point = getDistributedSpawnPoint();
    trees.push(new InkTree(point.x, point.y, point.a));
    lastSpawnTime = time;
  }

  // 更新所有树
  trees.forEach(tree => tree.update());
  // 移除生长完毕的树（可以加一个淡出逻辑，或者直接留在画布上）
  // trees = trees.filter(t => !t.isDead);
  // 注：如果不 filter，树干会一直留在 canvas 上，直到下次 resize 清空

  animationFrameId = requestAnimationFrame(animate);
};

const handleResize = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
    trees = []; // Resize 时清空重绘
  }
};

onMounted(() => {
  ctx = canvasRef.value?.getContext('2d') || null;
  handleResize();
  window.addEventListener('resize', handleResize);
  animate(0);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <canvas ref="canvasRef" class="ca-ink-tree-canvas" />
</template>

<style scoped>
.ca-ink-tree-canvas {
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