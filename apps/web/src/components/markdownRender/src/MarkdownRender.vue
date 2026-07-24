<script setup lang="ts">
  import { computed  } from 'vue';
  import { baseBenderer } from '@/plugins/markdownIt.ts';

  const props = withDefaults(
    defineProps<{
      content: string;
      theme?: 'default' | 'pink'; // 增加主题选项
      captionMode?: 'none' | 'always';
    }>(),
    {
      content: '',
      theme: 'default',
      captionMode: 'none',
    }
  );

  const renderedHtml = computed(() => {
    return baseBenderer.render(props.content);
  });

  const containerClasses = computed(() => {
    return [
      'markdown-body',
      `theme-${props.theme}`,
      `caption-${props.captionMode}`, // 动态类名：caption-none 或 caption-always
    ];
  });

  /**
   * 处理图片加载失败
   */
  const handleContentError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    if (target.tagName === 'IMG') {
      // 打上错误标记类名
      target.classList.add('img-error');
    }
  };

  /**
   * 统一处理点击事件（事件代理）
   */
  const handleContentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // 1. 处理代码块复制逻辑
    if (target.classList.contains('code-lang-tag')) {
      const container = target.closest('.code-block-container');
      const codeText = container?.querySelector('.copy-temp')?.textContent;

      if (codeText) {
        navigator.clipboard.writeText(codeText).then(() => {
          const originalText = target.innerText;
          target.innerText = 'COPIED!';
          target.classList.add('copied');

          setTimeout(() => {
            target.innerText = originalText;
            target.classList.remove('copied');
          }, 2000);
        });
      }
      return; // 处理完复制后返回，避免触发后续图片逻辑
    }

    // 2. 处理图片点击预览逻辑
    if (target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      if (img.classList.contains('img-error')) return;
      window.open(img.src, '_blank');
    }
  };


</script>

<template>
  <div
    class="markdown-body"
    :class="containerClasses"
    v-html="renderedHtml"
    @click="handleContentClick"
    @error.capture="handleContentError"></div>
</template>

<style>
  @import '@/assets/markdown/css/defaultTheme.css';
  @import '@/assets/markdown/css/pinkTheme.css';
</style>