<script setup lang="ts">
  import { preferences } from '@/core/preferences';
  import { useCSSNamespace } from '@caldm/hook';
  import { computed } from 'vue';

  const ns = useCSSNamespace('base-layout-footer');

  const { copyright } = preferences;

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
  <footer
    :class="classes"
    :style="styles">
    <div :class="ns.e('container')">
      <div :class="ns.e('main')">
        <div :class="ns.e('copyright')">
          <span>© {{ copyright.date || new Date().getFullYear() }}</span>
          <span v-if="copyright.companyName || copyright.owner">
            {{ copyright.companyName || copyright.owner }}
          </span>
          <span v-if="copyright.rightsText">
            {{ copyright.rightsText }}
          </span>
        </div>

        <div
          v-if="copyright.termsLink || copyright.privacyPolicyLink"
          :class="ns.e('links')">
          <a
            v-if="copyright.termsLink"
            :href="copyright.termsLink"
            target="_blank"
            rel="noopener noreferrer"
            :class="ns.e('link')">
            服务条款
          </a>
          <span
            v-if="copyright.termsLink && copyright.privacyPolicyLink"
            :class="ns.e('divider')">
            |
          </span>
          <a
            v-if="copyright.privacyPolicyLink"
            :href="copyright.privacyPolicyLink"
            target="_blank"
            rel="noopener noreferrer"
            :class="ns.e('link')">
            隐私政策
          </a>
        </div>
      </div>

      <div
        v-if="
          copyright.gonganRecordNumber ||
          copyright.icpRecordNumber ||
          copyright.beianExtra
        "
        :class="ns.e('beian')">
        <a
          v-if="copyright.gonganRecordNumber"
          :href="
            copyright.gonganRecordNumberLink || 'https://beian.mps.gov.cn/'
          "
          target="_blank"
          rel="noopener noreferrer"
          :class="ns.e('item')">
          <img
            src="@/assets/备案编号图标.png"
            alt="公安备案图标"
            :class="ns.e('gongan-icon')" />
          <span>{{ copyright.gonganRecordNumber }}</span>
        </a>

        <a
          v-if="copyright.icpRecordNumber"
          :href="copyright.icpRecordNumberLink || 'https://beian.miit.gov.cn/'"
          target="_blank"
          rel="noopener noreferrer"
          :class="ns.e('item')">
          <span>{{ copyright.icpRecordNumber }}</span>
        </a>

        <span
          v-if="copyright.beianExtra"
          :class="ns.e('extra')">
          {{ copyright.beianExtra }}
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  /* 根容器基类 */
  .ca-base-layout-footer {
    width: 100%;
    height: var(--ca-base-layout-footer-height, auto);
    padding: 24px 16px;
    box-sizing: border-box;
    font-size: 13px;
    color: var(--color-text-primary, #666666);
    background-color: transparent;
    transition: opacity 0.3s ease;
  }

  .ca-base-layout-footer__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* 主区域：版权 + 法律条款 */
  .ca-base-layout-footer__main {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 24px;
  }

  /* 版权文本组合 */
  .ca-base-layout-footer__copyright {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  /* 法律条款链接 */
  .ca-base-layout-footer__links {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ca-base-layout-footer__link {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .ca-base-layout-footer__link:hover {
    color: var(--color-text-primary, #409eff);
  }

  .ca-base-layout-footer__divider {
    opacity: 0.4;
    font-size: 12px;
  }

  /* 备案信息栏 */
  .ca-base-layout-footer__beian {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 20px;
    font-size: 12px;
    opacity: 0.85;
  }

  .ca-base-layout-footer__item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .ca-base-layout-footer__item:hover {
    color: var(--color-text-primary, #409eff);
  }

  .ca-base-layout-footer__gongan-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
  }

  .ca-base-layout-footer__extra {
    opacity: 0.75;
  }
</style>