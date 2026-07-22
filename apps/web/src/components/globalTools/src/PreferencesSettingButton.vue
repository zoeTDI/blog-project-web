<script setup lang="ts">
  import type { ButtonProps } from '@/components/globalTools';
  import { computed, onMounted, ref, watch } from 'vue';
  import { CaDrawer } from '@/components/ca/caDrawer';
  import { Cog8ToothIcon } from '@heroicons/vue/24/outline';
  import CaSwitch, { type SwitchOption } from '@/components/ca/caSwitch';
  import {
    customPreferences,
    customPreferencesExtension,
    preferenceManager,
    preferences,
  } from '@/core/preferences';
  import { type RouteRecordNormalized, useRouter } from 'vue-router';
  import { CaRow, CaCol } from '@caldm/ui';
  import { CaButton } from '@/components/ca/caButton';
  import {
    type CustomPreferencesRecord,
    type Preferences,
    TIMEZONE_OPTIONS,
  } from '@caldm/core';
  import { CaSelect, CaSelectOption } from '@caldm/ui';

  withDefaults(defineProps<ButtonProps>(), {
    shape: 'rounded',
  });

  const TAB_OPTION: SwitchOption[] = [
    { value: 'app', label: '网站设置' },
    { value: 'breadcrumb', label: '面包屑设置' },
    { value: 'copyright', label: '版权设置' },
    { value: 'header', label: '顶栏设置' },
    { value: 'footer', label: '底栏设置' },
    { value: 'logo', label: 'logo设置' },
    { value: 'navigation', label: '导航设置' },
    { value: 'theme', label: '主题设置' },
    { value: 'transition', label: '动画设置' },
    { value: 'widgetPreferences', label: '功能设置' },
    { value: 'custom', label: customPreferencesExtension.tabLabel },
  ] as const;
  const THEME_OPTION: SwitchOption[] = [
    { value: 'light', label: '明亮模式' },
    { value: 'dark', label: '暗黑模式' },
  ];
  type TabValue = (typeof TAB_OPTION)[number]['value'];

  const router = useRouter();

  const caDrawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

  const curTab = ref<TabValue>(TAB_OPTION[0].value);
  const formState = ref<Preferences>({
    app: {
      defaultAvatar: '',
      defaultHomePath: '',
      locale: 'zh-CN',
      timezone: TIMEZONE_OPTIONS.UTC,
      websiteName_zh_CN: '',
      websiteName_en_US: '',
    },
    breadcrumb: {
      enable: false,
      hideOnlyOne: false,
      showHome: false,
      showIcon: false,
      styleType: 'normal',
    },
    copyright: {
      gonganRecordNumber: '',
      gonganRecordNumberLink: '',
      icpRecordNumber: '',
      icpRecordNumberLink: '',
      beianExtra: '',
      companyName: '',
      date: '',
      owner: '',
      privacyPolicyLink: '',
      rightsText: '',
      termsLink: '',
    },
    footer: {
      enable: false,
      fixed: false,
      height: 60,
    },
    header: {
      enable: false,
      fixed: false,
      height: 60,
    },
    logo: {
      enable: false,
      fit: 'contain',
      source: '',
      sourceDark: '',
    },
    navigation: {},
    theme: {
      mode: 'light',
      colorPrimary: '#1677ff',
    },
    transition: {
      enable: false,
      loading: false,
      name: '',
      progress: false,
    },
    widgetPreferences: {
      themeToggle: false,
      languageToggle: false,
      timezoneToggle: false,
    },
  });

  const customFormState = ref<CustomPreferencesRecord>({});
  const transitionName = ref('slide-forward');

  const lightLogoError = ref(false);
  const darkLogoError = ref(false);

  const homePathOptions = computed(() => {
    const routes = router.getRoutes();
    return routes
      .filter(
        (route: RouteRecordNormalized) => route.meta?.allowDefaultHome === true
      )
      .map((route: RouteRecordNormalized) => ({
        label: route.meta.title,
        value: route.path,
      }));
  });

  const openDrawer = () => {
    if (!caDrawerRef.value) return;
    caDrawerRef.value.open();
  };

  const saveFormState = () => {
    preferenceManager.updatePreferences(formState.value);
    preferenceManager.updateCustomPreferences(customFormState.value);
  };

  const resetFormState = () => {
    preferenceManager.resetPreferences();

    formState.value = JSON.parse(JSON.stringify(preferences));
    customFormState.value = JSON.parse(JSON.stringify(customPreferences));
  };

  watch(curTab, (newVal, oldVal) => {
    const oldIndex = TAB_OPTION.findIndex((o) => o.value === oldVal);
    const newIndex = TAB_OPTION.findIndex((o) => o.value === newVal);
    transitionName.value =
      newIndex > oldIndex ? 'slide-forward' : 'slide-backward';
  });

  watch(
    () => formState.value.logo.source,
    () => {
      lightLogoError.value = false;
    }
  );
  watch(
    () => formState.value.logo.sourceDark,
    () => {
      darkLogoError.value = false;
    }
  );

  onMounted(async () => {
    formState.value = JSON.parse(JSON.stringify(preferences));
    customFormState.value = JSON.parse(JSON.stringify(customPreferences));
  });
</script>

<template>
  <div class="tool-wrapper">
    <button
      :class="['tool-btn', shape]"
      @click="openDrawer()"
      title="打开偏好设置">
      <cog8-tooth-icon class="icon" />
    </button>
    <ca-drawer ref="caDrawerRef">
      <template #header>
        <div class="btns">
          <ca-button
            type="primary"
            @click="resetFormState"
            >重置偏好设置</ca-button
          >
          <ca-button
            type="primary"
            @click="saveFormState"
            >保存偏好设置</ca-button
          >
        </div>
      </template>
      <div class="preferences-setting-container">
        <header class="header">
          <ca-switch
            v-model="curTab"
            mode="full"
            :options="TAB_OPTION" />
        </header>
        <div class="tab-container">
          <transition-group :name="transitionName">
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[0].value"
              :key="TAB_OPTION[0].value"
              :id="TAB_OPTION[0].value">
              <div class="tab-title">
                {{ TAB_OPTION[0].label }}
              </div>
              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>网站名称（中文）：</label>
                      <input
                        type="text"
                        v-model="formState.app.websiteName_zh_CN"
                        placeholder="请输入网站名称" />
                    </div>
                  </ca-col>

                  <ca-col :span="12">
                    <div class="form-item">
                      <label>网站名称（英文）：</label>
                      <input
                        type="text"
                        v-model="formState.app.websiteName_en_US"
                        placeholder="请输入网站名称" />
                    </div>
                  </ca-col>

                  <ca-col :span="12">
                    <div class="form-item">
                      <label>默认主页路径：</label>
                      <select v-model="formState.app.defaultHomePath">
                        <option value="">请选择默认主页</option>
                        <option
                          v-for="option in homePathOptions"
                          :key="option.value"
                          :value="option.value">
                          {{ option.label }} ({{ option.value }})
                        </option>
                      </select>
                    </div>
                  </ca-col>

                  <ca-col :span="12">
                    <div class="form-item">
                      <label>默认头像地址：</label>
                      <input
                        type="text"
                        v-model="formState.app.defaultAvatar"
                        placeholder="请输入图片URL" />
                    </div>
                  </ca-col>

                  <ca-col :span="24">
                    <div class="form-item row">
                      <label>默认语言：</label>
                      <select v-model="formState.app.locale">
                        <option value="zh-CN">简体中文 (zh-CN)</option>
                        <option value="en-US">English (en-US)</option>
                      </select>
                    </div>
                  </ca-col>

                  <ca-col :span="24">
                    <div class="form-item row">
                      <label>网站时区：</label>
                      <select v-model="formState.app.timezone">
                        <option
                          v-for="tz in Object.values(TIMEZONE_OPTIONS)"
                          :key="tz"
                          :value="tz">
                          {{ tz }}
                        </option>
                      </select>
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[1].value"
              :key="TAB_OPTION[1].value"
              :id="TAB_OPTION[1].value">
              <div class="tab-title">
                {{ TAB_OPTION[1].label }}
              </div>
              <div class="from-container">
                <ca-row :gap="20">
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="bc-enable"
                        v-model="formState.breadcrumb.enable" />
                      <label for="bc-enable">启用面包屑导航</label>
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="bc-hide"
                        v-model="formState.breadcrumb.hideOnlyOne" />
                      <label for="bc-hide">只有一个节点时自动隐藏</label>
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="bc-home"
                        v-model="formState.breadcrumb.showHome" />
                      <label for="bc-home">显示首页图标</label>
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="bc-icon"
                        v-model="formState.breadcrumb.showIcon" />
                      <label for="bc-icon">显示级联菜单图标</label>
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <label>面包屑展示风格：</label>
                      <select v-model="formState.breadcrumb.styleType">
                        <option value="normal">普通风格 (normal)</option>
                        <option value="background">
                          背景高亮风格 (background)
                        </option>
                      </select>
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[2].value"
              :key="TAB_OPTION[2].value"
              :id="TAB_OPTION[2].value">
              <div class="tab-title">
                {{ TAB_OPTION[2].label }}
              </div>
              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>版权所属人 (个人网站)：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.owner" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>版权所属企业 (非个人网站)：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.companyName" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>版权年份范围：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.date"
                        placeholder="例如: 2024-2026" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>权利声明文本：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.rightsText" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>ICP 备案号：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.icpRecordNumber"
                        placeholder="京ICP备xxxxxx号" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>ICP 备案查询链接：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.icpRecordNumberLink" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>公安联网备案号：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.gonganRecordNumber"
                        placeholder="京公网安备 xxxxxx号" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>公安备案查询链接：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.gonganRecordNumberLink" />
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item text-area-item">
                      <label>特殊地区补充备案警示语：</label>
                      <textarea
                        v-model="formState.copyright.beianExtra"
                        rows="2"></textarea>
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>隐私政策条款链接：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.privacyPolicyLink" />
                    </div>
                  </ca-col>
                  <ca-col :span="12">
                    <div class="form-item">
                      <label>服务使用协议链接：</label>
                      <input
                        type="text"
                        v-model="formState.copyright.termsLink" />
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[3].value"
              :key="TAB_OPTION[3].value"
              :id="TAB_OPTION[3].value">
              <div class="tab-title">
                {{ TAB_OPTION[3].label }}
              </div>
              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="header-enable"
                        v-model="formState.header.enable" />
                      <label for="header-enable">启用顶栏</label>
                    </div>
                  </ca-col>
                  <ca-col
                    :span="24"
                    v-if="formState.header.enable">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="header-fixed"
                        v-model="formState.header.fixed" />
                      <label for="header-fixed">固定顶栏 (Fixed)</label>
                    </div>
                  </ca-col>
                  <ca-col
                    :span="24"
                    v-if="formState.header.enable">
                    <div class="form-item row">
                      <label>顶栏高度 (px)：</label>
                      <input
                        type="number"
                        v-model.number="formState.header.height" />
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[4].value"
              :key="TAB_OPTION[4].value"
              :id="TAB_OPTION[4].value">
              <div class="tab-title">
                {{ TAB_OPTION[4].label }}
              </div>
              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="footer-enable"
                        v-model="formState.footer.enable" />
                      <label for="footer-enable">启用底栏</label>
                    </div>
                  </ca-col>
                  <ca-col
                    :span="24"
                    v-if="formState.footer.enable">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="footer-fixed"
                        v-model="formState.footer.fixed" />
                      <label for="footer-fixed">固定底栏 (Fixed)</label>
                    </div>
                  </ca-col>
                  <ca-col
                    :span="24"
                    v-if="formState.footer.enable">
                    <div class="form-item row">
                      <label>底栏高度 (px)：</label>
                      <input
                        type="number"
                        v-model.number="formState.footer.height" />
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[5].value"
              :key="TAB_OPTION[5].value"
              :id="TAB_OPTION[5].value">
              <div class="tab-title">
                {{ TAB_OPTION[5].label }}
              </div>
              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        v-model="formState.logo.enable" />
                      <label>显示网站 Logo</label>
                    </div>
                  </ca-col>

                  <ca-col
                    :span="12"
                    v-if="formState.logo.enable">
                    <div class="form-item">
                      <label>Logo 地址 (明亮模式)：</label>
                      <input
                        type="text"
                        v-model="formState.logo.source"
                        placeholder="请输入图片URL" />

                      <div class="image-preview-wrapper preview-light">
                        <div
                          v-if="!formState.logo.source"
                          class="preview-placeholder">
                          <span>暂无图片</span>
                        </div>
                        <div
                          v-else-if="lightLogoError"
                          class="preview-placeholder is-error">
                          <span>图片加载失败</span>
                        </div>
                        <img
                          v-else
                          :src="formState.logo.source"
                          @error="lightLogoError = true"
                          alt="明亮模式预览"
                          class="preview-img" />
                      </div>
                    </div>
                  </ca-col>

                  <ca-col
                    :span="12"
                    v-if="formState.logo.enable">
                    <div class="form-item">
                      <label>Logo 地址 (暗色模式）（可选）：</label>
                      <input
                        type="text"
                        v-model="formState.logo.sourceDark"
                        placeholder="请输入图片URL" />

                      <div class="image-preview-wrapper preview-dark">
                        <div
                          v-if="!formState.logo.sourceDark"
                          class="preview-placeholder">
                          <span>暂无图片</span>
                        </div>
                        <div
                          v-else-if="darkLogoError"
                          class="preview-placeholder is-error">
                          <span>图片加载失败</span>
                        </div>
                        <img
                          v-else
                          :src="formState.logo.sourceDark"
                          @error="darkLogoError = true"
                          alt="暗色模式预览"
                          class="preview-img" />
                      </div>
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <label>Logo 缩放适应方式：</label>
                      <select v-model="formState.logo.fit">
                        <option value="contain">contain</option>
                        <option value="cover">cover</option>
                        <option value="fill">fill</option>
                        <option value="none">none</option>
                        <option value="scale-down">scale-down</option>
                      </select>
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[6].value"
              :key="TAB_OPTION[6].value"
              :id="TAB_OPTION[6].value">
              <div class="tab-title">
                {{ TAB_OPTION[6].label }}
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[7].value"
              :key="TAB_OPTION[7].value"
              :id="TAB_OPTION[7].value">
              <div class="tab-title">
                {{ TAB_OPTION[7].label }}
              </div>
              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="24">
                    <div class="form-item row">
                      <label>默认主题模式：</label>
                      <ca-switch
                        v-model="formState.theme.mode"
                        :options="THEME_OPTION"
                        mode="full" />
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <label>系统主题色 (colorPrimary)：</label>
                      <div class="color-input-wrapper">
                        <input
                          type="text"
                          v-model="formState.theme.colorPrimary"
                          placeholder="支持 #hex, rgb, rgba, hsl 或颜色名称" />

                        <input
                          type="color"
                          v-model="formState.theme.colorPrimary"
                          class="color-picker-trigger"
                          title="点击打开颜色选择器" />
                        <br />
                      </div>
                    </div>
                    <p class="field-tip">
                      请输入十六进制的 CSS 颜色值，例如：#1677ff
                    </p>
                  </ca-col>
                  <!-- <ca-col :span="24"> </ca-col> -->
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[8].value"
              :key="TAB_OPTION[8].value"
              :id="TAB_OPTION[8].value">
              <div class="tab-title">
                {{ TAB_OPTION[8].label }}
              </div>

              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="trans-enable"
                        v-model="formState.transition.enable" />
                      <label for="trans-enable">开启路由页面切换动画</label>
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <label>动画名称 (CSS 类名)：</label>
                      <input
                        type="text"
                        v-model="formState.transition.name"
                        placeholder="例如: fade / slide" />
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="trans-loading"
                        v-model="formState.transition.loading" />
                      <label for="trans-loading"
                        >开启全局全屏 Loading 状态</label
                      >
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="trans-progress"
                        v-model="formState.transition.progress" />
                      <label for="trans-progress"
                        >显示顶部页面加载进度条 (NProgress)</label
                      >
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[9].value"
              :key="TAB_OPTION[9].value"
              :id="TAB_OPTION[9].value">
              <div class="tab-title">
                {{ TAB_OPTION[9].label }}
              </div>

              <div class="form-container">
                <ca-row :gap="20">
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="widget-theme"
                        v-model="formState.widgetPreferences.themeToggle" />
                      <label for="widget-theme">在顶栏展示“主题切换”按钮</label>
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="widget-lang"
                        v-model="formState.widgetPreferences.languageToggle" />
                      <label for="widget-lang"
                        >在顶栏展示“语言切换”多选菜单</label
                      >
                    </div>
                  </ca-col>
                  <ca-col :span="24">
                    <div class="form-item row">
                      <input
                        type="checkbox"
                        id="widget-tz"
                        v-model="formState.widgetPreferences.timezoneToggle" />
                      <label for="widget-tz">在顶栏展示“时区切换”挂件</label>
                    </div>
                  </ca-col>
                </ca-row>
              </div>
            </section>
            <section
              class="tab-section"
              v-show="curTab === TAB_OPTION[10].value"
              :key="TAB_OPTION[10].value"
              :id="TAB_OPTION[10].value">
              <ca-row :gap="20">
                <ca-col
                  v-for="field in customPreferencesExtension.fields"
                  :key="field.key"
                  :span="24">
                  <div class="form-item">
                    <label>{{ field.label }}</label>
                    <template v-if="field.component === 'switch'">
                      <input
                        type="checkbox"
                        v-model="customFormState[field.key]" />
                    </template>

                    <template v-else-if="field.component === 'select'">
                      <ca-select v-model="customFormState[field.key]">
                        <ca-select-option
                          v-for="opt in field.options"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value" />
                      </ca-select>
                    </template>

                    <template v-else-if="field.component === 'number'">
                      <input
                        type="number"
                        v-model.number="customFormState[field.key]"
                        v-bind="field.componentProps" />
                    </template>

                    <template v-else>
                      <input
                        type="text"
                        v-model="customFormState[field.key]"
                        :placeholder="field.placeholder" />
                    </template>
                    <p
                      v-if="field.tip"
                      class="field-tip">
                      {{ field.tip }}
                    </p>
                  </div>
                </ca-col>
              </ca-row>
            </section>
          </transition-group>
        </div>
      </div>
    </ca-drawer>
  </div>
</template>

<style scoped>
  @import 'style.css';

  .preferences-setting-container {
    width: 100%;
    max-width: 800px;
  }

  .header {
    width: 100%;
    overflow-x: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .header::-webkit-scrollbar {
    display: none;
  }

  .tab-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    flex: 1;
  }

  .tab-section {
    width: 96%;
    margin: 20px auto;
  }
  .tab-section .tab-title {
    font-size: 24px;
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--color-border);
  }

  .form-container {
    padding: 8px 4px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .form-item label {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    user-select: none;
  }

  .form-item.row {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    padding: 4px 0;
  }

  .form-item.row.text-area-item {
    align-items: flex-start;
  }
  .form-item.row.text-area-item label {
    margin-top: 8px;
  }

  .form-item.row label {
    white-space: nowrap;
  }

  .form-item.row input[type='text'],
  .form-item.row input[type='number'],
  .form-item.row select,
  .form-item.row textarea {
    flex: 1;
  }

  .form-item.checkbox-item {
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
  }

  .form-item.checkbox-item input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #1677ff;
  }

  .form-item.checkbox-item label {
    cursor: pointer;
    font-weight: normal;
  }

  .form-item input[type='text'],
  .form-item input[type='number'],
  .form-item select,
  .form-item textarea {
    width: 100%;
    font-size: 14px;
    color: #333333;
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    outline: none;
    box-sizing: border-box;
  }

  .form-item input[type='text'],
  .form-item input[type='number'],
  .form-item select {
    height: 38px;
    padding: 0 12px;
  }

  .form-item textarea {
    min-height: 80px;
    padding: 8px 12px;
    resize: vertical;
    line-height: 1.5;
    font-family: inherit;
  }

  .form-item select {
    padding-right: 28px;
    cursor: pointer;
  }

  .form-item input[type='text']:hover,
  .form-item input[type='number']:hover,
  .form-item select:hover,
  .form-item textarea:hover {
    border-color: #40a9ff;
  }

  .form-item input[type='text']:focus,
  .form-item input[type='number']:focus,
  .form-item select:focus,
  .form-item textarea:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
  }

  .form-item input::placeholder {
    color: #bfbfbf;
  }

  .field-tip {
    font-size: 12px;
    color: var(--color-text-primary);
    margin-top: -8px;
    margin-left: 5px;
    margin-bottom: 12px;
  }

  .color-input-wrapper {
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .color-picker-trigger {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 36px;
    height: 36px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
  }

  /* —— 新增：图片预览专属样式区域 —— */
  .image-preview-wrapper {
    margin-top: 8px;
    width: 100%;
    height: 110px;
    border: 1px dashed #e2e8f0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-sizing: border-box;
    transition: background-color 0.2s ease;
  }

  /* 明亮预览：灰白底色 */
  .image-preview-wrapper.preview-light {
    background-color: #f8fafc;
  }

  /* 暗色预览：纯深色底色，用于突显白色的暗色Logo */
  .image-preview-wrapper.preview-dark {
    background-color: #1e1e24;
    border-color: #3f3f46;
  }

  .preview-placeholder {
    font-size: 13px;
    color: #94a3b8;
    user-select: none;
  }

  /* 失败状态文本标红 */
  .preview-placeholder.is-error {
    color: #ef4444;
  }

  .preview-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    padding: 8px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
    column-gap: 20px;
  }

  .slide-forward-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-forward-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-backward-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-backward-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .slide-forward-enter-active,
  .slide-forward-leave-active,
  .slide-backward-enter-active,
  .slide-backward-leave-active {
    transition:
      transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
      opacity 0.35s ease;
  }

  .slide-forward-leave-active,
  .slide-backward-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
</style>
