<script setup lang="ts">

import {computed} from "vue";
import md from "@/plugins/markdownIt.ts";

const props = withDefaults(defineProps<{
  content: string;
}>(), {
  content: ''
})

const renderedHtml = computed(() => {
  return md.render(props.content);
})
</script>

<template>
  <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<style>
.markdown-body {
  width: 100%;
  font-family: var(--sans);
  word-wrap: break-word;
}
</style>