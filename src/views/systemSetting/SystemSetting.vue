<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import {
    customPreferences,
    type CustomPreferencesRecord,
    preferenceManager,
    preferences,
    type Preferences,
  } from '@/core/preferences';
  import { TIMEZONE_OPTIONS } from '@/core/preferences';
  import { type RouteRecordNormalized, useRouter } from 'vue-router';
  import { CaCard } from '@/components/ca/caCard';

  const router = useRouter();

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

  const formState = ref<Preferences>({
    app: {
      defaultAvatar: '',
      defaultHomePath: '',
      locale: 'zh-CN',
      timezone: TIMEZONE_OPTIONS.UTC,
      watermark: false,
      watermarkContent: '',
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

  /**
   * 偏好设置更新保存
   */
  const handleSavePreferences = () => {
    // 调用preferenceManager提供的更新方法进行更新
    preferenceManager.updatePreferences(formState.value);
    reloadPreferences();
  };

  /**
   * 重置偏好设置
   */
  const handleResetPreferences = () => {
    preferenceManager.resetPreferences();
    reloadPreferences();
  };

  const reloadPreferences = () => {
    formState.value = JSON.parse(JSON.stringify(preferences));
  };

  /**
   * 自定义偏好更新保存
   */
  const handleSaveCustomPreference = () => {
    preferenceManager.updateCustomPreferences(customFormState.value);
    reloadCustomPreferences();
  };

  /**
   * 重置自定义偏好设置
   */
  const handleResetCustomPreferences = () => {
    preferenceManager.resetCustomPreferences();
    reloadCustomPreferences();
  };

  const reloadCustomPreferences = () => {
    customFormState.value = JSON.parse(JSON.stringify(customPreferences));
  };

  onMounted(() => {
    // 获取只读形式的preference数据并保存为副本
    formState.value = JSON.parse(JSON.stringify(preferences));
    // 获取只读形式的customPreference数据并保存为副本
    customFormState.value = JSON.parse(JSON.stringify(customPreferences));
  });
</script>

<template>
  <ca-card>
    <div class="wrapper">
      <div class="page-card">
        <h2>系统偏好设置</h2>
        <form
          @submit.prevent="handleSavePreferences"
          class="setting-form">
          <fieldset class="form-section">
            <legend>应用全局配置</legend>
            <div class="form-item">
              <label>网站名称（中文）：</label>
              <input
                type="text"
                v-model="formState.app.websiteName_zh_CN"
                placeholder="请输入网站名称" />
            </div>
            <div class="form-item">
              <label>网站名称（英文）：</label>
              <input
                type="text"
                v-model="formState.app.websiteName_en_US"
                placeholder="请输入网站名称" />
            </div>
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
            <div class="form-item">
              <label>默认头像地址：</label>
              <input
                type="text"
                v-model="formState.app.defaultAvatar"
                placeholder="请输入图片URL" />
            </div>
            <div class="form-item row">
              <label>默认语言：</label>
              <select v-model="formState.app.locale">
                <option value="zh-CN">简体中文 (zh-CN)</option>
                <option value="en-US">English (en-US)</option>
              </select>
            </div>
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
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="app-watermark"
                v-model="formState.app.watermark" />
              <label for="app-watermark">开启全站水印</label>
            </div>
            <div
              class="form-item"
              v-if="formState.app.watermark">
              <label>水印文案：</label>
              <input
                type="text"
                v-model="formState.app.watermarkContent"
                placeholder="请输入水印文案" />
            </div>
          </fieldset>

          <fieldset class="form-section">
            <legend>主题风格</legend>
            <div class="form-item row">
              <label>核心主题模式：</label>
              <select v-model="formState.theme.mode">
                <option value="light">明亮模式 (Light)</option>
                <option value="dark">暗黑模式 (Dark)</option>
              </select>
            </div>
          </fieldset>

          <fieldset class="form-section">
            <legend>Logo配置</legend>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="logo-enable"
                v-model="formState.logo.enable" />
              <label for="logo-enable">显示网站 Logo</label>
            </div>
            <template v-if="formState.logo.enable">
              <div class="form-item">
                <label>Logo 地址 (明亮模式)：</label>
                <input
                  type="text"
                  v-model="formState.logo.source"
                  placeholder="请输入图片URL" />
              </div>
              <div class="form-item">
                <label>Logo 地址 (暗色模式可选)：</label>
                <input
                  type="text"
                  v-model="formState.logo.sourceDark"
                  placeholder="请输入图片URL" />
              </div>
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
            </template>
          </fieldset>

          <fieldset class="form-section">
            <legend>布局组件 (布局结构控制)</legend>
            <div class="layout-group">
              <div class="layout-sub-section">
                <h4>顶栏设置 (Header)</h4>
                <div class="form-item checkbox-item">
                  <input
                    type="checkbox"
                    id="header-enable"
                    v-model="formState.header.enable" />
                  <label for="header-enable">启用顶栏</label>
                </div>
                <div
                  class="form-item checkbox-item"
                  v-if="formState.header.enable">
                  <input
                    type="checkbox"
                    id="header-fixed"
                    v-model="formState.header.fixed" />
                  <label for="header-fixed">固定顶栏 (Fixed)</label>
                </div>
                <div
                  class="form-item"
                  v-if="formState.header.enable">
                  <label>顶栏高度 (px)：</label>
                  <input
                    type="number"
                    v-model.number="formState.header.height" />
                </div>
              </div>

              <div class="layout-sub-section">
                <h4>底栏设置 (Footer)</h4>
                <div class="form-item checkbox-item">
                  <input
                    type="checkbox"
                    id="footer-enable"
                    v-model="formState.footer.enable" />
                  <label for="footer-enable">启用底栏</label>
                </div>
                <div
                  class="form-item checkbox-item"
                  v-if="formState.footer.enable">
                  <input
                    type="checkbox"
                    id="footer-fixed"
                    v-model="formState.footer.fixed" />
                  <label for="footer-fixed">固定底栏 (Fixed)</label>
                </div>
                <div
                  class="form-item"
                  v-if="formState.footer.enable">
                  <label>底栏高度 (px)：</label>
                  <input
                    type="number"
                    v-model.number="formState.footer.height" />
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-section">
            <legend>面包屑导航</legend>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="bc-enable"
                v-model="formState.breadcrumb.enable" />
              <label for="bc-enable">启用面包屑导航</label>
            </div>
            <template v-if="formState.breadcrumb.enable">
              <div class="form-item checkbox-item">
                <input
                  type="checkbox"
                  id="bc-hide"
                  v-model="formState.breadcrumb.hideOnlyOne" />
                <label for="bc-hide">只有一个节点时自动隐藏</label>
              </div>
              <div class="form-item checkbox-item">
                <input
                  type="checkbox"
                  id="bc-home"
                  v-model="formState.breadcrumb.showHome" />
                <label for="bc-home">显示首页图标</label>
              </div>
              <div class="form-item checkbox-item">
                <input
                  type="checkbox"
                  id="bc-icon"
                  v-model="formState.breadcrumb.showIcon" />
                <label for="bc-icon">显示级联菜单图标</label>
              </div>
              <div class="form-item row">
                <label>面包屑展示风格：</label>
                <select v-model="formState.breadcrumb.styleType">
                  <option value="normal">普通风格 (normal)</option>
                  <option value="background">背景高亮风格 (background)</option>
                </select>
              </div>
            </template>
          </fieldset>

          <fieldset class="form-section">
            <legend>过渡动画与加载效果</legend>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="trans-enable"
                v-model="formState.transition.enable" />
              <label for="trans-enable">开启路由页面切换动画</label>
            </div>
            <div
              class="form-item"
              v-if="formState.transition.enable">
              <label>动画名称 (CSS 类名)：</label>
              <input
                type="text"
                v-model="formState.transition.name"
                placeholder="例如: fade / slide" />
            </div>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="trans-loading"
                v-model="formState.transition.loading" />
              <label for="trans-loading">开启全局全屏 Loading 状态</label>
            </div>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="trans-progress"
                v-model="formState.transition.progress" />
              <label for="trans-progress"
                >显示顶部页面加载进度条 (NProgress)</label
              >
            </div>
          </fieldset>

          <fieldset class="form-section">
            <legend>快捷控制挂件显示控制</legend>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="widget-theme"
                v-model="formState.widgetPreferences.themeToggle" />
              <label for="widget-theme">在顶栏展示“主题切换”按钮</label>
            </div>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="widget-lang"
                v-model="formState.widgetPreferences.languageToggle" />
              <label for="widget-lang">在顶栏展示“语言切换”多选菜单</label>
            </div>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="widget-tz"
                v-model="formState.widgetPreferences.timezoneToggle" />
              <label for="widget-tz">在顶栏展示“时区切换”挂件</label>
            </div>
          </fieldset>

          <fieldset class="form-section">
            <legend>网站版权与合规备案</legend>
            <div class="form-item">
              <label>版权所属人 (个人网站)：</label>
              <input
                type="text"
                v-model="formState.copyright.owner" />
            </div>
            <div class="form-item">
              <label>版权所属企业 (非个人网站)：</label>
              <input
                type="text"
                v-model="formState.copyright.companyName" />
            </div>
            <div class="form-item">
              <label>版权年份范围：</label>
              <input
                type="text"
                v-model="formState.copyright.date"
                placeholder="例如: 2024-2026" />
            </div>
            <div class="form-item">
              <label>权利声明文本：</label>
              <input
                type="text"
                v-model="formState.copyright.rightsText" />
            </div>
            <div class="form-grid">
              <div class="form-item">
                <label>ICP 备案号：</label>
                <input
                  type="text"
                  v-model="formState.copyright.icpRecordNumber"
                  placeholder="京ICP备xxxxxx号" />
              </div>
              <div class="form-item">
                <label>ICP 备案查询链接：</label>
                <input
                  type="text"
                  v-model="formState.copyright.icpRecordNumberLink" />
              </div>
              <div class="form-item">
                <label>公安联网备案号：</label>
                <input
                  type="text"
                  v-model="formState.copyright.gonganRecordNumber"
                  placeholder="京公网安备 xxxxxx号" />
              </div>
              <div class="form-item">
                <label>公安备案查询链接：</label>
                <input
                  type="text"
                  v-model="formState.copyright.gonganRecordNumberLink" />
              </div>
            </div>
            <div class="form-item">
              <label>特殊地区补充备案警示语：</label>
              <textarea
                v-model="formState.copyright.beianExtra"
                rows="2"></textarea>
            </div>
            <div class="form-grid">
              <div class="form-item">
                <label>隐私政策条款链接：</label>
                <input
                  type="text"
                  v-model="formState.copyright.privacyPolicyLink" />
              </div>
              <div class="form-item">
                <label>服务使用协议链接：</label>
                <input
                  type="text"
                  v-model="formState.copyright.termsLink" />
              </div>
            </div>
          </fieldset>
          <fieldset class="form-section">
            <legend>主题风格</legend>
            <div class="form-item row">
              <label>核心主题模式：</label>
              <select v-model="formState.theme.mode">
                <option value="light">明亮模式 (Light)</option>
                <option value="dark">暗黑模式 (Dark)</option>
              </select>
            </div>

            <div class="form-item">
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
              </div>
              <p class="field-tip">
                请输入合法的 CSS 颜色值，例如：#1677ff、rgba(0,0,0,0.5) 或 blue
              </p>
            </div>
          </fieldset>
          <fieldset class="form-section">
            <legend>快捷控制挂件显示控制</legend>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="widget-theme"
                v-model="formState.widgetPreferences.themeToggle" />
              <label for="widget-theme">在顶栏展示“主题切换”按钮</label>
            </div>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="widget-language"
                v-model="formState.widgetPreferences.languageToggle" />
              <label for="widget-language">在顶栏展示“语言切换”按钮</label>
            </div>
            <div class="form-item checkbox-item">
              <input
                type="checkbox"
                id="widget-timezone"
                v-model="formState.widgetPreferences.timezoneToggle" />
              <label for="widget-timezone">在顶栏展示“时区切换”按钮</label>
            </div>
          </fieldset>

          <div class="form-actions">
            <button
              type="button"
              class="btn-reset"
              @click="handleResetPreferences">
              重置配置
            </button>
            <button
              type="submit"
              class="btn-submit">
              保存配置
            </button>
          </div>
        </form>
      </div>
      <div class="page-card">
        <h2 style="margin-top: 40px">自定义偏好设置</h2>
        <form
          @submit.prevent="handleSaveCustomPreference"
          class="setting-form">
          <fieldset class="form-section">
            <legend>自定义参数配置</legend>
            <div
              v-for="key in Object.keys(customFormState)"
              :key="key"
              class="form-item">
              <label>{{ String(key) }}：</label>
              <input
                type="text"
                v-model="customFormState[key]"
                :placeholder="'请输入 ' + String(key) + ' 的内容'" />
            </div>
          </fieldset>

          <div class="form-actions">
            <button
              type="button"
              class="btn-reset"
              @click="handleResetCustomPreferences">
              重置自定义配置
            </button>
            <button
              type="submit"
              class="btn-submit"
              @click="handleSaveCustomPreference">
              保存自定义配置
            </button>
          </div>
        </form>
      </div>
    </div>
  </ca-card>
</template>

<style scoped>
  .wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
  }
  .page-card {
    width: 100%;
    background-color: #ffffff;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 24px;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    color: #1a1a1a;
    font-size: 20px;
  }

  .setting-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-section {
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    padding: 16px 20px;
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .form-section legend {
    font-weight: 600;
    color: #333333;
    padding: 0 8px;
    font-size: 14px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-item.row {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .form-item label {
    font-size: 13px;
    color: #555555;
    font-weight: 500;
  }

  .form-item input[type='text'],
  .form-item input[type='number'],
  .form-item select,
  .form-item textarea {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    font-size: 13px;
    transition: border-color 0.2s;
    box-sizing: border-box;
    width: 100%;
  }

  .color-input-wrapper {
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

  .form-item.row select {
    width: auto;
    min-width: 200px;
  }

  .form-item input:focus,
  .form-item select:focus,
  .form-item textarea:focus {
    outline: none;
    border-color: #1677ff;
  }

  /* 复选框特殊样式 */
  .checkbox-item {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    cursor: pointer;
  }

  .checkbox-item input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .checkbox-item label {
    cursor: pointer;
    user-select: none;
  }

  /* 栅格布局组 */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  /* 布局特有部分排列 */
  .layout-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .layout-sub-section {
    background-color: #fff;
    border: 1px dashed #e8e8e8;
    padding: 12px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .layout-sub-section h4 {
    margin: 0 0 4px 0;
    font-size: 13px;
    color: #222;
    border-left: 3px solid #1677ff;
    padding-left: 6px;
  }

  /* 表单提交按钮动作区 */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid #f0f0f0;
    padding-top: 16px;
  }

  .btn-submit {
    background-color: #1677ff;
    color: #fff;
    border: none;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-submit:hover {
    background-color: #4096ff;
  }

  .btn-reset {
    background-color: #ffffff;
    color: #555555;
    border: 1px solid #d9d9d9;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-reset:hover {
    color: #ff4d4f;
    border-color: #ff4d4f;
    background-color: #fff2f0;
  }
</style>
