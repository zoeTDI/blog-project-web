<script setup lang="ts">
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {onMounted} from "vue";

const loadingStore = useLoadingStore();

onMounted(() => {
  loadingStore.endLoading()
})
</script>

<template>
<div class="management-page">
  <h2>management-page</h2>
</div>
</template>

<style scoped>

</style>