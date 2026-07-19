<script setup lang="ts">
  import { LanguageIcon } from '@heroicons/vue/24/outline';
  import { type ButtonProps, MenuPopover } from '@/components/globalTools';
  import { computed, ref } from 'vue';
  import {
    preferenceManager,
    preferences,
    SUPPORT_LANGUAGE_OPTIONS,
    type SupportLanguageOption,
  } from '@/core/preferences';
  import { useI18n } from 'vue-i18n';

  withDefaults(defineProps<ButtonProps>(), {
    shape: 'rounded',
  });

  const { locale } = useI18n();

  const languages = Object.values(SUPPORT_LANGUAGE_OPTIONS).map(
    (option: string) => ({ label: option, value: option })
  );

  const activeMenu = ref<string | null>(null);

  /**
   * 当前的网站语言
   */
  const curLanguage = computed(() => preferences.app.locale);

  const toggleMenu = (menu: string, event: MouseEvent) => {
    event.stopPropagation();
    activeMenu.value = activeMenu.value === menu ? null : menu;
  };

  /**
   * 更新网站语言
   */
  const updateLanguage = (value: SupportLanguageOption) => {
    // 更新用户偏好
    preferenceManager.updatePreferences({ app: { locale: value } });
    // 更改网站语言
    locale.value = value;
    // 关闭展开菜单
    activeMenu.value = null;
  };
</script>

<template>
  <div class="tool-wrapper">
    <button
      :class="['tool-btn', shape]"
      @click="toggleMenu('language', $event)"
      title="切换语言">
      <LanguageIcon class="icon" />
    </button>
    <MenuPopover
      :modelValue="activeMenu === 'language'"
      @update:modelValue="activeMenu = null"
      :options="languages"
      :selected-value="curLanguage"
      @select="(val) => updateLanguage(val)" />
  </div>
</template>

<style scoped>
  @import 'style.css';
</style>
