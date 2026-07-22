import type { Preferences } from '@caldm/core';
import { TIMEZONE_OPTIONS } from '@caldm/core';

export const defaultPreferences: Preferences = {
  app: {
    defaultAvatar: '',
    defaultHomePath: '/analysis/dashboard',
    locale: 'zh-CN',
    timezone: TIMEZONE_OPTIONS.UTC,
    websiteName_zh_CN: '电子灭虫录',
    websiteName_en_US: 'dian zi mie chong lu',
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: true,
    showHome: false,
    showIcon: false,
    styleType: 'normal',
  },
  copyright: {
    gonganRecordNumber: 'X公网安备XXXXXXXXXXX号',
    gonganRecordNumberLink: 'https://beian.mps.gov.cn/#/',
    icpRecordNumber: 'XICP备XXXXXXXXXX号',
    icpRecordNumberLink: 'https://beian.miit.gov.cn/',
    beianExtra:
      '部分地区额外要求的备案警示文字（如“贵公网安备...”有时需补充“非经营性网站备案”）',
    companyName: '网站的公司名称，适用于非个人网站',
    date: '版权日期',
    owner: '网站所有者姓名，适用于个人网站',
    privacyPolicyLink: '隐私政策链接（个人网站如果有收集用户信息建议添加）',
    rightsText: '权利声明，默认 "保留所有权利" 或 "All rights reserved"',
    termsLink: '服务条款链接（如有用户注册/评论功能）',
  },
  footer: {
    enable: true,
    fixed: false,
    height: 200,
  },
  header: {
    enable: true,
    fixed: false,
    height: 40,
  },
  logo: {
    enable: false,
    fit: 'fill',
    source: '',
    sourceDark: '',
  },
  navigation: {},
  theme: {
    mode: 'light',
    colorPrimary: '#aa3bff',
  },
  transition: {
    enable: false,
    loading: false,
    name: 'fade',
    progress: true,
  },
  widgetPreferences: {
    themeToggle: true,
    languageToggle: true,
    timezoneToggle: false,
  },
};
