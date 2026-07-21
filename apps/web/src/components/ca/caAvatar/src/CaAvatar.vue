<script setup lang="ts">
  import { computed } from 'vue';
  import {parseToHexColor} from '@caldm/utils';
  import {
    type CaAvatarProps,
    type DotColor,
    DotColorMap,
  } from '@/components/ca/caAvatar';

  const props = withDefaults(defineProps<CaAvatarProps>(), {
    radius: 50,
    size: 80,
    dotColor: 'green',
    showDot: false,
    hideLargeNumber: false,
    dots: () => [],
  });

  const normalizedDots = computed(() => {
    if (!props.showDot) return [];
    return Array.isArray(props.dots) ? props.dots : [props.dots];
  });

  const resolveColor = (color?: DotColor | string) => {
    const c = color || 'green';
    return (
      (DotColorMap as Record<string, string>)[c] ||
      parseToHexColor(c) ||
      DotColorMap.green
    );
  };

  const formatContent = (content: string | number) => {
    if (!props.hideLargeNumber || typeof content !== 'number') {
      return { text: content, isPlus: false };
    }
    return content > 99
      ? { text: 99, isPlus: true }
      : { text: content, isPlus: false };
  };

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
      class="ca-avatar_wrapper"
      :style="{ width: `${size}px`, height: `${size}px` }">
      <div
        class="ca-avatar_container"
        :style="{
          borderRadius: typeof radius === 'number' ? `${radius}%` : `none`,
        }">
        <img
          :src="url"
          :alt="alt"
          @error="handleError" />
      </div>

      <span
        v-for="(dot, index) in normalizedDots"
        :key="index"
        class="dot"
        :style="{
          backgroundColor: resolveColor(dot.color),
          top: dot.position === 'top-right' ? '0' : 'auto',
          bottom: dot.position === 'bottom-right' ? '0' : 'auto',
          right: '0',
        }">
        <span
          class="dot-content"
          v-if="dot.content">
          {{ formatContent(dot.content).text }}
          <sup
            v-if="formatContent(dot.content).isPlus"
            class="plus-sign"
            >+</sup
          >
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
  .ca-avatar_wrapper {
    position: relative;
    display: inline-block;
  }

  .ca-avatar_container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 2px solid var(--color-border);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .dot {
    position: absolute;
    right: 0;
    width: clamp(8px, 25%, 48px);
    height: clamp(8px, 25%, 48px);
    border-radius: 50%;
    z-index: 20;
    border: 2px solid var(--color-container-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .dot-content {
    font-size: clamp(6px, 0.6em, 10px);
    color: white;
    font-weight: bold;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plus-sign {
    font-size: 0.7em;
    margin-top: -0.5em;
    margin-left: 1px;
  }
</style>
