<script setup lang="ts">
  import type { CaBreadcrumbEmits, CaBreadcrumbItem, CaBreadcrumbProps } from './types.ts';
  import { ChevronDoubleRightIcon } from '@heroicons/vue/24/outline';
  import CaIcon from '../../../icon/src/icon.vue';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';

  defineOptions({
    name: 'CaBreadcrumb',
  });

  const props = withDefaults(defineProps<CaBreadcrumbProps>(), {
    items: () => [],
    preferences: () => ({
      enable: true,
      showIcon: true,
      styleType: 'normal',
    }),
  });

  const ns = useCSSNamespace('breadcrumb');

  const classes = computed(() => {
    const cls: string[] = [ns.b()];
    return cls;
  });

  const emits = defineEmits<CaBreadcrumbEmits>();

  const handleItemClick = (item: CaBreadcrumbItem, index: number) => {
    emits('click', item, index);
  };
</script>

<template>
  <nav
    :class="classes"
    v-if="props.preferences?.enable">
    <ol
      :class="ns.e('list')"
      v-if="props.items.length > 1">
      <li
        :class="ns.e('item')"
        v-for="(item, index) in props.items"
        :key="item.to || index">
        <span
          :class="[
            ns.e('text'),
            ns.is('last', index === props.items.length - 1),
            ns.m(props.preferences?.styleType),
          ]"
          @click="handleItemClick(item, index)">
          <CaIcon
            :class="ns.e('icon')"
            v-if="item.prefixIcon && props.preferences?.showIcon"
            :icon="item.prefixIcon" />

          {{ item.label }}

          <CaIcon
            :class="ns.e('icon')"
            v-if="item.suffixIcon && props.preferences?.showIcon"
            :icon="item.suffixIcon" />
        </span>
        <div
          :class="ns.e('suffix')"
          v-if="index !== props.items.length - 1">
          <CaIcon :icon="ChevronDoubleRightIcon" />
        </div>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
  /* BEM 规范下的 CSS 选择器重构 */
  .ca-breadcrumb__list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .ca-breadcrumb__item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ca-breadcrumb__text {
    display: flex;
    align-items: center;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    cursor: pointer;
    transition: all ease 150ms;
    padding: 4px 8px;
  }

  .ca-breadcrumb__icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  .ca-breadcrumb__suffix {
    width: 16px;
    height: 16px;
    margin: auto 4px;
  }

  .ca-breadcrumb__text::after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 2px;
    border-radius: 1px;
    transition: width ease 150ms;
    background-color: var(--color-accent);
    bottom: -2px;
    left: 0;
  }

  /* 最后一个元素的背景模式修饰符 */
  .ca-breadcrumb__text.is-last.ca-breadcrumb--background {
    background-color: color-mix(in srgb, var(--color-accent) 60%, transparent);
  }

  .ca-breadcrumb__text:not(.is-last):hover {
    color: var(--color-accent);
    transform: translateY(-4px);
  }

  .ca-breadcrumb__text:not(.is-last):hover::after {
    width: 100%;
  }
</style>