<script setup lang="ts">
  import { CaCalendar } from '@caldm/ui';
</script>

<template>
  <div class="stroke">
    <CaCalendar />
  </div>
</template>

<style scoped>
  .stroke {
    width: 90%;
    padding: var(--content-padding-M);
    margin: auto;
  }
</style>
