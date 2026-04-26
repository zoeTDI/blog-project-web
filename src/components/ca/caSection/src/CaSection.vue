<script setup lang="ts">
// // 若需要对header区域进行更复杂的控制时可恢复这些内容
// import {computed, useSlots} from 'vue';
//
// const slots = useSlots();
//
// const hasTitle = computed(() => {
//   return !!slots?.title;
// })
//
// const hasSubtitle = computed(() => {
//   return !!slots?.subtitle;
// })
//
// const hasHeader = computed(() => {
//   return hasTitle.value || hasSubtitle.value;
// })

</script>

<template>
  <div class="ca-section">
    <header v-if="$slots.title || $slots.subtitle" class="ca-section-header">
      <div class="header-left">
        <h3 v-if="$slots.title" class="section-title">
          <slot name="title"></slot>
        </h3>
      </div>
      <div class="header-right">
        <span v-if="$slots.subtitle" class="section-subtitle">
          <slot name="subtitle"></slot>
        </span>
      </div>
    </header>

    <div class="ca-section-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ca-section {
  width: 100%;
  height: 100%;
  border: 1px solid var(--border); /* 使用全局细边框变量 */
  background-color: transparent;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transition: border-color 0.4s ease;
}

.ca-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border); /* 标题与内容的分隔线 */
}

/* 标题样式：采用衬线体，保持与网页标题一致的优雅感 */
.section-title {
  margin: 0;
  font-family: var(--heading);
  font-size: 14px; /* 标题与副标题大小相同 */
  color: var(--text-h);
  letter-spacing: 0.5px;
}

/* 副标题样式：采用无衬线体或等宽体，增加现代感 */
.section-subtitle {
  font-family: var(--sans);
  font-size: 14px; /* 标题与副标题大小相同 */
  color: var(--text);
  opacity: 0.5;
  letter-spacing: 1px;
}

.ca-section-content {
  padding: 20px;
  /* 高度由 slot 内部元素撑开 */
  flex: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .ca-section-header {
    padding: 10px 16px;
  }
  .ca-section-content {
    padding: 16px;
  }
}
</style>