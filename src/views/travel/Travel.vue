<script setup lang="ts">
import ChinaMap from "@/views/travel/src/ChinaMap.vue";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {onMounted} from "vue";
const loadingStore = useLoadingStore();

onMounted(() => {
  loadingStore.endLoading()
})
</script>

<template>
<div class="travel">
  <h2>我的足迹</h2>
  <china-map />
</div>
</template>

<style scoped>
.travel {
  width: 100%;
  max-width: var(--content-max-width-L);
  padding: var(--content-padding-M);
  margin: 0 auto;
}
</style>