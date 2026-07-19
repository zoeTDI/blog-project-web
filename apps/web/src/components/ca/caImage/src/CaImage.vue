<script setup lang="ts">
  import { type CaImageProps, CaImageViewer } from '@/components/ca/caImage';
  import { ref } from 'vue';

  const props = withDefaults(defineProps<CaImageProps>(), {
    alt: '',
    preview: true,
  });

  const viewerRef = ref<InstanceType<typeof CaImageViewer> | null>(null);
  const handleImageClick = () => {
    if (props.preview) {
      viewerRef.value?.open();
    }
  };
</script>

<template>
  <div
    class="ca-image"
    :class="{ 'is-previewable': preview }">
    <img
      :src="src"
      :alt="alt"
      @click="handleImageClick" />

    <ca-image-viewer
      ref="viewerRef"
      :url="src" />
  </div>
</template>

<style scoped>
  .ca-image {
    display: inline-flex;
    overflow: hidden;
    border: 1px solid var(--color-border);
    background-color: var(--color-context-bg);
    transition: all 0.3s ease;
  }

  .ca-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.3s ease;
  }

  .ca-image.is-previewable {
    cursor: pointer;
  }

  .ca-image.is-previewable:hover {
    border-color: var(--color-border-accent);
    box-shadow: 0 0 0 2px var(--color-bg-hover-accent);
  }

  .ca-image.is-previewable:hover img {
    opacity: 0.85;
  }
</style>
