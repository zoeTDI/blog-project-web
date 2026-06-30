<script setup lang="ts">
  import { BigCalendar } from '@/components/calendar';
</script>

<template>
  <div class="stroke">
    <big-calendar />
  </div>
</template>

<style scoped>
  .stroke {
    width: 90%;
    padding: var(--content-padding-M);
    margin: auto;
  }
</style>
