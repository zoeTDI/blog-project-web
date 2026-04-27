<script setup lang="ts">

import {computed} from "vue";
import md from "@/plugins/markdownIt.ts";

const props = withDefaults(defineProps<{
  content: string;
  theme?: 'default' | 'pink'; // 增加主题选项
  captionMode?: 'none' | 'always';
}>(), {
  content: '',
  theme: 'default',
  captionMode: 'none',
})

const renderedHtml = computed(() => {
  return md.render(props.content);
})

const containerClasses = computed(() => {
  return [
    'markdown-body',
    `theme-${props.theme}`,
    `caption-${props.captionMode}` // 动态类名：caption-none 或 caption-always
  ];
})

/**
 * 处理图片点击事件 (事件代理)
 */
const handleContentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;

  // 检查点击的是否是图片
  if (target.tagName === 'IMG') {
    const imgSrc = (target as HTMLImageElement).src;
    const imgAlt = (target as HTMLImageElement).alt;

    // 触发全屏逻辑
    openFullScreen(imgSrc, imgAlt);
  }
}

const openFullScreen = (src: string, alt: string) => {
  // 这里你可以：
  // 1. 发射一个事件给父组件（由父组件的全局 Modal 渲染）
  // 2. 或者使用现成的图片预览插件（如 v-viewer, vue-easy-lightbox）
  // 3. 这里展示一个最简单的原生逻辑：
  console.log("正在查看全屏图片:", src, alt);
  window.open(src, '_blank'); // 临时方案：在新标签页打开
}
</script>

<template>
  <div class="markdown-body"
      :class="containerClasses"
      v-html="renderedHtml"
      @click="handleContentClick"
  ></div>
</template>

<style>
.markdown-body {
  width: 100%;
  font-family: var(--sans);
  word-wrap: break-word;
}

.markdown-body img {
  cursor: zoom-in;
}
</style>