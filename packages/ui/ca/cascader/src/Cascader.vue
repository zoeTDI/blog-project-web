<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import type { CSSProperties } from 'vue';
  import { ChevronDownIcon, ChevronRightIcon, XCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
  import type {
    CascaderEmits,
    CascaderModelValue,
    CascaderMultipleValue,
    CascaderOption,
    CascaderPath,
    CascaderProps,
    CascaderValue,
  } from './types';
  import { DEFAULT_FIELD_NAMES, DEFAULT_SPLIT_CHAR } from './constants';
  import {
    addPaths,
    collectSelectableLeafPaths,
    dedupePaths,
    findOptionPath,
    getOptionChildren,
    getOptionCheckState,
    getOptionLabel,
    getOptionValue,
    getPathValues,
    hasPath,
    isOptionDisabled,
    removePaths,
  } from './tree';
  import { useCSSNamespace } from '@caldm/hook';

  defineOptions({
    name: 'CaCascader',
  });

  const modelValue = defineModel<CascaderModelValue>({ default: () => [] });

  const props = withDefaults(defineProps<CascaderProps>(), {
    size: 'M',
    options: () => [],
    placeholder: '请选择',
    splitChar: DEFAULT_SPLIT_CHAR,
    optionWidth: 180,
    changeOnSelect: false,
    disabled: false,
    clearable: false,
    multiple: false,
    checkStrictly: false,
    collapseTags: false,
    maxCollapseTags: 1,
  });

  const emit = defineEmits<CascaderEmits>();


  const ns = useCSSNamespace('cascader');

  const containerRef = ref<HTMLElement | null>(null);
  const panelRef = ref<HTMLElement | null>(null);

  const visible = ref(false); // 下拉框显隐
  // 面板导航路径与已提交的选择状态相互独立。
  const navigationPath = ref<CascaderOption[]>([]);
  const selectedPaths = ref<CascaderPath[]>([]);
  const panelDirection = ref<'left' | 'right'>('right');

  const dropdownStyle = ref<CSSProperties>({});

  const fieldNames = computed(() => ({
    ...DEFAULT_FIELD_NAMES,
    ...props.fieldNames,
  }));

  const panels = computed<CascaderOption[][]>(() => {
    const result: CascaderOption[][] = [props.options];
    for (const node of navigationPath.value) {
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
    return navigationPath.value.map(getLabel).filter(Boolean).join(props.splitChar);
  });

  const isMultipleModelValue = (
    value: CascaderModelValue,
  ): value is CascaderMultipleValue => value.length > 0 && Array.isArray(value[0]);

  const normalizeModelValue = (value: CascaderModelValue): CascaderPath[] => {
    if (value.length === 0) return [];

    if (props.multiple) {
      return isMultipleModelValue(value)
        ? dedupePaths(value)
        : [[...value]];
    }

    const path = isMultipleModelValue(value) ? value[0] : value;
    return path?.length ? [[...path]] : [];
  };

  interface SelectedItem {
    values: CascaderPath;
    options: CascaderOption[];
    label: string;
    fullLabel: string;
  }

  const selectedItems = computed<SelectedItem[]>(() => {
    const result: SelectedItem[] = [];
    for (const values of selectedPaths.value) {
      const optionPath = findOptionPath(props.options, values, fieldNames.value);
      if (optionPath.length === 0) continue;

      const labels = optionPath.map(getLabel).filter(Boolean);
      result.push({
        values,
        options: optionPath,
        label: labels.at(-1) ?? '',
        fullLabel: labels.join(props.splitChar),
      });
    }
    return result;
  });

  const selectedOptionPaths = computed<CascaderOption[][]>(() => (
    selectedItems.value.map((item) => item.options)
  ));

  const visibleSelectedItems = computed(() => {
    if (!props.collapseTags) return selectedItems.value;
    const limit = Math.max(0, Math.floor(props.maxCollapseTags));
    return selectedItems.value.slice(0, limit);
  });

  const collapsedCount = computed(() => (
    Math.max(0, selectedItems.value.length - visibleSelectedItems.value.length)
  ));

  const collapsedTitle = computed(() => (
    selectedItems.value
      .slice(visibleSelectedItems.value.length)
      .map((item) => item.fullLabel)
      .join('\n')
  ));

  const hasSelection = computed(() => (
    props.multiple ? selectedItems.value.length > 0 : !!displayLabel.value
  ));

  const syncSelectedPathsFromModel = () => {
    selectedPaths.value = normalizeModelValue(modelValue.value);
  };

  const syncNavigationFromSelection = () => {
    navigationPath.value = selectedOptionPaths.value[0]
      ? [...selectedOptionPaths.value[0]]
      : [];
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
    return getOptionLabel(node, fieldNames.value);
  };

  const getValue = (node?: CascaderOption): CascaderValue | undefined => {
    return getOptionValue(node, fieldNames.value);
  };

  const getChildren = (node?: CascaderOption): CascaderOption[] | undefined => {
    return getOptionChildren(node, fieldNames.value);
  };

  const getDisabled = (node?: CascaderOption): boolean => {
    return isOptionDisabled(node, fieldNames.value);
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
    syncNavigationFromSelection();
    removeScrollResizeListeners();
  };

  const commitSingleSelection = (optionPath: CascaderOption[]) => {
    const selectedValues = getPathValues(optionPath, fieldNames.value);
    selectedPaths.value = [selectedValues];
    modelValue.value = selectedValues;
    emit('change', selectedValues, optionPath);
  };

  const commitMultipleSelection = (paths: CascaderPath[]) => {
    const nextPaths = dedupePaths(paths);
    const selectedOptions = nextPaths
      .map((path) => findOptionPath(props.options, path, fieldNames.value))
      .filter((path) => path.length > 0);

    selectedPaths.value = nextPaths;
    modelValue.value = nextPaths;
    emit('change', nextPaths, selectedOptions);
  };

  const handleOptionCheck = (node: CascaderOption, level: number) => {
    if (getDisabled(node)) return;

    const parentPath = getPathValues(
      navigationPath.value.slice(0, level),
      fieldNames.value,
    );
    const value = getValue(node);
    if (value === undefined) return;

    const affectedPaths = props.checkStrictly
      ? [[...parentPath, value]]
      : collectSelectableLeafPaths(node, parentPath, fieldNames.value);
    if (affectedPaths.length === 0) return;

    const allSelected = affectedPaths.every((path) => hasPath(selectedPaths.value, path));
    const nextPaths = allSelected
      ? removePaths(selectedPaths.value, affectedPaths)
      : addPaths(selectedPaths.value, affectedPaths);

    commitMultipleSelection(nextPaths);
  };

  const handleOptionNavigate = (node: CascaderOption, level: number) => {
    if (getDisabled(node)) return;

    const newPath = navigationPath.value.slice(0, level);
    newPath.push(node);
    navigationPath.value = newPath;
  };

  const getCheckState = (node: CascaderOption, level: number) => {
    const parentPath = getPathValues(
      navigationPath.value.slice(0, level),
      fieldNames.value,
    );
    return getOptionCheckState(
      node,
      parentPath,
      selectedPaths.value,
      fieldNames.value,
      props.checkStrictly,
    );
  };

  const handleOptionClick = (node: CascaderOption, level: number) => {
    if (getDisabled(node)) return;

    if (props.multiple) {
      handleOptionCheck(node, level);
      return;
    }

    handleOptionNavigate(node, level);

    const children = getChildren(node);
    const hasChildren = children && children.length > 0;

    if (!hasChildren || props.changeOnSelect) {
      commitSingleSelection(navigationPath.value);
    }

    if (!hasChildren) {
      closeMenu();
    }
  };

  const handleMoreClick = (e: Event, node: CascaderOption, level: number) => {
    if (!props.multiple) return;
    e.stopPropagation();
    handleOptionNavigate(node, level);
  };

  const handleTagRemove = (e: Event, path: CascaderPath) => {
    e.stopPropagation();
    commitMultipleSelection(removePaths(selectedPaths.value, [path]));
    if (!visible.value) syncNavigationFromSelection();
  };

  const handleClear = (e: Event) => {
    e.stopPropagation();
    navigationPath.value = [];
    selectedPaths.value = [];
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
    [
      modelValue,
      () => props.options,
      () => props.fieldNames,
      () => props.multiple,
    ],
    () => {
      syncSelectedPathsFromModel();
      if (!visible.value) syncNavigationFromSelection();
    },
    { immediate: true, deep: true },
  );

  watch(navigationPath, () => {
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
      <div v-if="props.multiple" :class="ns.e('tags')">
        <span
          v-if="selectedItems.length === 0"
          :class="ns.e('placeholder')"
        >
          {{ props.placeholder }}
        </span>
        <span
          v-for="item in visibleSelectedItems"
          :key="item.values.join('-')"
          :class="ns.e('tag')"
          :title="item.fullLabel"
        >
          <span :class="ns.em('tag', 'label')">{{ item.label }}</span>
          <button
            type="button"
            :class="ns.em('tag', 'remove')"
            :aria-label="`移除 ${item.fullLabel}`"
            :disabled="props.disabled"
            @click="handleTagRemove($event, item.values)"
          >
            <XMarkIcon />
          </button>
        </span>
        <span
          v-if="collapsedCount > 0"
          :class="[ns.e('tag'), ns.em('tag', 'collapsed')]"
          :title="collapsedTitle"
        >
          +{{ collapsedCount }}
        </span>
      </div>
      <input
        v-else
        type="text"
        readonly
        :placeholder="props.placeholder"
        :value="displayLabel"
        :disabled="props.disabled"
      />

      <span :class="ns.e('suffix')">
        <XCircleIcon
          v-if="props.clearable && hasSelection && !props.disabled"
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
                  ns.is('active', !!(navigationPath[level] && getValue(navigationPath[level]) === getValue(item))),
                  ns.is('selected', props.multiple && getCheckState(item, level).checked),
                  ns.is('indeterminate', props.multiple && getCheckState(item, level).indeterminate),
                  ns.is('disabled', getDisabled(item))
                ]"
                @click="handleOptionClick(item, level)"
              >
                <input
                  v-if="props.multiple"
                  type="checkbox"
                  :class="ns.e('checkbox')"
                  :checked="getCheckState(item, level).checked"
                  :indeterminate="getCheckState(item, level).indeterminate"
                  :disabled="getDisabled(item)"
                  :aria-label="`选择 ${getLabel(item)}`"
                  @click.stop
                  @change.stop="handleOptionCheck(item, level)"
                />
                <span :class="ns.e('label')">{{ getLabel(item) }}</span>
                <ChevronRightIcon
                  v-if="getChildren(item)?.length"
                  :class="[ns.e('icon'), ns.em('icon', 'more')]"
                  @click="handleMoreClick($event, item, level)"
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
    color: var(--ca-cascader-text);
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

  .ca-cascader--size-S .ca-cascader__checkbox {
    width: 12px;
    height: 12px;
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

  .ca-cascader--size-L .ca-cascader__checkbox {
    width: 16px;
    height: 16px;
  }

  .ca-cascader__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    overflow: hidden;
    color: var(--ca-cascader-text);
    border: 1px solid var(--ca-cascader-border);
    border-radius: 4px;
    background-color: var(--ca-cascader-bg);
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s, color 0.2s;
  }

  .ca-cascader__trigger:hover {
    border-color: var(--ca-cascader-accent);
  }

  .ca-cascader.is-active .ca-cascader__trigger,
  .ca-cascader__trigger:focus-within {
    border-color: var(--ca-cascader-accent);
  }

  .ca-cascader.is-disabled .ca-cascader__trigger {
    background-color: var(--ca-cascader-disabled-bg);
    cursor: not-allowed;
    border-color: var(--ca-cascader-disabled-border);
  }

  .ca-cascader__trigger input {
    width: 100%;
    min-width: 0;
    border: none;
    outline: none;
    color: var(--ca-cascader-text);
    background: transparent;
    cursor: pointer;
    font-size: inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .ca-cascader__trigger input::placeholder {
    color: var(--ca-cascader-placeholder);
  }

  .ca-cascader.is-disabled input {
    cursor: not-allowed;
    color: var(--ca-cascader-disabled-text);
  }

  .ca-cascader__suffix {
    display: flex;
    flex: none;
    align-items: center;
    gap: 4px;
    color: var(--ca-cascader-icon);
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
    color: var(--ca-cascader-text);
  }

  .ca-cascader__tags {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
  }

  .ca-cascader__placeholder {
    min-width: 0;
    overflow: hidden;
    color: var(--ca-cascader-placeholder);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ca-cascader__tag {
    display: inline-flex;
    flex: 0 1 auto;
    align-items: center;
    gap: 2px;
    min-width: 0;
    max-width: 120px;
    padding: 2px 5px;
    color: var(--ca-cascader-text);
    background-color: var(--ca-cascader-tag-bg);
    border: 1px solid var(--ca-cascader-tag-border);
    border-radius: 3px;
    transition: border-color 0.15s, background-color 0.15s, color 0.15s;
  }

  .ca-cascader__tag--label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ca-cascader__tag--remove {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
  }

  .ca-cascader__tag--remove:hover {
    color: var(--ca-cascader-accent);
    background-color: color-mix(in srgb, currentColor 12%, transparent);
  }

  .ca-cascader__tag--remove svg {
    width: 12px;
    height: 12px;
  }

  .ca-cascader__tag--remove:focus-visible {
    outline: 1px solid var(--ca-cascader-accent);
  }

  .ca-cascader.is-disabled .ca-cascader__tag {
    color: var(--ca-cascader-disabled-text);
    background-color: var(--ca-cascader-disabled-bg);
    border-color: var(--ca-cascader-disabled-border);
  }

  .ca-cascader__tag--collapsed {
    flex: none;
  }

  /* 全局 Teleport 弹出面板控制 */
  .ca-cascader__dropdown {
    display: flex;
    color: var(--ca-cascader-text);
    background: var(--ca-cascader-bg);
    border: 1px solid var(--ca-cascader-border);
    border-radius: 4px;
    box-shadow: var(--ca-cascader-shadow);
    overflow: hidden;
    transition: background-color 0.2s, border-color 0.2s;
  }

  .ca-cascader__panel {
    height: 200px;
    overflow-y: auto;
    border-right: 1px solid var(--ca-cascader-border);
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
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .ca-cascader__option:hover {
    background-color: var(--ca-cascader-hover-bg);
  }

  .ca-cascader__option.is-active {
    color: var(--ca-cascader-accent);
    font-weight: 600;
    background-color: var(--ca-cascader-selected-bg);
  }

  .ca-cascader__option.is-selected {
    color: var(--ca-cascader-accent);
    background-color: var(--ca-cascader-selected-bg);
  }

  .ca-cascader__option.is-indeterminate {
    color: var(--ca-cascader-accent);
  }

  .ca-cascader__option.is-disabled {
    color: var(--ca-cascader-disabled-text);
    cursor: not-allowed;
    background-color: var(--ca-cascader-bg);
  }

  .ca-cascader__icon--more {
    flex: none;
    color: var(--ca-cascader-icon);
  }

  .ca-cascader__checkbox {
    flex: none;
    width: 14px;
    height: 14px;
    margin: 0;
    accent-color: var(--ca-cascader-accent);
    cursor: pointer;
  }

  .ca-cascader__option.is-disabled .ca-cascader__checkbox {
    cursor: not-allowed;
  }

  .ca-cascader__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
