<script setup lang="ts">
  import { preferences } from '@/core/preferences';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';

  const ns = useCSSNamespace('base-layout-footer');

  const classes = computed(() => {
    const cls: string[] = [ns.b()];
    return cls;
  });

  const styles = computed(() => {
    if (
      !preferences.footer.enable ||
      typeof preferences.footer.height !== 'number'
    ) {
      return {};
    }
    const varCss = {
      height: preferences.footer.height + 'px',
    };
    return ns.cssVarBlock(varCss);
  });
</script>

<template>
  <div
    :class="classes"
    :style="styles">
    <div :class="ns.e('left')">
      <div :class="ns.e('copyright')">
        © {{ new Date().getFullYear() }} BY YOURNAME
      </div>
    </div>
    <div :class="ns.e('right')">
      <div :class="[ns.e('beian'), ns.s('container')]">
        <a
          :href="preferences.copyright.gonganRecordNumberLink"
          target="_blank"
          :class="ns.e('item')">
          <img
            src="@/assets/备案编号图标.png"
            alt="公安备案图标"
            :class="ns.e('gongan-icon')" />
          <span>{{ preferences.copyright.gonganRecordNumber }}</span>
        </a>

        <a
          :href="preferences.copyright.icpRecordNumberLink"
          target="_blank"
          :class="ns.e('item')">
          <span>{{ preferences.copyright.icpRecordNumber }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ca-base-layout-footer {
    height: var(--ca-base-layout-footer-height, auto);
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.3s;
  }

  .ca-base-layout-footer:hover {
    opacity: 1; /* 鼠标悬停时清晰显示，符合极简互动感 */
  }

  .ca-base-layout-footer__left {
  }
  .ca-base-layout-footer__copyright {
  }
  .ca-base-layout-footer__right {
  }

  /* 备案容器：横向排列 */
  .ca-base-layout-footer__beian {
    display: flex;
    align-items: center;
    gap: 24px; /* 两个备案信息之间的间距 */
  }

  .ca-base-layout-footer__item {
    display: flex;
    align-items: center;
    gap: 4px; /* 图片与文字之间的微小间距 */
    color: inherit;
    text-decoration: none;
  }

  .ca-base-layout-footer__item:hover {
    color: var(--color-text-hover-accent);
  }

  /* 公安图片大小与文字对齐的关键 */
  .ca-base-layout-footer__gongan-icon {
    height: 1.2em; /* 略大于 1em 以视觉抵消图标边距，确保感官上与文字对齐 */
    width: auto;
    vertical-align: middle;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    .ca-base-layout-footer {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }

    .ca-base-layout-footer__beian {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
</style>
