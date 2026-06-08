<script setup lang="ts">

import {preferenceManager, preferences} from "@/core/preferences";
import {CaButton} from "@/components/ca/caButton";

function fn() {
  preferenceManager.updatePreferences({transition: {progress: !preferences.transition.progress}})
}
</script>

<template>
  <div class="management-page">
    <h3>仪表盘</h3>
    <ca-button @click="fn">{{preferences.transition.progress}}</ca-button>
  </div>
</template>

<style scoped>
.management-page {
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  min-height: 100%;
}
</style>