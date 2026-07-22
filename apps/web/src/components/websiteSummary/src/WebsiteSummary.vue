<script setup lang="ts">
  import { customPreferences, preferences } from '@/core/preferences';
  import { getDynamicText } from '@/utils/translate.ts';
  import { ROUTER_NAMES } from '@/router/routerNames.ts';
  import { useRouter } from 'vue-router';

  const props = withDefaults(
    defineProps<{
      logoUrl?: string | null;
    }>(),
    {}
  );

  const router = useRouter();
  const toHome = () => {
    router.push({ name: ROUTER_NAMES.HOME });
  };
</script>

<template>
  <div
    class="website-summary"
    @click="toHome">
    <div
      class="logo-img-wrapper"
      v-if="props.logoUrl && props.logoUrl.trim() !== ''">
      <img
        :src="props.logoUrl"
        alt="logo" />
    </div>
    <div class="logo-text-group">
      <div class="site-title">
        {{
          getDynamicText({
            'zh-CN': preferences.app.websiteName_zh_CN,
            'en-US': preferences.app.websiteName_en_US,
          }) || "BLOG'S TITLE"
        }}
      </div>
      <div class="site-slogan">
        {{
          getDynamicText({
            'zh-CN': customPreferences.websiteSubName_zh_CN,
            'en-US': customPreferences.websiteSubName_en_US,
          })
        }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .website-summary {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  .website-summary:hover {
    opacity: 0.8;
  }

  .logo-img-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-img {
    height: 40px;
    width: auto;
    transition: filter 0.4s ease;
  }

  .logo-text-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.2;
  }

  .site-title {
    font-family: var(--font-h);
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-h);
    letter-spacing: 1px;
  }

  .site-slogan {
    font-family: var(--font-text);
    font-size: 11px;
    color: var(--color-text-primary);
    opacity: 0.7;
    letter-spacing: 1px;
    margin-top: 2px;
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    .site-title {
      font-size: 18px;
    }

    .site-slogan {
      font-size: 10px;
    }

    .logo-img {
      height: 32px;
    }
  }
</style>
