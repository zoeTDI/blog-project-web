<script setup lang="ts">
import LoadingBar from "@/components/loadingBar";
import {storeToRefs} from "pinia";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
const {isSwitching} = storeToRefs(useLoadingStore());
</script>

<template>
  <div class="App-container">
    <loading-bar />

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component
            :is="Component"
            v-show="!isSwitching"
            :key="$route.fullPath"
        />
      </keep-alive>

      <div v-if="isSwitching" class="loading-screen">
      </div>
    </router-view>
  </div>
</template>
