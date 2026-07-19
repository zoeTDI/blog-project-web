<script setup lang="ts">
import {computed} from 'vue';
import {type ActionItem, defaultActions} from "@/components/postActions/src/type.ts";

interface Props {
  // 显示模式：'text' (图标+文字) | 'circle' (圆形图标)
  mode?: 'text' | 'circle';
  // 允许部分修改默认行为（如修改文字或关闭某个功能）
  overrides?: Partial<Record<ActionItem['key'], Partial<Omit<ActionItem, 'key'>>>>;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'text',
  overrides: () => ({})
});

// 1. 合并配置并过滤出开启的功能
const activeActions = computed(() => {
  return defaultActions
      .map(action => {
        const override = props.overrides[action.key];
        return {...action, ...override};
      })
      .filter(action => action.enabled);
});

// 2. 如果全部关闭，则不渲染组件
const isVisible = computed(() => activeActions.value.length > 0);

// 3. 模拟点击方法
const handleAction = (key: string) => {
  console.log(`[PostAction] 触发了 ${key} 操作`);
  // 后续可扩展为 emit('action', key)
};
</script>

<template>
  <div v-if="isVisible" class="post-actions" :class="`mode-${mode}`">
    <div
        v-for="item in activeActions"
        :key="item.key"
        class="action-item"
        @click="handleAction(item.key)"
    >
      <div class="icon-wrapper">
        <component :is="item.icon"/>
      </div>
      <span v-if="mode === 'text'" class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.post-actions {
  display: flex;
  gap: 1.5rem;
  margin: 2rem 0;
  user-select: none;
}

.action-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text-primary);
  line-height: 1;
}

.action-item:hover {
  color: var(--color-text-hover-accent);
}

/* 统一图标包装器的基础样式 */
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- 第一种模式：图标+文字 --- */
.mode-text .icon-wrapper {
  margin-right: 0.2rem;
}

.mode-text .label {
  font-size: 16px;
  display: flex;
}

.mode-text .icon-wrapper :deep(svg) {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: middle;
}

/* --- 第二种模式：圆形图标 --- */
.mode-circle .icon-wrapper {
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  transition: inherit;
}

.mode-circle .icon-wrapper :deep(svg) {
  width: 20px;
  height: 20px;
}

.mode-circle .action-item:hover .icon-wrapper {
  border-color: var(--color-border-hover-accent);
  background: var(--color-bg-hover);
}

</style>