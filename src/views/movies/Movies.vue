<script setup lang="ts">
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {onMounted, ref} from "vue";
import {mockApiFetch} from "@/utils/mock.ts";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {ROUTER_NAMES} from "@/router/routerNames.ts";


const loadingStore = useLoadingStore();
const mockData = [];
const baseData = ref([])

onMounted(async () => {
  baseData.value = await mockApiFetch(mockData, 800)
  loadingStore.endLoading();
})
</script>

<template>
  <div class="movies">
    <header class="page-header">
      <div class="header-wrapper">
        <h1 class="title">影视画廊</h1>
        <p class="description">这里记录了一些我追过的番。</p>
      </div>
    </header>
    <section class="movie-list">
      <ca-row :gap="20">
        <ca-col v-for="item in baseData" :key="item.id" :span="6">
          <router-link :to="{name: ROUTER_NAMES.MOVIE_DETAIL, params: {id: item.id}}">
            <img :src="item.url" :alt="item.alt" />
          </router-link>
        </ca-col>
      </ca-row>
    </section>
  </div>
</template>

<style scoped>
.movies {
  width: 100%;
  max-width: var(--content-max-width-M);
  padding: var(--content-padding-L);
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-wrapper {
  flex: 1 1 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: var(--font-h);
  margin-bottom: 16px;
  background: linear-gradient(90deg, #fff, #888);
  -webkit-background-clip: text;
}

.description {
  font-family: var(--font-text);
  font-size: 1.1rem;
  line-height: 1.6;
  color: #aaa;
}

.movie-list {
  margin-top: 60px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>