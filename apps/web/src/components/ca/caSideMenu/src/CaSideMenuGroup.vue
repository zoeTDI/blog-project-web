<script setup lang="ts">
  import { useCSSNamespace } from '@/hooks/useCSSNamespace.ts';
  import { computed, type CSSProperties, inject, ref, useSlots } from 'vue';
  import { isArray } from '@/utils/isFu.ts';
  import {
    caSideMenuKey,
    DefaultOptionHeight,
    type MenuItem,
  } from '@/components/ca/caSideMenu';
  import { useRouter } from 'vue-router';

  const props = withDefaults(
    defineProps<{
      active?: boolean;
      label?: string;
      menuInfo?: MenuItem;
    }>(),
    {
      active: false,
      label: '',
    }
  );

  const { optionHeight } = inject(caSideMenuKey, {
    optionHeight: computed(() => DefaultOptionHeight),
  });

  const slots = useSlots();
  const router = useRouter();
  const ns = useCSSNamespace('side-menu-group');

  const isExpand = ref<boolean>(props.active);

  const handleClick = () => {
    if (
      props.menuInfo &&
      isArray(props.menuInfo.children) &&
      (props.menuInfo.children as MenuItem[]).length > 0
    ) {
      isExpand.value = !isExpand.value;
      return;
    }
    if (props.menuInfo) {
      router.push({
        name: props.menuInfo.name,
      });
    }
  };

  const classes = computed(() => {
    const cls: string[] = [ns.b(), ns.is('expand', isExpand.value)];
    return cls;
  });

  const styles = computed(() => {
    const _ = {
      'option-height': `${optionHeight.value}px`,
      height: '0px',
    };

    if (!slots.default) {
      return ns.cssVarBlock(_) as CSSProperties;
    }
    const defaultValue = slots.default();
    if (defaultValue.length < 1) {
      return ns.cssVarBlock(_) as CSSProperties;
    }
    const height = defaultValue.reduce((pre, cur) => {
      if (isArray(cur.children)) {
        pre += (cur.children as Array<any>).length * optionHeight.value;
      }
      return pre;
    }, 0);
    _.height = `${height}px`;
    return ns.cssVarBlock(_) as CSSProperties;
  });
</script>

<template>
  <div
    :class="classes"
    :style="styles">
    <div
      :class="[ns.e('label-container')]"
      @click="handleClick">
      <div :class="[ns.s('prefix')]">
        <slot name="prefix" />
      </div>
      <div :class="[ns.e('content')]">
        {{ props.label }}
      </div>
      <div :class="[ns.s('suffix')]">
        <slot name="suffix" />
      </div>
    </div>
    <div :class="[ns.e('submenu')]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  @import '../styles/caSideMenuGroup.css';
</style>
