<script setup lang="ts">

import {computed} from "vue";
import md from "@/plugins/markdownIt.ts";

const props = withDefaults(defineProps<{
  content: string;
  theme?: 'default' | 'pink'; // 增加主题选项
}>(), {
  content: '',
  theme: 'default'
})

const renderedHtml = computed(() => {
  return md.render(props.content);
})

const themeClass = computed(() => {
  return `theme-${props.theme}`;
})
</script>

<template>
  <div class="markdown-body"
      :class="themeClass"
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