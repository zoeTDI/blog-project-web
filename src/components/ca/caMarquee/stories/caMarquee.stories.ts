import { caMarquee, CaMarquee } from '@/components/ca/caMarquee';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Ca/CaMarquee',
  component: CaMarquee,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    content: {
      control: 'text',
    },
    closeable: {
      control: 'boolean',
    },
    duration: {
      control: 'number',
    },
    scrollable: {
      control: 'boolean',
    },
    speed: {
      control: 'number',
    },
  },
  args: {
    icon: 'info',
    content: 'Default Content',
    closeable: false,
    duration: 10000,
    scrollable: true,
    speed: 50,
  },
} satisfies Meta<typeof CaMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { CaMarquee },
    setup() {
      return { args };
    },
    template: `
      <CaMarquee v-bind="args"></CaMarquee>
    `,
  }),
};

export const CloseAble: Story = {
  args: {
    content: 'Default Content',
    closeable: true,
    duration: 10000,
    scrollable: true,
    speed: 50,
  },

  render: (args) => ({
    components: {
      CaMarquee,
    },

    setup() {
      return { args };
    },

    template: `
      <CaMarquee v-bind="args"></CaMarquee>
    `,
  }),
};

export const LongText: Story = {
  args: {
    icon: 'info',
    content:
      'Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text',
    closeable: false,
    duration: 10000,
    scrollable: true,
    speed: 50,
  },

  render: (args) => ({
    components: {
      CaMarquee,
    },

    setup() {
      return { args };
    },

    template: `
      <CaMarquee v-bind="args"></CaMarquee>
    `,
  }),
};

export const ImperativeCall: Story = {
  parameters: {
    // 隐藏 Storybook 默认的组件属性控制台，因为该演示不依赖 template 传参
    controls: { disable: true },
  },
  render: () => ({
    setup() {
      // 触发普通通知栏
      const handleShowInfo = () => {
        caMarquee.info('这是一条通过纯代码触发的普通公告通知栏！');
      };

      // 触发成功类型（长文本无缝循环滚动演示）
      const handleShowSuccess = () => {
        caMarquee.success(
          '恭喜！系统已成功升级至最新版本！本次更新大幅优化了跑马灯滚动性能，解决了文字换行测量的Bug，欢迎大家积极测试体验。',
          {
            closeable: true,
            duration: 0, // 0 代表永不自动关闭
            speed: 60,
          }
        );
      };

      // 触发警告类型
      const handleShowWarning = () => {
        caMarquee.warning(
          '警告：检测到您的账户今日安全风险较高，请及时修改密码！',
          {
            closeable: true,
          }
        );
      };

      // 触发错误类型
      const handleShowError = () => {
        caMarquee.error(
          '服务器连接异常，正在尝试重新规划核心路由链路，请稍后...',
          {
            duration: 5000,
          }
        );
      };

      // 全局强制关闭
      const handleCloseAll = () => {
        caMarquee.close();
      };

      return {
        handleShowInfo,
        handleShowSuccess,
        handleShowWarning,
        handleShowError,
        handleCloseAll,
      };
    },
    template: `
      <div style="padding: 24px; display: flex; gap: 12px; flex-wrap: wrap; background: #fafafa; border-radius: 8px;">
        <button class="sb-btn info" @click="handleShowInfo">触发 Info 通知</button>
        <button class="sb-btn success" @click="handleShowSuccess">触发 成功公告 (循环滚动/手动关闭)</button>
        <button class="sb-btn warning" @click="handleShowWarning">触发 警告通知 (手动关闭)</button>
        <button class="sb-btn error" @click="handleShowError">触发 错误通知 (5秒自动关闭)</button>
        <button class="sb-btn close-all" @click="handleCloseAll">强制关闭当前跑马灯</button>
      </div>
    `,
  }),
};
