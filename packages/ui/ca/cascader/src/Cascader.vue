<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import type { CSSProperties } from 'vue';
  import { ChevronDownIcon, XCircleIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
  import type { CascaderProps, CascaderEmits, CascaderOption, CascaderValue } from './types';
  import { DEFAULT_FIELD_NAMES, DEFAULT_SPLIT_CHAR } from './constants';
  import { useCSSNamespace } from '@caldm/hook';

  defineOptions({
    name: 'CaCascader',
  });

  const modelValue = defineModel<CascaderValue[]>({ default: () => [] });

  const props = withDefaults(defineProps<CascaderProps>(), {
    size: 'M',
    options: () => [],
    placeholder: '请选择',
    splitChar: DEFAULT_SPLIT_CHAR,
    optionWidth: 180,
    changeOnSelect: false,
    disabled: false,
    clearable: false,
  });

  const emit = defineEmits<CascaderEmits>();


  const ns = useCSSNamespace('cascader');

  const containerRef = ref<HTMLElement | null>(null);
  const panelRef = ref<HTMLElement | null>(null);

  const visible = ref(false); // 下拉框显隐
  const activePath = ref<CascaderOption[]>([]); // 当前选中的节点链表
  const panelDirection = ref<'left' | 'right'>('right');

  const dropdownStyle = ref<CSSProperties>({});

  const fieldNames = computed(() => ({
    ...DEFAULT_FIELD_NAMES,
    ...props.fieldNames,
  }));

  const panels = computed<CascaderOption[][]>(() => {
    const result: CascaderOption[][] = [props.options];
    for (const node of activePath.value) {
      const children = getChildren(node);
      if (children && children.length > 0) {
        result.push(children);
      } else {
        break;
      }
    }
    return result;
  });

  const displayLabel = computed(() => {
    return activePath.value.map(getLabel).filter(Boolean).join(props.splitChar);
  });

  const findPathByValues = (
    options: CascaderOption[],
    values: CascaderValue[],
    depth = 0,
  ): CascaderOption[] => {
    if (!values || values.length === 0 || depth >= values.length) return [];

    const targetValue = values[depth];
    const foundNode = options.find((opt) => getValue(opt) === targetValue);

    if (!foundNode) return [];

    const children = getChildren(foundNode);
    if (children && children.length > 0 && depth + 1 < values.length) {
      return [foundNode, ...findPathByValues(children, values, depth + 1)];
    }
    return [foundNode];
  };

  const syncPathFromModel = () => {
    if (!modelValue.value || modelValue.value.length === 0) {
      activePath.value = [];
      return;
    }
    activePath.value = findPathByValues(props.options, modelValue.value);
  };

  const updateDropdownPosition = async () => {
    if (!visible.value || !containerRef.value) return;

    await nextTick();

    const rect = containerRef.value.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const optionWidthNum = typeof props.optionWidth === 'number' ? props.optionWidth : parseFloat(props.optionWidth as string) || 180;
    const totalPanelsWidth = panels.value.length * optionWidthNum;

    let top = rect.bottom + window.scrollY + 4;
    let left = rect.left + window.scrollX;

    // 水平方向判定
    if (rect.left + totalPanelsWidth > windowWidth) {
      panelDirection.value = 'left';
      left = rect.right + window.scrollX - totalPanelsWidth;
    } else {
      panelDirection.value = 'right';
    }

    // 垂直方向判定
    const estimatedHeight = 200;
    if (rect.bottom + estimatedHeight > windowHeight && rect.top > estimatedHeight) {
      top = rect.top + window.scrollY - estimatedHeight - 4;
    }

    dropdownStyle.value = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 2000,
    };
  };

  const getLabel = (node?: CascaderOption): string => {
    if (!node) return '';
    return node[fieldNames.value.label] ?? '';
  };

  const getValue = (node?: CascaderOption): CascaderValue | undefined => {
    if (!node) return undefined;
    return node[fieldNames.value.value];
  };

  const getChildren = (node?: CascaderOption): CascaderOption[] | undefined => {
    if (!node) return undefined;
    return node[fieldNames.value.children];
  };

  const getDisabled = (node?: CascaderOption): boolean => {
    if (!node) return false;
    return !!node[fieldNames.value.disabled];
  };

  const toggleMenu = () => {
    if (props.disabled) return;
    if (visible.value) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    visible.value = true;
    updateDropdownPosition();
    addScrollResizeListeners();
  };

  const closeMenu = () => {
    visible.value = false;
    syncPathFromModel();
    removeScrollResizeListeners();
  };

  const handleOptionClick = (node: CascaderOption, level: number) => {
    if (getDisabled(node)) return;

    const newPath = activePath.value.slice(0, level);
    newPath.push(node);
    activePath.value = newPath;

    const children = getChildren(node);
    const hasChildren = children && children.length > 0;

    if (!hasChildren || props.changeOnSelect) {
      const selectedValues = newPath.map((item) => getValue(item)!);
      modelValue.value = selectedValues;
      emit('change', selectedValues, newPath);
    }

    if (!hasChildren) {
      closeMenu();
    }
  };

  const handleClear = (e: Event) => {
    e.stopPropagation();
    activePath.value = [];
    modelValue.value = [];
    emit('change', [], []);
    emit('clear');
  };

  const handleDocumentClick = (e: MouseEvent) => {
    if (!visible.value) return;

    const target = e.target as Node;
    const isInsideTrigger = containerRef.value?.contains(target);
    const isInsideDropdown = panelRef.value?.contains(target);

    // 当点击既不在触发框内，也不在 Teleport 出来的下拉框内时触发关闭
    if (!isInsideTrigger && !isInsideDropdown) {
      closeMenu();
    }
  };

  const handleScrollOrResize = () => {
    if (visible.value) {
      updateDropdownPosition();
    }
  };

  const addScrollResizeListeners = () => {
    window.addEventListener('scroll', handleScrollOrResize, true); // capture: true 捕获全局局部滚动
    window.addEventListener('resize', handleScrollOrResize);
  };

  const removeScrollResizeListeners = () => {
    window.removeEventListener('scroll', handleScrollOrResize, true);
    window.removeEventListener('resize', handleScrollOrResize);
  };

  watch(
    [modelValue, () => props.options],
    () => {
      syncPathFromModel();
    },
    { immediate: true, deep: true },
  );

  watch(activePath, () => {
    if (visible.value) {
      updateDropdownPosition();
    }
  });

  onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleDocumentClick);
    removeScrollResizeListeners();
  });
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      ns.b(),
      ns.m(`size-${props.size}`),
      ns.is('disabled', props.disabled),
      ns.is('active', visible),
      ns.m(`direction-${panelDirection}`)
    ]"
  >
    <!-- 输入框/触发框 -->
    <div :class="ns.e('trigger')" @click="toggleMenu">
      <input
        type="text"
        readonly
        :placeholder="props.placeholder"
        :value="displayLabel"
        :disabled="props.disabled"
      />

      <span :class="ns.e('suffix')">
        <XCircleIcon
          v-if="props.clearable && displayLabel && !props.disabled"
          :class="[ns.e('icon'), ns.em('icon', 'clear')]"
          @click="handleClear"
        />
        <ChevronDownIcon
          :class="[
            ns.e('icon'),
            ns.em('icon', 'arrow'),
            ns.is('reverse', visible)
          ]"
        />
      </span>
    </div>

    <!-- Teleport 到 body 层的级联选择面板 -->
    <Teleport to="body">
      <Transition name="ca-fade">
        <div
          v-if="visible"
          ref="panelRef"
          :class="[
            ns.e('dropdown'),
            ns.m(`direction-${panelDirection}`),
            ns.m(`size-${props.size}`),
          ]"
          :style="dropdownStyle"
        >
          <div
            v-for="(list, level) in panels"
            :key="level"
            :class="ns.e('panel')"
            :style="{ width: typeof props.optionWidth === 'number' ? `${props.optionWidth}px` : props.optionWidth }"
          >
            <ul :class="ns.e('menu')">
              <li
                v-for="item in list"
                :key="getValue(item)"
                :class="[
                  ns.e('option'),
                  ns.is('active', !!(activePath[level] && getValue(activePath[level]) === getValue(item))),
                  ns.is('disabled', getDisabled(item))
                ]"
                @click="handleOptionClick(item, level)"
              >
                <span :class="ns.e('label')">{{ getLabel(item) }}</span>
                <ChevronRightIcon
                  v-if="getChildren(item)?.length"
                  :class="[ns.e('icon'), ns.em('icon', 'more')]"
                />
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
  .ca-cascader {
    position: relative;
    display: inline-block;
    width: 220px;
    font-size: 14px;
    color: var(--color-text-primary, #333);
  }

  /* S 尺寸 */
  .ca-cascader--size-S {
    font-size: 12px;
  }

  .ca-cascader--size-S .ca-cascader__trigger {
    height: 28px;
    padding: 0 8px;
  }

  .ca-cascader--size-S .ca-cascader__icon {
    width: 14px;
    height: 14px;
  }

  .ca-cascader--size-S .ca-cascader__option {
    padding: 5px 8px;
  }

  /* M 尺寸 (默认) */
  .ca-cascader--size-M {
    font-size: 14px;
  }

  .ca-cascader--size-M .ca-cascader__trigger {
    height: 36px;
    padding: 0 10px;
  }

  .ca-cascader--size-M .ca-cascader__icon {
    width: 16px;
    height: 16px;
  }

  .ca-cascader--size-M .ca-cascader__option {
    padding: 8px 12px;
  }

  /* L 尺寸 */
  .ca-cascader--size-L {
    font-size: 16px;
  }

  .ca-cascader--size-L .ca-cascader__trigger {
    height: 42px;
    padding: 0 12px;
  }

  .ca-cascader--size-L .ca-cascader__icon {
    width: 18px;
    height: 18px;
  }

  .ca-cascader--size-L .ca-cascader__option {
    padding: 10px 14px;
  }

  .ca-cascader__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--color-border, #dcdfe6);
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .ca-cascader__trigger:hover {
    border-color: var(--color-accent, #409eff);
  }

  .ca-cascader.is-active .ca-cascader__trigger {
    border-color: var(--color-accent, #409eff);
  }

  .ca-cascader.is-disabled .ca-cascader__trigger {
    background-color: #f5f7fa;
    cursor: not-allowed;
    border-color: #e4e7ed;
  }

  .ca-cascader__trigger input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
    font-size: inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .ca-cascader.is-disabled input {
    cursor: not-allowed;
    color: #a8abb2;
  }

  .ca-cascader__suffix {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #a8abb2;
  }

  .ca-cascader__icon {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
  }

  .ca-cascader__icon--arrow.is-reverse {
    transform: rotate(180deg);
  }

  .ca-cascader__icon--clear:hover {
    color: #606266;
  }

  /* 全局 Teleport 弹出面板控制 */
  .ca-cascader__dropdown {
    display: flex;
    background: #fff;
    border: 1px solid var(--color-border, #e4e7ed);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  .ca-cascader__panel {
    height: 200px;
    overflow-y: auto;
    border-right: 1px solid var(--color-border, #e4e7ed);
  }

  .ca-cascader__panel:last-child {
    border-right: none;
  }

  .ca-cascader__menu {
    list-style: none;
    padding: 6px 0;
    margin: 0;
  }

  .ca-cascader__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .ca-cascader__option:hover {
    background-color: var(--color-bg-hover, #f5f7fa);
  }

  .ca-cascader__option.is-active {
    color: var(--color-accent, #409eff);
    font-weight: 600;
    background-color: #ecf5ff;
  }

  .ca-cascader__option.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    background-color: #fff;
  }

  .ca-cascader__icon--more {
    color: #a8abb2;
  }

  .ca-fade-enter-active,
  .ca-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  .ca-fade-enter-from,
  .ca-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>