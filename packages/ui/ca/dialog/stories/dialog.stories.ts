import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { CaDialog, type CaDialogAction } from '../index.ts';
import CaButton from '../../button/src/Button.vue';

const meta = {
  title: 'Component/Dialog',
  component: CaDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**CaDialog (弹窗组件)**

用于在页面中央浮层展示重要信息、表单或确认操作，支持拖拽以外的常见弹窗交互。

### 核心功能
* **受控显隐**：支持 \`v-model:visible\`，同时通过模板引用（ref）暴露 \`open\` 与 \`close\` 方法。
* **内容插槽**：提供 \`header\`、默认内容与 \`footer\` 插槽，标题和底部操作按钮也可直接通过 Props 配置。
* **尺寸配置**：内置 \`S\` / \`M\` / \`L\` 三档宽度，也可通过 \`width\` 自定义像素或任意 CSS 宽度。
* **交互控制**：支持点击遮罩关闭、Esc 关闭、滚动锁定与关闭按钮显隐配置。
* **明暗主题**：基于 \`styles/vars.css\` 中的主题变量实现，跟随根节点 \`.dark\` 类自动切换。
        `,
      },
    },
  },
  argTypes: {
    title: {
      description: '弹窗标题，也可通过 header 插槽自定义',
      control: 'text',
    },
    size: {
      description: '预设宽度尺寸',
      control: 'radio',
      options: ['S', 'M', 'L'],
      table: {
        defaultValue: { summary: 'M' },
      },
    },
    width: {
      description: '自定义宽度：数字为 px，字符串按 CSS 宽度原样使用（优先级高于 size）',
      control: { type: 'number' },
      table: {
        type: { summary: 'number | string' },
      },
    },
    appendTo: {
      description: '自定义挂载位置，默认为 body',
      control: 'text',
    },
    closeOnClickOverlay: {
      description: '点击遮罩层是否允许关闭',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    closeOnPressEscape: {
      description: '按下 Esc 是否允许关闭',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showClose: {
      description: '是否显示右上角关闭按钮',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    lockScroll: {
      description: '打开时是否锁定页面滚动',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    footerActions: {
      description: '底部操作按钮列表',
      control: 'object',
    },
    onOpen: {
      description: '弹窗打开时触发',
      action: 'open',
    },
    onClose: {
      description: '弹窗关闭时触发',
      action: 'close',
    },
    'onUpdate:visible': {
      description: '弹窗显隐状态更新时触发',
      action: 'update:visible',
    },
    onAction: {
      description: '点击底部操作按钮时触发',
      action: 'action',
    },
  },
  args: {
    title: '弹窗标题',
    size: 'M',
    closeOnClickOverlay: true,
    closeOnPressEscape: true,
    showClose: true,
    lockScroll: true,
    footerActions: [],
  },
} satisfies Meta<typeof CaDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const createOpenButton = () => `
  <CaButton @click="visible = true">打开弹窗 (Open Dialog)</CaButton>
`;

/**
 * 基础用法
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '最基础的弹窗用法。通过 `v-model:visible` 控制显隐，也可以使用模板引用调用 `open()` / `close()` 方法。',
      },
    },
  },
  render: (args) => ({
    components: { CaDialog, CaButton },
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    template: `
      <div>
        ${createOpenButton()}
        <CaDialog v-model:visible="visible" v-bind="args">
          <p>这里是弹窗的主体内容区域。</p>
          <p>你可以放入文本、表单或任意 Vue 组件。</p>
        </CaDialog>
      </div>
    `,
  }),
};

/**
 * 使用 header / footer 插槽
 */
export const WithSlots: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过 `header` 与 `footer` 插槽可以完全自定义弹窗的头部和底部内容。',
      },
    },
  },
  args: {
    title: '',
  },
  render: (args) => ({
    components: { CaDialog, CaButton },
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    template: `
      <div>
        ${createOpenButton()}
        <CaDialog v-model:visible="visible" v-bind="args">
          <template #header>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent);"></span>
              <h3 style="margin: 0; font-family: var(--font-h); font-size: 20px; font-weight: 500; color: var(--color-text-h);">自定义头部</h3>
            </div>
          </template>

          <p>主体区域使用默认插槽，可以自由放置任意内容。</p>

          <template #footer>
            <CaButton @click="visible = false">取消</CaButton>
            <CaButton @click="visible = false">确定</CaButton>
          </template>
        </CaDialog>
      </div>
    `,
  }),
};

/**
 * 通过 footerActions 配置底部按钮
 */
export const FooterActions: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过 `footerActions` 快速配置底部操作按钮，支持按钮类型与点击后自动关闭。',
      },
    },
  },
  args: {
    title: '删除确认',
    size: 'S',
    footerActions: [
      {
        key: 'cancel',
        label: '取消',
        closeOnClick: true,
      },
      {
        key: 'confirm',
        label: '确定删除',
        type: 'primary',
        closeOnClick: true,
      },
    ] satisfies CaDialogAction[],
  },
  render: (args) => ({
    components: { CaDialog, CaButton },
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    template: `
      <div>
        <CaButton @click="visible = true">删除内容</CaButton>
        <CaDialog v-model:visible="visible" v-bind="args">
          <p>删除后将无法恢复，确定要继续吗？</p>
        </CaDialog>
      </div>
    `,
  }),
};

/**
 * 不同尺寸
 */
export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过 `size` 切换 `S` / `M` / `L` 三档预设宽度。',
      },
    },
  },
  render: (args) => ({
    components: { CaDialog, CaButton },
    setup() {
      const visible = ref(false);
      const size = ref<'S' | 'M' | 'L'>('M');

      const open = (value: 'S' | 'M' | 'L') => {
        size.value = value;
        visible.value = true;
      };

      return { args, visible, size, open };
    },
    template: `
      <div style="display: flex; gap: 12px;">
        <CaButton @click="open('S')">小尺寸 (S)</CaButton>
        <CaButton @click="open('M')">中尺寸 (M)</CaButton>
        <CaButton @click="open('L')">大尺寸 (L)</CaButton>

        <CaDialog v-model:visible="visible" v-bind="args" :size="size" :title="'当前尺寸：' + size">
          <p>弹窗宽度会随 size 属性变化。</p>
        </CaDialog>
      </div>
    `,
  }),
};

/**
 * 自定义宽度
 */
export const CustomWidth: Story = {
  parameters: {
    docs: {
      description: {
        story: '传入数字时按像素处理；传入字符串时可直接使用任意 CSS 宽度（如 `40vw`、`min(720px, 90vw)`）。',
      },
    },
  },
  args: {
    title: '自定义宽度',
    width: 'min(720px, 90vw)',
  },
  render: (args) => ({
    components: { CaDialog, CaButton },
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    template: `
      <div>
        ${createOpenButton()}
        <CaDialog v-model:visible="visible" v-bind="args">
          <p>当前宽度由 <code>width</code> 属性控制。</p>
        </CaDialog>
      </div>
    `,
  }),
};

/**
 * 禁用遮罩与 Esc 关闭
 */
export const ManualClose: Story = {
  parameters: {
    docs: {
      description: {
        story: '设置 `closeOnClickOverlay = false` 且 `closeOnPressEscape = false` 后，只能通过关闭按钮或 `close()` 方法关闭弹窗。',
      },
    },
  },
  args: {
    title: '需要手动关闭',
    closeOnClickOverlay: false,
    closeOnPressEscape: false,
  },
  render: (args) => ({
    components: { CaDialog, CaButton },
    setup() {
      const visible = ref(false);
      return { args, visible };
    },
    template: `
      <div>
        ${createOpenButton()}
        <CaDialog v-model:visible="visible" v-bind="args">
          <p>点击遮罩层或按下 Esc 都不会关闭弹窗。</p>
          <p>请点击右上角关闭按钮。</p>
        </CaDialog>
      </div>
    `,
  }),
};

/**
 * 明暗主题对比（局部挂载）
 */
export const Themes: Story = {
  parameters: {
    docs: {
      description: {
        story: '弹窗会读取 `--color-*` 等全局主题变量。根节点添加 `.dark` 类即可切换到深色主题。以下示例将弹窗局部挂载到两个容器中以便同屏对比。',
      },
    },
  },
  render: () => ({
    components: { CaDialog, CaButton },
    setup() {
      const lightBox = ref<HTMLElement | null>(null);
      const darkBox = ref<HTMLElement | null>(null);
      const lightVisible = ref(false);
      const darkVisible = ref(false);

      return {
        lightBox,
        darkBox,
        lightVisible,
        darkVisible,
      };
    },
    template: `
      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <div
          ref="lightBox"
          style="position: relative; width: 340px; height: 360px; padding: 20px; overflow: hidden; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-root-bg);"
        >
          <h4 style="margin: 0 0 12px;">浅色主题</h4>
          <CaButton @click="lightVisible = true">打开浅色弹窗</CaButton>
          <CaDialog
            v-model:visible="lightVisible"
            :append-to="lightBox"
            :width="300"
            size="S"
            title="浅色主题弹窗"
          >
            <p>这是浅色主题下的弹窗样式。</p>
          </CaDialog>
        </div>

        <div
          ref="darkBox"
          class="dark"
          style="position: relative; width: 340px; height: 360px; padding: 20px; overflow: hidden; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-root-bg);"
        >
          <h4 style="margin: 0 0 12px;">深色主题</h4>
          <CaButton @click="darkVisible = true">打开深色弹窗</CaButton>
          <CaDialog
            v-model:visible="darkVisible"
            :append-to="darkBox"
            :width="300"
            size="S"
            title="深色主题弹窗"
          >
            <p>这是深色主题下的弹窗样式。</p>
          </CaDialog>
        </div>
      </div>
    `,
  }),
};
