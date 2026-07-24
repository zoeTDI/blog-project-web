import { CaBreadcrumb, type CaBreadcrumbItem } from '../index.ts';
import {
  HomeIcon,
  DocumentTextIcon,
  Cog6ToothIcon, UserIcon,
} from '@heroicons/vue/24/outline';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const i18nMockItems = {
  en: [
    { label: 'Home', prefixIcon: HomeIcon, to: '/' },
    { label: 'User Center', prefixIcon: UserIcon, to: '/user' },
    { label: 'Account Settings', prefixIcon: Cog6ToothIcon, to: '/user/settings' },
  ] as CaBreadcrumbItem[],
  zh: [
    { label: '首页', prefixIcon: HomeIcon, to: '/' },
    { label: '个人中心', prefixIcon: UserIcon, to: '/user' },
    { label: '账号设置', prefixIcon: Cog6ToothIcon, to: '/user/settings' },
  ]  as CaBreadcrumbItem[],
};

const meta = {
  title: 'Component/Breadcrumb',
  component: CaBreadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**CaBreadcrumb (面包屑组件)**

用于展示当前页面在系统层级结构中的位置，并提供返回各级页面的导航功能。

### 核心功能
* **解耦设计**：不直接依赖 \`vue-router\` 或 \`vue-i18n\`，通过数据驱动列表支持响应式国际化与路由切换。
* **图标支持**：支持为每个节点配置自定义前缀与后缀图标。
* **样式主题**：支持切换默认悬浮变色与背景突出显示模式。
        `,
      },
    },
  },
  argTypes: {
    items: {
      description: '面包屑数据列表，传入包含 label、to 及图标配置的对象数组',
      control: 'object',
    },
    preferences: {
      description: '组件偏好与样式配置项',
      control: 'object',
    },
    onClick: {
      description: '点击面包屑节点时触发的回调事件',
      action: 'clicked',
    },
  },
  args: {
    preferences: {
      enable: true,
      showIcon: true,
      styleType: 'normal',
    },
  },
} satisfies Meta<typeof CaBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础纯文本模式
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '最基础的面包屑导航，仅包含文本层级。注意：当 `items` 长度小于等于 1 时，面包屑默认不进行渲染。',
      },
    },
  },
  args: {
    items: [
      { label: '首页', to: '/' },
      { label: '系统管理', to: '/system' },
      { label: '用户列表', to: '/system/user' },
    ],
  },
  render: (args) => ({
    components: { CaBreadcrumb },
    setup() {
      return { args };
    },
    template: `<CaBreadcrumb v-bind="args" />`,
  }),
};

/**
 * 带前缀与后缀图标
 */
export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过在 `items` 中配置 `prefixIcon` 和 `suffixIcon`，可以为每个面包屑节点添加图标。',
      },
    },
  },
  args: {
    items: [
      { label: '控制台', to: '/dashboard', prefixIcon: HomeIcon },
      { label: '设置中心', to: '/settings', prefixIcon: Cog6ToothIcon },
      { label: '个人偏好', to: '/settings/preference', suffixIcon: DocumentTextIcon },
    ],
  },
  render: (args) => ({
    components: { CaBreadcrumb },
    setup() {
      return { args };
    },
    template: `<CaBreadcrumb v-bind="args" />`,
  }),
};

/**
 * 背景高亮模式 (background styleType)
 */
export const BackgroundStyle: Story = {
  parameters: {
    docs: {
      description: {
        story: '设置 `preferences.styleType = "background"` 后，最后一个节点（当前页）将展现高亮背景块效果。',
      },
    },
  },
  args: {
    preferences: {
      enable: true,
      showIcon: true,
      styleType: 'background',
    },
    items: [
      { label: '工作台', to: '/workspace', prefixIcon: HomeIcon },
      { label: '团队管理', to: '/team', prefixIcon: UserIcon },
      { label: '成员权限', to: '/team/permission' },
    ],
  },
  render: (args) => ({
    components: { CaBreadcrumb },
    setup() {
      return { args };
    },
    template: `<CaBreadcrumb v-bind="args" />`,
  }),
};

/**
 * 隐藏图标
 */
export const HideIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: '当 `preferences.showIcon` 为 `false` 时，即使数据项配置了 `prefixIcon` 或 `suffixIcon` 也不会显示。',
      },
    },
  },
  args: {
    preferences: {
      enable: true,
      showIcon: false,
      styleType: 'normal',
    },
    items: [
      { label: '首页', to: '/', prefixIcon: HomeIcon },
      { label: '数据分析', to: '/analytics', prefixIcon: DocumentTextIcon },
    ],
  },
  render: (args) => ({
    components: { CaBreadcrumb },
    setup() {
      return { args };
    },
    template: `<CaBreadcrumb v-bind="args" />`,
  }),
};

/**
 * 响应式更新与数据变更测试
 * 模拟外部数据（如语言切换、动态增删节点、Label修改）变更后，面包屑导航能否实时响应更新
 */
export const ResponsiveDataUpdate: StoryObj<typeof CaBreadcrumb> = {
  parameters: {
    docs: {
      description: {
        story: '展示当外部传入的 `items` 数组发生响应式变更（如语言环境切换、节点动态增删、Label修改）时，面包屑组件能够实时响应并刷新 UI。',
      },
    },
  },
  args: {
    preferences: {
      enable: true,
      showIcon: true,
      styleType: 'background',
    },
  },
  render: (args) => ({
    components: { CaBreadcrumb },
    setup() {
      // 当前语言状态
      const currentLang = ref<'en' | 'zh'>('en');

      // 响应式面包屑数据项
      const items = ref([...i18nMockItems.en]);

      // 1. 切换语言包（模拟 i18n 变更）
      const toggleLanguage = () => {
        currentLang.value = currentLang.value === 'en' ? 'zh' : 'en';
        items.value = [...i18nMockItems[currentLang.value]];
      };

      // 2. 动态追加节点
      const addNode = () => {
        const count = items.value.length + 1;
        items.value.push({
          label: currentLang.value === 'en' ? `Dynamic Node ${count}` : `动态节点 ${count}`,
          to: `/dynamic-${count}`,
        });
      };

      // 3. 动态删除末尾节点
      const removeNode = () => {
        if (items.value.length > 1) {
          items.value.pop();
        }
      };

      // 4. 修改已有节点的 Label
      const updateCurrentLabel = () => {
        if (items.value.length > 0) {
          const lastIndex = items.value.length - 1;
          items.value[lastIndex].label += ' (Updated)';
        }
      };

      return {
        args,
        items,
        currentLang,
        toggleLanguage,
        addNode,
        removeNode,
        updateCurrentLabel,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center; background: #f5f5f5; padding: 12px; border-radius: 6px;">
          <button 
            @click="toggleLanguage" 
            style="padding: 6px 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;"
          >
            🌐 Switch Language (Current: {{ currentLang.toUpperCase() }})
          </button>

          <button 
            @click="addNode" 
            style="padding: 6px 12px; cursor: pointer;"
          >
            ➕ Add Node
          </button>

          <button 
            @click="removeNode" 
            :disabled="items.length <= 1"
            style="padding: 6px 12px; cursor: pointer;"
          >
            ➖ Remove Last Node
          </button>

          <button 
            @click="updateCurrentLabel" 
            style="padding: 6px 12px; cursor: pointer;"
          >
            ✏️ Modify Active Label
          </button>
        </div>

        <div style="padding: 16px; border: 1px dashed #ccc; border-radius: 6px;">
          <CaBreadcrumb v-bind="args" :items="items" />
        </div>
      </div>
    `,
  }),
};