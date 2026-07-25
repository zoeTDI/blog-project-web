<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { MessageInstance, MessageItemExpose, MessageOption } from './types.ts';
  import { useCSSNamespace } from '@caldm/hook';
  import CaMessageItem from './Item.vue';

  defineOptions({
    name: 'CaMessageContainer',
  });

  const ns = useCSSNamespace('message');

  const messages = ref<MessageInstance[]>([]);

  const classes = computed(() => {
    const cls: string[] = [
      ns.b(),
      ns.e('container'),
    ];
    return cls;
  });

  const add = (option: MessageOption) => {
    const id = Date.now().toString();
    const message: MessageInstance = {
      id, ...option,
    };
    messages.value.push(message);
    const duration = option.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
  };

  const remove = (id: string) => {
    const index = messages.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      messages.value.splice(index, 1);
    }
  };

  defineExpose<MessageItemExpose>({
    add, remove,
  });


</script>

<template>
  <div :class="classes">
    <transition-group :name="`${ns.e('list')}`">
      <CaMessageItem
        v-for="item in messages"
        :key="item.id"
        :type="item.type"
        :content="item.content"
        @close="remove(item.id)" />
    </transition-group>
  </div>
</template>

<style scoped>
  .ca-message__container {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 9999;
    pointer-events: none; /* 确保容器本身不遮挡底层点击 */
  }

  /* 动画效果 */
  .ca-message__list-enter-active,
  .ca-message__list-leave-active {
    transition: all 0.3s ease;
  }
  .ca-message__list-enter-from,
  .ca-message__list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
</style>