<script setup lang="ts">
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {onMounted} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const loadingStore = useLoadingStore();

const fetchSearchResult = async (params: object) => {
  console.log(JSON.stringify(params, null, 2));
}

const handleRouteQueryParams = async () => {
  const _ = {...route.query};
  if (!('src' in _)) _.src = 'unknown';
  if (!('sort' in _)) _.sort = 'created_at';
  if (!('timestamp' in _)) _.sort = new Date().getTime().toString();
  if (!('q' in _)) _.q = '';
  await fetchSearchResult(_);
}

onMounted(async () => {
  await handleRouteQueryParams();
  loadingStore.endLoading();
})
</script>

<template>

</template>

<style scoped>

</style>