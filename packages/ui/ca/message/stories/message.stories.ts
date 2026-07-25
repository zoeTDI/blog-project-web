import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CaMessage } from '../index.ts';

const meta = {
  title: 'Component/Message',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**CaMessage (全局消息提示)**

用于全局展示操作反馈信息，支持四种类型：\`primary\`（普通）、\`success\`（成功）、\`error\`（错误）、\`warn\`（警告）。消息会在指定时间后自动消失。

### 核心功能
- **多种类型**：通过 \`CaMessage.success()\`、\`CaMessage.error()\` 等方法快速调用。
- **自动消失**：可自定义持续时间（单位毫秒），设为 0 则不会自动消失。
- **全局单例**：所有消息共享一个容器，按顺序展示。
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础用法 – 四种类型
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过调用 \`CaMessage.success()\`、\`CaMessage.error()\`、\`CaMessage.warn()\`、\`CaMessage.primary()\` 方法，可快速弹出对应类型的消息。默认 3 秒后自动消失。',
      },
    },
  },
  render: () => ({
    setup() {
      const showSuccess = () => CaMessage.success('操作成功！');
      const showError = () => CaMessage.error('操作失败，请重试。');
      const showWarn = () => CaMessage.warn('请注意检查输入内容。');
      const showPrimary = () => CaMessage.primary('这是一条普通信息。');
      return { showSuccess, showError, showWarn, showPrimary };
    },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button @click="showSuccess" style="padding: 8px 16px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">Success</button>
        <button @click="showError" style="padding: 8px 16px; background: #ff4d4f; color: white; border: none; border-radius: 4px; cursor: pointer;">Error</button>
        <button @click="showWarn" style="padding: 8px 16px; background: #faad14; color: white; border: none; border-radius: 4px; cursor: pointer;">Warn</button>
        <button @click="showPrimary" style="padding: 8px 16px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Primary</button>
      </div>
    `,
  }),
};

/**
 * 自定义持续时间
 */
export const CustomDuration: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过第二个参数传入自定义持续时间（毫秒）。例如 \`CaMessage.success(\'快速消息\', 1000)\` 会在 1 秒后消失；传入 \`0\` 则不会自动消失，需手动点击关闭按钮。',
      },
    },
  },
  render: () => ({
    setup() {
      const showShort = () => CaMessage.success('1秒后消失', 1000);
      const showLong = () => CaMessage.success('5秒后消失', 5000);
      const showPersist = () => CaMessage.warn('不会自动消失，点击×关闭', 0);
      return { showShort, showLong, showPersist };
    },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button @click="showShort" style="padding: 8px 16px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">1s 后消失</button>
        <button @click="showLong" style="padding: 8px 16px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">5s 后消失</button>
        <button @click="showPersist" style="padding: 8px 16px; background: #faad14; color: white; border: none; border-radius: 4px; cursor: pointer;">持久显示</button>
      </div>
    `,
  }),
};

/**
 * 多条消息同时出现
 */
export const MultipleMessages: Story = {
  parameters: {
    docs: {
      description: {
        story: '可以连续调用多次，消息会按顺序堆叠显示。',
      },
    },
  },
  render: () => ({
    setup() {
      const showMultiple = () => {
        CaMessage.success('第一条消息');
        CaMessage.error('第二条消息');
        CaMessage.warn('第三条消息');
        CaMessage.primary('第四条消息');
      };
      return { showMultiple };
    },
    template: `
      <button @click="showMultiple" style="padding: 8px 16px; background: #1677ff; color: white; border: none; border-radius: 4px; cursor: pointer;">同时显示多条消息</button>
    `,
  }),
};