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
</script>

<template>
  <div class="markdown-body"
      :class="containerClasses"
      v-html="renderedHtml"
  ></div>
</template>

<style>
.markdown-body {
  width: 100%;
  font-family: var(--sans);
  word-wrap: break-word;
}
</style>