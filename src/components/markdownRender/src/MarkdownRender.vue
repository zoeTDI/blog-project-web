<script setup lang="ts">
  import { computed } from 'vue';
  import md from '@/plugins/markdownIt.ts';
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
    return md.render(props.content);
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

    // 2. 处理图片点击预览逻辑[cite: 13]
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
  @import '@/assets/markdown/css/base.css';
  @import '@/assets/markdown/css/defaultTheme.css';
  @import '@/assets/markdown/css/pinkTheme.css';

  .markdown-body {
    /*callout 颜色*/
    /* ===== Note ===== */
    --color-base-note: rgb(8, 109, 221);
    --color-icon-note: var(--color-base-note);
    --color-left-border-note: var(--color-base-note);
    --color-summary-note: var(--color-base-note);
    --color-bg-note: color-mix(
      in srgb,
      var(--color-base-note) 10%,
      transparent
    );
    --color-summary-bg-note: color-mix(
      in srgb,
      var(--color-base-note) 40%,
      transparent
    );

    /* ===== To——do ===== */
    --color-base-todo: rgb(8, 109, 221);
    --color-icon-todo: var(--color-base-todo);
    --color-left-border-todo: var(--color-base-todo);
    --color-summary-todo: var(--color-base-todo);
    --color-bg-todo: color-mix(
      in srgb,
      var(--color-base-todo) 10%,
      transparent
    );
    --color-summary-bg-todo: color-mix(
      in srgb,
      var(--color-base-todo) 40%,
      transparent
    );

    /* ===== Tip ===== */
    --color-base-tip: rgb(0, 191, 188);
    --color-icon-tip: var(--color-base-tip);
    --color-left-border-tip: var(--color-base-tip);
    --color-summary-tip: var(--color-base-tip);
    --color-bg-tip: color-mix(in srgb, var(--color-base-tip) 10%, transparent);
    --color-summary-bg-tip: color-mix(
      in srgb,
      var(--color-base-tip) 40%,
      transparent
    );

    /* ===== Important ===== */
    --color-base-important: rgb(0, 191, 188);
    --color-icon-important: var(--color-base-important);
    --color-left-border-important: var(--color-base-important);
    --color-summary-important: var(--color-base-important);
    --color-bg-important: color-mix(
      in srgb,
      var(--color-base-important) 10%,
      transparent
    );
    --color-summary-bg-important: color-mix(
      in srgb,
      var(--color-base-important) 40%,
      transparent
    );

    /* ===== Abstract ===== */
    --color-base-abstract: rgb(0, 191, 188);
    --color-icon-abstract: var(--color-base-abstract);
    --color-left-border-abstract: var(--color-base-abstract);
    --color-summary-abstract: var(--color-base-abstract);
    --color-bg-abstract: color-mix(
      in srgb,
      var(--color-base-abstract) 10%,
      transparent
    );
    --color-summary-bg-abstract: color-mix(
      in srgb,
      var(--color-base-abstract) 40%,
      transparent
    );

    /* ===== Warning ===== */
    --color-base-warning: rgb(236, 117, 0);
    --color-icon-warning: var(--color-base-warning);
    --color-left-border-warning: var(--color-base-warning);
    --color-summary-warning: var(--color-base-warning);
    --color-bg-warning: color-mix(
      in srgb,
      var(--color-base-warning) 10%,
      transparent
    );
    --color-summary-bg-warning: color-mix(
      in srgb,
      var(--color-base-warning) 40%,
      transparent
    );

    /* ===== Caution ===== */
    --color-base-caution: rgb(236, 117, 0);
    --color-icon-caution: var(--color-base-caution);
    --color-left-border-caution: var(--color-base-caution);
    --color-summary-caution: var(--color-base-caution);
    --color-bg-caution: color-mix(
      in srgb,
      var(--color-base-caution) 10%,
      transparent
    );
    --color-summary-bg-caution: color-mix(
      in srgb,
      var(--color-base-caution) 40%,
      transparent
    );

    /* ===== Question ===== */
    --color-base-question: rgb(236, 117, 0);
    --color-icon-question: var(--color-base-question);
    --color-left-border-question: var(--color-base-question);
    --color-summary-question: var(--color-base-question);
    --color-bg-question: color-mix(
      in srgb,
      var(--color-base-question) 10%,
      transparent
    );
    --color-summary-bg-question: color-mix(
      in srgb,
      var(--color-base-question) 40%,
      transparent
    );

    /* ===== Success ===== */
    --color-base-success: rgb(8, 185, 78);
    --color-icon-success: var(--color-base-success);
    --color-left-border-success: var(--color-base-success);
    --color-summary-success: var(--color-base-success);
    --color-bg-success: color-mix(
      in srgb,
      var(--color-base-success) 10%,
      transparent
    );
    --color-summary-bg-success: color-mix(
      in srgb,
      var(--color-base-success) 40%,
      transparent
    );
  }
</style>
