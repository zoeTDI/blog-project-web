import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CaCard, type CaCardFooterAction } from '../index.ts';

const meta = {
  title: 'Component/Card',
  component: CaCard,
  tags: ['autodocs'],
  argTypes: {
    headerMaxHeight: {
      control: 'select',
      options: ['S', 'M', 'L', 100, 200, 300, 400, 500],
      description: '页头最大高度尺寸（支持预设尺寸和自定义数字）',
    },
    footerMaxHeight: {
      control: 'select',
      options: ['S', 'M', 'L', 100, 200, 300, 400, 500],
      description: '页脚最大高度尺寸（支持预设尺寸和自定义数字）',
    },
    footerActions: {
      control: 'object',
      description: '页脚底部操作按钮列表',
    },
  },
  args: {
    headerMaxHeight: 'S',
    footerMaxHeight: 'S',
    footerActions: [],
  },
} satisfies Meta<typeof CaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础默认卡片
 */
export const Default: Story = {
  render: (args) => ({
    components: { CaCard },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 300px; width: 400px;">
        <CaCard v-bind="args">
          <p>这是卡片的主体内容（Default Slot）。</p>
        </CaCard>
      </div>
    `,
  }),
};

/**
 * 包含 Header、Body 和 Footer 插槽的完整卡片
 */
export const WithSlots: Story = {
  args: {},
  render: (args) => ({
    components: { CaCard },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 400px; width: 450px;">
        <CaCard v-bind="args">
          <template #header>
            <h3 style="margin: 0;">卡片标题 (Header Slot)</h3>
          </template>

          <p>这是卡片的主要内容区域。卡片支持内容溢出自动滚动。</p>
          <p v-for="i in 5" :key="i">填充段落内容 {{ i }} ...</p>

          <template #footer>
            <span style="font-size: 12px; color: #888;">页脚自定义内容 (Footer Slot)</span>
          </template>
        </CaCard>
      </div>
    `,
  }),
};

/**
 * 带有底部操作按钮 (footerActions) 的卡片
 */
export const WithFooterActions: Story = {
  args: {
    footerActions: [
      {
        key: 'cancel',
        label: '取消',
        type: 'default',
        onClick: () => alert('点击了取消按钮'),
      },
      {
        key: 'submit',
        label: '确认提交',
        type: 'primary',
        onClick: () => alert('点击了确认提交'),
      },
    ] as CaCardFooterAction[],
  },
  render: (args) => ({
    components: { CaCard },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 350px; width: 450px;">
        <CaCard v-bind="args">
          <template #header>
            <h3 style="margin: 0;">表单卡片</h3>
          </template>
          <p>请在下方确认信息后点击操作按钮。</p>
        </CaCard>
      </div>
    `,
  }),
};

/**
 * 支持防抖/延迟触发 (timeout) 的按钮卡片
 */
export const WithDebouncedActions: Story = {
  args: {
    footerActions: [
      {
        key: 'save',
        label: '防抖保存 (300ms)',
        type: 'primary',
        timeout: 300,
        onClick: () => alert('触发了防抖保存逻辑'),
      },
    ] as CaCardFooterAction[],
  },
  render: (args) => ({
    components: { CaCard },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 300px; width: 400px;">
        <CaCard v-bind="args">
          <template #header>
            <h4 style="margin: 0;">防抖按钮示例</h4>
          </template>
          <p>连续快速点击下方按钮，只有在停止点击 300ms 后才会触发点击事件。</p>
        </CaCard>
      </div>
    `,
  }),
};

/**
 * 自定义 Header / Footer 尺寸 (Size L)
 */
export const LargeHeaderFooter: Story = {
  args: {
    headerMaxHeight: 'L',
    footerMaxHeight: 'L',
    footerActions: [
      {
        key: 'ok',
        label: '确定',
        type: 'primary',
      },
    ],
  },
  render: (args) => ({
    components: { CaCard },
    setup() {
      return { args };
    },
    template: `
      <div style="height: 400px; width: 400px;">
        <CaCard v-bind="args">
          <template #header>
            <h3 style="margin: 0;">大号页头 (Header Size L)</h3>
          </template>
          <p>此示例展示了 headerMaxHeight 与 footerMaxHeight 设为 'L' 时的样式效果。</p>
        </CaCard>
      </div>
    `,
  }),
};

/**
 * 页头与页脚包含大量长文本内容（超出一屏高度，展示内部独立滚动条）
 */
export const OverflowContentInSlots: Story = {
  args: {
    headerMaxHeight: 'M', // 设置为 M 尺寸 (120px) 方便查看长文本的滚动展示
    footerMaxHeight: 'M', // 设置为 M 尺寸 (120px)
    footerActions: [
      {
        key: 'agree',
        label: '我已阅读并同意条款',
        type: 'primary',
        onClick: () => alert('已同意该协议'),
      },
    ] as CaCardFooterAction[],
  },
  render: (args) => ({
    components: { CaCard },
    setup() {
      const longTextHeader = `
        【系统通知与声明长文本】
        尊重和保护用户个人隐私是本系统的基本原则。本系统将按照本声明的规定收集、使用和共享您的个人信息。
        当您使用本系统提供的服务时，即表示您已同意我们按照本声明收集、存储、使用、共享和保护您的个人信息。
        我们会严格遵循法律法规要求，采取相应的安全保护措施，尽力保护您的个人信息安全可控。
        如果发生重大安全事件，我们将按照法律法规的要求，及时向您告知安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施。
      `;

      const longTextFooter = `
        【免责声明及使用须知】
        1. 用户在使用本服务时，必须遵守中华人民共和国相关法律法规的规定，不得利用本服务从事任何违法违规行为。
        2. 本卡片组件内置了页头与页脚的最大高度限制及 overflow-y 滚动处理。当内容超出设定的最大高度（如 S: 60px、M: 120px、L: 200px）时，会在页头或页脚内部独立出现垂直滚动条，避免长文本撑开整个布局。
        3. 底部如果配置了 footerActions 操作按钮，操作按钮将置于页脚底部，不受内部插槽滚动条的影响，确保操作入口始终清晰可见。
      `;

      return { args, longTextHeader, longTextFooter };
    },
    template: `
      <div style="width: 500px; padding: 10px; background-color: #f5f5f5;">
        <CaCard v-bind="args">
          <!-- 页头插入大量文本 -->
          <template #header>
            <div style="padding: 4px; font-size: 13px; line-height: 1.6; color: #333;">
              <strong style="display: block; font-size: 14px; margin-bottom: 4px; color: #111;">
                📢 页头公告文本（长文本独立滚动）
              </strong>
              {{ longTextHeader }}
            </div>
          </template>

          <!-- 主体 Body 内容 -->
          <div style="padding: 8px 0;">
            <h4 style="margin-top: 0;">卡片正文区域 (Body)</h4>
            <p>卡片的主体内容和 Header/Footer 的滚动互相隔离，互不干扰。</p>
            <p v-for="n in 6" :key="n">
              这是主体内容的第 {{ n }} 段描述信息，用于验证三区域（Header、Body、Footer）独立的滚动能力。
            </p>
          </div>

          <!-- 页脚插入大量文本 -->
          <template #footer>
            <div style="padding: 4px; font-size: 12px; line-height: 1.5; color: #666;">
              {{ longTextFooter }}
            </div>
          </template>
        </CaCard>
      </div>
    `,
  }),
};

/**
 * 极为夸张的大文本情况（配合大号 Header/Footer 限制，如 Size L = 200px）
 */
export const ExtremeLongTextInHeaderAndFooter: Story = {
  args: {
    headerMaxHeight: 'L', // Size L: 200px
    footerMaxHeight: 'L', // Size L: 200px
  },
  render: (args) => ({
    components: { CaCard },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 520px; padding: 10px; background-color: #f0f2f5;">
        <CaCard v-bind="args">
          <template #header>
            <div style="font-size: 13px; line-height: 1.6; color: #444; padding-right: 8px;">
              <h4 style="margin: 0 0 8px 0; color: #1890ff;">📜 页头许可协议全文 (Header MaxHeight: L)</h4>
              <p>
                一、服务条款的确认和接纳：本软件的各项电子服务的所有权和运作权归本公司所有。本服务条款的效力范围及于本公司提供的一切产品和服务，用户在享受本公司任何单项服务时，应当受本服务条款的约束。</p>
              <p>
                二、用户帐号安全：用户一旦注册成功，成为本软件的合法用户。您将对用户名和密码安全负全部责任。此外，每个用户应对以其用户名进行的所有活动和事件负全责。</p>
              <p>
                三、隐私政策：尊重用户个人隐私是本软件的一项基本政策。我们不会在未经合法用户授权时公开、编辑或透露其注册资料及保存在本软件中的非公开内容。</p>
            </div>
          </template>
          <div style="padding: 12px 0;">
            <h3 style="margin-top: 0;">主内容区域</h3>
            <p>即使 Header 与 Footer 注入了上千字的繁重文本，卡片依然能借助 CSS 变量与 \`max-height\` 计算规则约束布局，将长文本完美限制在
              Header/Footer 内部包裹层 (ca-card-wrapper) 中。</p>
          </div>
          <template #footer>
            <div style="font-size: 12px; line-height: 1.5; color: #666; padding-right: 8px;">
              <h5 style="margin: 0 0 6px 0; color: #fa8c16;">⚠️ 额外注意事项 (Footer MaxHeight: L)</h5>
              <p>1. 如果您在不同的终端设备上访问，可能会由于屏幕分辨率差异导致滚动条样式的细微调整。</p>
              <p>2. 请确保在实际使用中为外层容器赋予确定的高度（如百分比 height: 100% 或固定 px 值），以便 flex
                布局正确计算自适应高度。</p>
              <p>3. 此用例证明了当用户传入极端大文本内容时，CaCard 具备良好的边界防御与视觉容错能力。</p>
            </div>
          </template>
        </CaCard>
      </div>
    `,
  }),
};