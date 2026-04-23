<script setup lang="ts">
defineProps<{
  modelValue: 'list' | 'card';
  total: number;
}>();

const emit = defineEmits(['update:modelValue']);

const setMode = (mode: 'list' | 'card') => {
  emit('update:modelValue', mode);
};
</script>

<template>
  <div class="view-switcher-container">
    <div class="view-switcher-action-bar">
      <div class="action-left">
        <span class="results-count">ALL POSTS / {{ total }}</span>
      </div>
      <div class="action-right">
        <div class="mode-controls">
          <button
              :class="['switch-btn', { active: modelValue === 'list' }]"
              @click="setMode('list')"
          >
            <span class="btn-text">LIST</span>
          </button>
          <button
              :class="['switch-btn', { active: modelValue === 'card' }]"
              @click="setMode('card')"
          >
            <span class="btn-text">CARD</span>
          </button>
        </div>
      </div>
    </div>

    <div class="view-switcher-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.view-switcher-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.results-count {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--text);
  opacity: 0.6;
}

.mode-controls {
  display: flex;
  gap: 1px;
  background-color: var(--border);
  border: 1px solid var(--border);
}

.switch-btn {
  background-color: var(--bg);
  border: none;
  padding: 6px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.btn-text {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--text);
  opacity: 0.5;
}

.switch-btn.active {
  background-color: var(--accent-bg);
}

.switch-btn.active .btn-text {
  color: var(--accent);
  opacity: 1;
  font-weight: 600;
}

.switch-btn:hover:not(.active) .btn-text {
  opacity: 1;
}

@media (max-width: 480px) {
  .results-count { display: none; }
  .view-switcher-action-bar { justify-content: flex-end; }
}
</style>