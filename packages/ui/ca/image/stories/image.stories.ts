import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { CaImage, CaImageViewer } from '../index';

const meta = {
  title: 'Component/Image',
  component: CaImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**CaImage (图片组件)**

图片展示与预览组件。支持原图渲染、智能悬浮反馈及基于 Teleport 的全屏高级预览（支持滚轮缩放与拖拽移动）。

### 核心功能
* **开箱即用预览**：默认点击即可呼出全屏预览大图。
* **自定义尺寸适配**：支持嵌入各种尺寸容器，使用 \`object-fit: cover\` 保持自适应比例。
* **独立预览器**：内置 \`CaImageViewer\` 预览组件，支持通过 \`ref\` 手动触发调用。
        `,
      },
    },
  },
  argTypes: {
    src: {
      description: '图片资源地址',
      control: 'text',
    },
    alt: {
      description: '图片替代文本',
      control: 'text',
      table: {
        defaultValue: { summary: '\'\'' },
      },
    },
    preview: {
      description: '是否开启点击预览功能',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    previewAppendTo: {
      description: '预览组件挂载目标，接受 CSS 选择器或 HTMLElement，默认 body',
      control: 'text',
      table: {
        defaultValue: { summary: 'body' },
      },
    },
  },
  args: {
    src: 'https://picsum.photos/800/600',
    alt: '示例图片',
    preview: true,
  },
} satisfies Meta<typeof CaImage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础用法（点击大图预览）
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '最基础的用法。点击图片即可弹出全屏预览，在预览层中支持鼠标滚轮缩放、拖拽移动以及双击重置。',
      },
    },
  },
  render: (args) => ({
    components: { CaImage },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 300px; height: 200px;">
        <CaImage v-bind="args" style="width: 100%; height: 100%;" />
      </div>
    `,
  }),
};

/**
 * 禁用预览功能
 */
export const DisablePreview: Story = {
  parameters: {
    docs: {
      description: {
        story: '设置 `preview = false` 禁用预览功能，此时图片无鼠标 Hover 效果且点击不触发弹窗。',
      },
    },
  },
  args: {
    preview: false,
  },
  render: (args) => ({
    components: { CaImage },
    setup() {
      return { args };
    },
    template: `
      <div style="width: 300px; height: 200px;">
        <CaImage v-bind="args" style="width: 100%; height: 100%;" />
      </div>
    `,
  }),
};

/**
 * 自定义容器与比例组合
 */
export const CustomSize: Story = {
  parameters: {
    docs: {
      description: {
        story: '演示图片在不同尺寸容器（如正方形、长方形）下的自适应展现表现。',
      },
    },
  },
  render: () => ({
    components: { CaImage },
    setup() {
      const sampleImg = 'https://picsum.photos/600/800';
      return { sampleImg };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;">头像/正方形 (100x100)</p>
          <CaImage :src="sampleImg" style="width: 100px; height: 100px; border-radius: 8px;" />
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;">横幅 (300x120)</p>
          <CaImage :src="sampleImg" style="width: 300px; height: 120px; border-radius: 4px;" />
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;">竖图 (150x200)</p>
          <CaImage :src="sampleImg" style="width: 150px; height: 200px; border-radius: 4px;" />
        </div>
      </div>
    `,
  }),
};

/**
 * 独立使用 CaImageViewer 预览组件
 */
export const StandaloneViewer: Story = {
  parameters: {
    docs: {
      description: {
        story: '`CaImageViewer` 也可以独立使用。通过 `ref` 获取组件实例后，调用 `open()` 方法即可主动弹出预览框。',
      },
    },
  },
  render: () => ({
    components: { CaImageViewer },
    setup() {
      const viewerRef = ref<InstanceType<typeof CaImageViewer> | null>(null);
      const imgUrl = 'https://picsum.photos/1200/800';

      const handleOpen = () => {
        viewerRef.value?.open();
      };

      return { viewerRef, imgUrl, handleOpen };
    },
    template: `
      <div>
        <button
          @click="handleOpen"
          style="padding: 8px 16px; cursor: pointer; background: #1677ff; color: #fff; border: none; border-radius: 4px;"
        >
          命令式触发全屏预览
        </button>

        <CaImageViewer ref="viewerRef" :url="imgUrl" />
      </div>
    `,
  }),
};

/**
 * 挂载到局部容器
 */
export const AppendToContainer: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `previewAppendTo` 属性，将图片预览组件挂载到指定的父容器内，而非全局 `body`。父容器需要设置 `position: relative` 并具有明确的宽高，预览背景和图片将限定在该容器内。适用于需要在页面局部区域展示预览的场景，如卡片内、弹窗内等。',
      },
    },
  },
  render: () => ({
    components: { CaImage },
    setup() {
      const containerRef = ref<HTMLElement | null>(null);
      const imgSrc = 'https://picsum.photos/800/600';
      return { containerRef, imgSrc };
    },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 14px; color: #666;">
          点击下方图片，预览将在虚线框内展开，而不是全屏。
        </p>
        <div
          ref="containerRef"
          style="
            position: relative;
            width: 500px;
            height: 400px;
            border: 2px dashed #1677ff;
            border-radius: 8px;
            overflow: hidden;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <CaImage
            :src="imgSrc"
            style="width: 200px; height: 150px; border-radius: 4px;"
            :preview-append-to="containerRef"
            preview
          />
        </div>
      </div>
    `,
  }),
};