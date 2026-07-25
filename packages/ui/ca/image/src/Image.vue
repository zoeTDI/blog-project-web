<script setup lang="ts">
  import type { CaImageProps } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, ref } from 'vue';
  import CaImageViewer from './Viewer.vue';

  defineOptions({
    name: 'CaImage',
  });

  const props = withDefaults(defineProps<CaImageProps>(), {
    alt: '',
    preview: true,
    previewAppendTo: 'body',
  });

  const ns = useCSSNamespace('image');
  const viewerRef = ref<InstanceType<typeof CaImageViewer> | null>(null);

  const classes = computed(() => {
    const cls: string[] = [ns.b()];
    if (props.preview) {
      cls.push(ns.m('previewable'));
    }
    return cls;
  });

  const handleImageClick = () => {
    console.clear();
    console.log('🚀 ~ handleImageClick ~ viewerRef.value: ', viewerRef.value);
    if (props.preview) {
      viewerRef.value?.open();
    }
  };
</script>

<template>
  <div
    :class="classes"
  >
    <img
      :src="src"
      :alt="alt"
      :class="ns.e('inner')"
      @click="handleImageClick"
    />

    <CaImageViewer
      ref="viewerRef"
      :url="src"
      :append-to="previewAppendTo"
    />
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

  .ca-image__inner {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: opacity 0.3s ease;
  }

  .ca-image--previewable {
    cursor: pointer;
  }

  .ca-image--previewable:hover {
    border-color: var(--color-border-accent);
    box-shadow: 0 0 0 2px var(--color-bg-hover-accent);
  }

  .ca-image--previewable:hover .ca-image__inner {
    opacity: 0.85;
  }
</style>