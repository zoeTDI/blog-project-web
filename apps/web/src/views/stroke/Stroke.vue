<script setup lang="ts">
  import Calendar from '@/components/calendar/src/Calendar.vue';
</script>

<template>
  <div class="stroke">
    <calendar />
  </div>
</template>

<style scoped>
  .stroke {
    width: 90%;
    padding: var(--content-padding-M);
    margin: auto;
  }
</style>
