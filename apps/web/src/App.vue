<script setup lang="ts">
  import LoadingBar from '@/components/loadingBar';
  import SplashScreen from '@/components/splashScreen';
  import { preferences } from '@/core/preferences'
</script>

<template>
  <div class="App-container">
    <loading-bar />
    <router-view />
    <!-- 只在 App 挂载时播放一次，站内路由切换不会重播 -->
    <splash-screen v-if="preferences.transition.splashScreen" />
  </div>
</template>
