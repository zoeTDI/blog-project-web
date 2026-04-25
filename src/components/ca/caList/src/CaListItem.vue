<template>
  <li class="ca-list-item">
    <div class="ca-list-item-prefix">
      <slot></slot>
    </div>
    <div v-if="$slots.suffix" class="ca-list-item-suffix">
      <slot name="suffix"></slot>
    </div>
  </li>
</template>

<style scoped>
.ca-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  transition: all 0.3s ease;
  font-family: var(--sans);
}

.ca-list-item:last-child {
  border-bottom: none;
}

/* 悬停效果：轻微变色，与项目整体风格一致 */
.ca-list-item:hover {
  padding-left: 8px;
  color: var(--accent);
}

.ca-list-item-prefix {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.ca-list-item-suffix {
  font-family: var(--mono);
  font-size: 13px;
  opacity: 0.6;
}
</style>