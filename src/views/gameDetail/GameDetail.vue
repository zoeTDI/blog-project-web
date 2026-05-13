<script setup lang="ts">
import {onMounted} from "vue";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
const loadingStore = useLoadingStore()
onMounted(() => {
  loadingStore.endLoading()
})
</script>

<template>
<div class="game-detail"></div>
</template>

<style scoped>

</style>