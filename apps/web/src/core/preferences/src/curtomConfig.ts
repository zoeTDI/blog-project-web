import type {
  CustomPreferencesRecord,
  PreferencesExtension,
} from '@caldm/core';

const defaultCustomPreference = {
  watermark: false as boolean,
  watermarkContent: 'caldm.cn',
  websiteSubName_zh_CN: '记录、探索与生活的极简志',
  websiteSubName_en_US:
    'A minimalist journal of recording, exploring, and life',
  signature_zh_CN: '',
  signature_en_US: '',
  websiteMaster: 'Caldm',
  showAnnouncement: true as boolean, // 对应 switch
  announcementText: '欢迎访问电子灭虫录！', // 对应 input
  maxMomentsCount: 10, // 对应 number
  contentGravity: 'left', // 对应 select
} satisfies CustomPreferencesRecord;

export type CustomPreferencesType = typeof defaultCustomPreference;

const customPreferencesExtension: PreferencesExtension<
  typeof defaultCustomPreference
> = {
  tabLabel: '个性化配置',
  title: '扩展功能设置',
  fields: [
    {
      key: 'watermark',
      component: 'switch',
      label: '开启全站水印',
      tip: '开启后会在图片中添加水印内容',
      defaultValue: false,
    },
    {
      key: 'watermarkContent',
      component: 'input',
      label: '水印内容',
      defaultValue: 'caldm.cn',
    },
    {
      key: 'websiteSubName_zh_CN',
      component: 'input',
      label: '网站副标题（中文）',
      defaultValue: '记录、探索与生活的极简志',
    },
    {
      key: 'websiteSubName_en_US',
      component: 'input',
      label: '网站副标题（英文）',
      defaultValue: 'A minimalist journal of recording, exploring, and life',
    },
    {
      key: 'signature_zh_CN',
      component: 'input',
      label: '个性签名（中文）',
      defaultValue: '',
    },
    {
      key: 'signature_en_US',
      component: 'input',
      label: '个性签名（英文）',
      defaultValue: '',
    },
    {
      key: 'websiteMaster',
      component: 'input',
      label: '站长名称',
      defaultValue: 'Caldm',
    },
    {
      key: 'showAnnouncement',
      component: 'switch',
      label: '显示系统公告',
      tip: '开启后将在首页顶部显示滚动公告',
      defaultValue: true,
    },
    {
      key: 'announcementText',
      component: 'input',
      label: '公告内容',
      placeholder: '请输入要显示的公告文字',
      defaultValue: '欢迎访问电子灭虫录！',
    },
    {
      key: 'maxMomentsCount',
      component: 'number',
      label: '动态每页显示数量',
      componentProps: { min: 1, max: 50 },
      defaultValue: 10,
    },
    {
      key: 'contentGravity',
      component: 'select',
      label: '正文对齐方式',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      defaultValue: 'left',
    },
  ],
};

export { defaultCustomPreference, customPreferencesExtension };
