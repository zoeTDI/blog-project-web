import type {
  CustomPreferencesRecord,
  PreferencesExtension,
} from '@caldm/core';

const defaultCustomPreference: CustomPreferencesRecord = {
  showAnnouncement: true, // 对应 switch
  announcementText: '欢迎访问电子灭虫录！', // 对应 input
  maxMomentsCount: 10, // 对应 number
  contentGravity: 'left', // 对应 select
};

const customPreferencesExtension: PreferencesExtension<
  typeof defaultCustomPreference
> = {
  tabLabel: '个性化配置',
  title: '扩展功能设置',
  fields: [
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
