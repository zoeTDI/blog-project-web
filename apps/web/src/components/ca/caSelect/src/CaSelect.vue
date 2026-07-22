<script setup lang="ts">
  import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
  import { useCSSNamespace } from '@caldm/hook';
  import {
    CaSelectDropdown,
    caSelectKey,
    caSelectStyleKey,
    type CaSelectProps,
  } from '@/components/ca/caSelect';

  const props = withDefaults(defineProps<CaSelectProps>(), {
    disabled: false,
    placeholder: 'Select',
    size: 'M',
  });

  const model = defineModel<string | number | boolean | undefined>({
    default: '',
  });
  const ns = useCSSNamespace('select');

  const selectRef = ref<HTMLElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);

  const visible = ref<boolean>(false);
  const displayLabel = ref<string>('');
  const placement = ref<'bottom' | 'top'>('bottom');
  const selectWidth = ref<number>(0);
  let resizeObserver: ResizeObserver | null = null;

  const updateWidth = () => {
    if (selectRef.value) {
      selectWidth.value = selectRef.value.offsetWidth;
    }
  };

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(props.size),
      ns.is('disabled', props.disabled),
    ];
    return cls;
  });

  const selectOption = (value: any, label: string) => {
    model.value = value;
    displayLabel.value = label;
    visible.value = false;
  };

  const adjustPlacement = () => {
    if (!selectRef.value) return;

    const rect = selectRef.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const dropdownMaxHeight = 240;
    const spaceBelow = windowHeight - rect.bottom;

    if (spaceBelow < dropdownMaxHeight && rect.top > spaceBelow) {
      placement.value = 'top';
    } else {
      placement.value = 'bottom';
    }
  };

  provide(caSelectKey, { selectOption, selectedValue: model });
  provide(caSelectStyleKey, { selectWidth, placement });

  const handleInputClick = () => {
    if (props.disabled) return;
    adjustPlacement();
    updateWidth();
    visible.value = true;
  };

  const dropdownVisibleControl = (e: Event) => {
    const targetEl = e.target as HTMLElement;
    if (!targetEl || !selectRef.value) return;

    // 如果点击的位置不在当前 select 内部，则关闭下拉框
    const isClickInside = selectRef.value.contains(targetEl);
    if (!isClickInside) {
      visible.value = false;
    }
  };

  onMounted(() => {
    window.addEventListener('click', dropdownVisibleControl, true);
    window.addEventListener('resize', adjustPlacement);

    if (selectRef.value) {
      updateWidth();
      resizeObserver = new ResizeObserver(() => {
        updateWidth();
      });
      resizeObserver.observe(selectRef.value);
    }
  });

  onUnmounted(() => {
    window.removeEventListener('click', dropdownVisibleControl, true);
    window.removeEventListener('resize', adjustPlacement);

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });
</script>

<template>
  <div
    ref="selectRef"
    :class="classes">
    <input
      :disabled="props.disabled"
      ref="inputRef"
      type="text"
      :class="[ns.e('input')]"
      v-bind:value="model"
      :placeholder="props.placeholder"
      @click="handleInputClick" />
    <CaSelectDropdown v-show="visible && !props.disabled">
      <slot />
    </CaSelectDropdown>
  </div>
</template>

<style scoped>
  @import '../styles/style.css';
</style>
