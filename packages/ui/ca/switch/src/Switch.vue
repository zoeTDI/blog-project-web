<script setup lang="ts">
  import type { CaSwitchProps } from './types.ts';
  import { CaSwitchMode } from './constants.ts';
  import { computed, nextTick, onMounted, onUnmounted, type Ref, ref, watch } from 'vue';
  import type { BaseData } from '#/data.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import CaIcon from '../../../icon/src/icon.vue';

  const ICON_SIZE_MAP = {
    S: 14,
    M: 18,
    L: 20,
  } as const;

  defineOptions({
    name: 'CaSwitch',
  });

  const model = defineModel<BaseData>({ default: undefined });

  const props = withDefaults(defineProps<CaSwitchProps>(), {
    options: () => [],
    mode: CaSwitchMode.ICON,
    prefix: '',
    size: 'M',
  });

  const ns = useCSSNamespace('switch');

  const slideRef = ref<HTMLElement | null>(null);
  const slideShadowRef = ref<HTMLElement | null>(null);
  const caSwitchRef = ref<HTMLElement | null>(null);

  let observer: IntersectionObserver | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let rafId: number | null = null;

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(props.mode),
      ns.m(props.size),
    ];
    return cls;
  });

  const iconSize = computed(() => {
    return ICON_SIZE_MAP[props.size] ?? 18;
  });

  const moveSlide = (targetEl: HTMLElement, el: Ref) => {
    if (!caSwitchRef.value || !el.value) return;

    const containerRect = targetEl.closest('.ca-switch')!.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const left = targetRect.left - containerRect.left;
    const width = targetRect.width;

    el.value.style.left = `${left}px`;
    el.value.style.width = `${width}px`;
    requestAnimationFrame(() => {
      if (el.value) {
        el.value.style.left = `${left}px`;
        el.value.style.width = `${width}px`;
      }
    });
  };

  const toggle = (val: string | number | symbol, target: HTMLElement) => {
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
    slideShadowRef.value.classList.add('squeeze');
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
        `.${ns.e('option')}.${ns.is('active')}`,
      ) as HTMLElement;
      if (activeOption && activeOption.getBoundingClientRect().width > 0) {
        moveSlide(activeOption, slideRef);
        requestAnimationFrame(() => {
          if (slideRef.value) slideRef.value.style.opacity = '1';
        });
      }
    }
  };

  const scheduleUpdateActiveSlide = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      updateActiveSlide();
      rafId = null;
    });
  };

  watch(
    [
      () => model.value,
      () => props.size,
      () => props.mode,
    ],
    () => {
      scheduleUpdateActiveSlide();
    },
    { immediate: true },
  );

  onMounted(async () => {
    if (caSwitchRef.value) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scheduleUpdateActiveSlide();
          }
        });
      });
      observer.observe(caSwitchRef.value);

      resizeObserver = new ResizeObserver(() => {
        scheduleUpdateActiveSlide();
      });
      resizeObserver.observe(caSwitchRef.value);
    }
  });
  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });
</script>

<template>
  <div :class="classes"
       ref="caSwitchRef">
    <div :class="ns.e('slide')"
         ref="slideRef"></div>
    <div :class="ns.e('slide-shadow')"
         ref="slideShadowRef"></div>
    <div v-for="option in props.options"
         :key="option.value"
         :class="[
           ns.e('option'),
           ns.is('active', model === option.value)
         ]"
         @click="toggle(option.value, $event.currentTarget as HTMLElement)"
         @mouseover="handleMouseover($event.currentTarget as HTMLElement)"
         @mouseout="handleMouseout">
      <CaIcon v-if="option?.icon"
              :icon="option.icon"
              :size="iconSize" />
      <div :class="ns.e('label')"
           v-if="props.mode === 'full'">
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ca-switch {
    --ca-switch-height: 32px;
    --ca-switch-padding: 3px;
    --ca-switch-icon-size: 18px;
    --ca-switch-font-size: 14px;
    --ca-switch-gap: 6px;

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    height: var(--ca-switch-height);
    padding: var(--ca-switch-padding);
    border-radius: 5000em;
    background: var(--color-bg);
    box-sizing: border-box;

    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ca-switch::-webkit-scrollbar {
    display: none;
  }

  .ca-switch--S {
    --ca-switch-height: 26px;
    --ca-switch-padding: 2px;
    --ca-switch-icon-size: 14px;
    --ca-switch-font-size: 12px;
    --ca-switch-gap: 4px;
  }

  .ca-switch--M {
    --ca-switch-height: 32px;
    --ca-switch-padding: 3px;
    --ca-switch-icon-size: 18px;
    --ca-switch-font-size: 14px;
    --ca-switch-gap: 6px;
  }

  .ca-switch--L {
    --ca-switch-height: 38px;
    --ca-switch-padding: 4px;
    --ca-switch-icon-size: 20px;
    --ca-switch-font-size: 16px;
    --ca-switch-gap: 8px;
  }

  .ca-switch > div {
    flex-shrink: 0;
  }

  .ca-switch__slide,
  .ca-switch__slide-shadow {
    position: absolute;
    top: var(--ca-switch-padding);
    height: calc(100% - var(--ca-switch-padding) * 2);
    border-radius: 5000em;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1.05);
    box-sizing: border-box;
  }

  .ca-switch__slide {
    z-index: 2;
    background-color: color-mix(in srgb, var(--color-accent) 75%, transparent);
  }

  .ca-switch__slide-shadow {
    opacity: 0;
    z-index: 1;

    background-color: color-mix(in srgb, var(--color-accent) 50%, transparent);
    box-shadow: 0 0 20px #ffffffaa inset;
  }

  .ca-switch__option {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - var(--ca-switch-padding) * 2);
    padding: 0 8px;
    gap: var(--ca-switch-gap);
    font-size: var(--ca-switch-font-size);
    cursor: pointer;
    border-radius: 1000em;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .ca-switch--icon .ca-switch__option {
    width: calc(var(--ca-switch-height) - var(--ca-switch-padding) * 2);
    padding: 0;
  }

  .ca-switch__option.is-active {
    color: #fff;
  }

  .squeeze {
    transform: scale(0.9);
  }
</style>