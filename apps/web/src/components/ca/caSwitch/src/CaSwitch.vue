<script setup lang="ts">
  import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    type Ref,
    ref,
    watch,
  } from 'vue';
  import type { SwitchOption } from './types.ts';
  import type { ComponentSize } from '#/component.ts';

  const props = withDefaults(
    defineProps<{
      options?: SwitchOption[];
      prefix?: string;
      mode?: 'full' | 'icon';
      size?: ComponentSize; // 新增 size 属性
    }>(),
    {
      options: () => [],
      mode: 'icon',
      prefix: '',
      size: 'M',
    }
  );

  const model = defineModel<string>({ default: '' });

  const SIZE_MAP = {
    s: 16,
    m: 20,
    l: 24,
  };

  const slideRef = ref<HTMLElement | null>(null);
  const slideShadowRef = ref<HTMLElement | null>(null);
  const caSwitchRef = ref<HTMLElement | null>(null);

  let observer: IntersectionObserver | null = null;

  const size = computed(() => {
    const key = props.size.toUpperCase();
    return key in SIZE_MAP ? SIZE_MAP[key as keyof typeof SIZE_MAP] : 20;
  });

  const moveSlide = (targetEl: HTMLElement, el: Ref) => {
    const container = targetEl.closest('.ca-switch')!.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const left = targetRect.left - container?.left;
    const width = targetRect.width;
    el.value.style.left = `${left}px`;
    el.value.style.width = `${width}px`;
  };

  const toggle = (val: string, target: HTMLElement) => {
    model.value = val;
    if (slideRef.value) {
      moveSlide(target, slideRef);
      slideRef.value.style.opacity = '1';
    }
  };

  const handleMouseover = (target: HTMLElement) => {
    if (!slideShadowRef.value) return;
    moveSlide(target, slideShadowRef);
    slideShadowRef.value.style.opacity = '1';
    slideShadowRef.value.classList.add('squeezz');
  };

  const handleMouseout = () => {
    if (!slideShadowRef.value) return;
    slideShadowRef.value.style.opacity = '0';
    slideShadowRef.value.classList.remove('squeeze');
  };

  const updateActiveSlide = async () => {
    await nextTick();
    if (model.value && caSwitchRef.value) {
      const index = props.options.findIndex((o) => o.value === model.value);
      if (index === -1) return;
      const activeOption = caSwitchRef.value.querySelector(
        `.option:nth-child(${index + 3})`
      ) as HTMLElement;
      if (activeOption && activeOption.getBoundingClientRect().width > 0) {
        moveSlide(activeOption, slideRef);
        if (slideRef.value) slideRef.value.style.opacity = '1';
      }
    }
  };

  watch(
    () => model.value,
    () => {
      updateActiveSlide();
    },
    { immediate: true }
  );

  onMounted(async () => {
    if (caSwitchRef.value) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateActiveSlide();
          }
        });
      });
      observer.observe(caSwitchRef.value);
    }
  });
  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  });
</script>

<template>
  <div
    class="ca-switch"
    ref="caSwitchRef">
    <div
      class="slide"
      ref="slideRef"></div>
    <div
      class="slide-shadow"
      ref="slideShadowRef"></div>
    <div
      class="option"
      :class="{ 'is-active': model === option.value }"
      v-for="option in props.options"
      :key="option.value"
      @click="toggle(option.value, $event.currentTarget as HTMLElement)"
      @mouseover="handleMouseover($event.currentTarget as HTMLElement)"
      @mouseout="handleMouseout">
      <div
        class="icon"
        :style="{ width: size + 'px', height: size + 'px' }"
        v-if="option.icon">
        <component :is="option.icon" />
      </div>
      <div
        class="label"
        v-if="props.mode === 'full'">
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ca-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    border-radius: 5000em;
    padding: 2px 4px;

    background: var(--color-bg);

    overflow-x: auto;
    white-space: nowrap;

    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ca-switch::-webkit-scrollbar {
    display: none;
  }

  .ca-switch > div {
    flex-shrink: 0;
  }

  .slide,
  .slide-shadow {
    border-radius: 5000em;
    position: absolute;
    display: inline-block;
    height: 100%;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1.05);
  }

  .slide {
    z-index: 2;
    background-color: color-mix(in srgb, var(--color-accent) 75%, transparent);
  }

  .slide-shadow {
    opacity: 0;
    z-index: 1;

    background-color: color-mix(in srgb, var(--color-accent) 50%, transparent);
    box-shadow: 0 0 20px #ffffffaa inset;
  }

  .option {
    padding: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    z-index: 3;
    flex-shrink: 0;
    gap: 8px;
  }

  .option.is-active {
    color: #fff;
  }

  .squeeze {
    transform: scale(0.9);
  }
</style>
