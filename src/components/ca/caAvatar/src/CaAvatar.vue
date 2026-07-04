<script setup lang="ts">
  interface Props {
    radius?: number;
    alt?: string;
    url: string;
    errorUrl?: string;
    size?: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    radius: 50,
    size: 80,
  });
  const handleError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    if (target) {
      target.src =
        props.errorUrl ||
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Panda';
    }
  };
</script>

<template>
  <div class="ca-avatar">
    <div
      class="ca-avatar_container"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: typeof radius === 'number' ? `${radius}%` : `none`,
      }">
      <img
        :src="url"
        :alt="alt"
        @error="handleError" />
    </div>
  </div>
</template>

<style scoped>
  .ca-avatar_container {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border: 2px solid var(--color-border);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
