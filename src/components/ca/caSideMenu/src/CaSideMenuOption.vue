<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed } from 'vue';
  import {
    type LocationQueryRaw,
    type RouteParamsRaw,
    useRouter,
  } from 'vue-router';
  import { isString } from '@/utils/isFu.ts';

  const router = useRouter();
  const ns = useCSSNamespace('side-menu-option');

  const props = withDefaults(
    defineProps<{
      active?: boolean;
      routePath?: string;
      routeName?: string;
      params?: RouteParamsRaw;
      query?: LocationQueryRaw;
    }>(),
    {
      active: false,
      params: () => ({}),
      query: () => ({}),
    }
  );

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.is('active', props.active)];
    return cls;
  });

  const handleClick = () => {
    if (isString(props?.routeName)) {
      router.push({
        name: props.routeName,
        params: props.params,
        query: props.query,
      });
      return;
    }
    if (isString(props.routePath)) {
      router.push({ path: props.routePath, query: props.query });
    }
  };
</script>

<template>
  <div
    :class="classes"
    @click="handleClick">
    <div :class="[ns.s('prefix')]">
      <slot name="prefix" />
    </div>
    <div :class="[ns.s('content')]">
      <slot />
    </div>
    <div :class="[ns.s('suffix')]">
      <slot name="suffix" />
    </div>
  </div>
</template>

<style scoped>
  @import '../styles/caSideMenuOption.css';
</style>
