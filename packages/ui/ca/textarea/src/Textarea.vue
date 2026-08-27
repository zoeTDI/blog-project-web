<script setup lang="ts">
  import { useCSSNamespace } from '@caldm/hook';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import type { CaTextareaEmits, CaTextareaProps } from './types.ts';
  import { isNumber, isString } from '@caldm/utils';

  defineOptions({
    name: 'CaTextarea',
  });
  const props = withDefaults(defineProps<CaTextareaProps>(), {
    radius: false,
    border: true,
    size: 'M',
    resize: false,
    horizontal: false,
    vertical: false,
    minlength: undefined,
    maxlength: undefined,
    disabled: false,
    readonly: false,
  });
  const emits = defineEmits<CaTextareaEmits>();
  const model = defineModel({ default: '' });

  const ns = useCSSNamespace('field');

  const fieldRef = ref<HTMLDivElement | null>(null);
  const innerRef = ref<HTMLTextAreaElement | null>(null);
  let resizeObserver: ResizeObserver | null = null;

  const active = ref<boolean>(false);
  const innerSize = ref<{ w: number; h: number } | null>(null);
  const isResizedWidth = ref(false);
  const isResizedHeight = ref(false);

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.m(`size-${props.size}`),
      ns.is('focus', active.value),
      ns.is('radius', !!props.radius),
      ns.is('border', props.border),
      ns.is('resize', props.resize),
      ns.is('horizontal', props.horizontal),
      ns.is('vertical', props.vertical),
      ns.is('disabled', props.disabled),
      ns.is('readonly', props.readonly),
      ns.is('length-error', modelLengthError.value),
    ];
    return cls;
  });
  const styles = computed(() => {
    const sty: Record<string, string> = {};

    // ================= 宽度处理 =================
    // 如果已手动拖拽宽度，优先使用 innerSize 更新外层 width
    if (isResizedWidth.value
      && innerSize.value
      && isNumber(innerSize.value.w)
      && (props.horizontal || props.resize)
    ) {
      sty['width'] = `${getWidth(innerSize.value.w)}px`;
      sty[ns.cssVarName('inner-width')] = `${innerSize.value.w}px`;
    }
    // 否则，如果设置了 props.width，使用初始 props.width
    else if (isString(props.width) || isNumber(props.width)) {
      if (isString(props.width)) {
        sty['width'] = props.width;
      } else if (isNumber(props.width)) {
        sty['width'] = `${props.width}px`;
      }
      // field 使用 border-box，padding 已从内容区中扣除，内部元素填满父级即可
      sty[ns.cssVarName('inner-width')] = '100%';
    }
    // 否则使用 100% 默认兜底
    else {
      sty['width'] = 'auto';
    }

    // ================= 高度处理 =================
    // 如果已手动拖拽高度，优先使用 innerSize 更新外层 height
    if (isResizedHeight.value
      && innerSize.value
      && isNumber(innerSize.value.h)
      && (props.vertical || props.resize)
    ) {
      sty['height'] = `${getHeight(innerSize.value.h)}px`;
      sty[ns.cssVarName('inner-height')] = `${innerSize.value.h}px`;
    }
    // 否则，如果设置了 props.height，使用初始 props.height
    else if (isString(props.height) || isNumber(props.height)) {
      if (isString(props.height)) {
        sty['height'] = props.height;
      } else if (isNumber(props.height)) {
        sty['height'] = `${props.height}px`;
      }
      sty[ns.cssVarName('inner-height')] = '100%';
    }
    // 否则使用 100% 默认兜底
    else {
      sty['height'] = `auto`;
    }

    // 圆角设置
    if (props.radius === true) {
      sty[ns.cssVarName('radius')] = `6px`;
    } else if (isNumber(props.radius)) {
      sty[ns.cssVarName('radius')] = `${props.radius}px`;
    }
    return sty;
  });
  const textareaRows = computed(() => {
    if (isNumber(props.rows) && props.rows > 0) {
      return props.rows;
    }
    return undefined;
  });
  const textareaCols = computed(() => {
    if (isNumber(props.cols) && props.cols > 0) {
      return props.cols;
    }
    return undefined;
  });
  const textLength = computed(() => model.value.length);
  const showWordCount = computed(() => {
    return isNumber(props.minlength) && props.minlength > 0
      && isNumber(props.maxlength) && props.maxlength > 0
      && props.maxlength > props.minlength;
  });
  const modelLengthError = computed(() => {
    if (isNumber(props.maxlength) && props.maxlength > 0 && textLength.value > props.maxlength) {
      return true;
    } else if (isNumber(props.minlength) && props.minlength > 0 && textLength.value < props.minlength) {
      return true;
    } else {
      return false;
    }
  })

  const resetInnerInlineStyles = (type?: 'width' | 'height') => {
    if (!innerRef.value) return;
    if (!type || type === 'width') {
      innerRef.value.style.width = '';
    }
    if (!type || type === 'height') {
      innerRef.value.style.height = '';
    }
  };
  const getWidth = (w: number): number => {
    if (props.size === 'S') {
      return w += 10;
    } else if (props.size === 'M') {
      return w += 14;
    } else if (props.size === 'L') {
      return w += 24;
    }
    return w;
  };
  const getHeight = (h: number): number => {
    if (props.size === 'S') {
      return h += 6;
    } else if (props.size === 'M') {
      return h += 10;
    } else if (props.size === 'L') {
      return h += 16;
    }
    return h;
  };

  const handleFocus = (e: FocusEvent) => {
    active.value = true;
    emits('focus', e);
  };
  const handleBlur = (e: FocusEvent) => {
    active.value = false;
    emits('blur', e);
  };
  const handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;
    emits('change', value, e);
  };
  const handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    const value = target.value;
    emits('input', value, e);
  };


  // 当props.width和props.height发生变化时，重置拖拽标记，并更新inner尺寸
  watch(() => props.width, () => {
    isResizedWidth.value = false;
    resetInnerInlineStyles('width');
  });
  watch(() => props.height, () => {
    isResizedHeight.value = false;
    resetInnerInlineStyles('height');
  });

  onMounted(() => {
    if (innerRef.value) {
      resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { width, height } = entry.target.getBoundingClientRect();

          if (innerSize.value) {
            if (Math.abs(innerSize.value.w - width) > 1) {
              isResizedWidth.value = true;
            }
            if (Math.abs(innerSize.value.h - height) > 1) {
              isResizedHeight.value = true;
            }
          }

          innerSize.value = {
            w: width,
            h: height,
          };
        });
      });
      resizeObserver.observe(innerRef.value);
    }
  });
  onUnmounted(() => {
    if (resizeObserver && innerRef.value) {
      resizeObserver.unobserve(innerRef.value);
      resizeObserver.disconnect();
    }
  });
</script>

<template>
  <div :class="classes" :style="styles" ref="fieldRef">
    <div :class="ns.e('container')">
      <textarea :class="[ns.e('inner')]"
                ref="innerRef"
                v-model="model"
                :rows="textareaRows"
                :cols="textareaCols"
                :minlength="minlength"
                :maxlength="maxlength"
                :disabled="disabled"
                :readonly="readonly"
                @change="handleChange"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur" />
      <div v-if="showWordCount" :class="ns.e('count')">
        <template v-if="isNumber(minlength) && minlength > 0">
          {{minlength}}/
        </template>
        <span :class="ns.em('count', 'current')">{{ textLength }}</span>
        <template v-if="isNumber(maxlength) && maxlength > 0">
          /{{ maxlength }}
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "../styles/style.css";
</style>
