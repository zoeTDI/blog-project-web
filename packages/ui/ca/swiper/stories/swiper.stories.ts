import { CaSwiper, caSwiperImageFitMode, caSwiperMode } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

// 工具函数：占位图生成配置接口
interface ImageUrlConfig {
  /** 图片宽度（必填，单位px） */
  width: number;
  /** 图片高度（必填，单位px） */
  height: number;
  /** 生成图片数量（必填，正整数） */
  count: number;
  /**
   * 种子策略：
   * - 传入字符串：所有图片使用同一固定种子（图片完全相同）
   * - 不传或传入 `'random'`：每张图片使用独立随机种子（图片各不相同）
   */
  seed?: string | 'random';
  /** 是否应用灰度滤镜 */
  grayscale?: boolean;
  /** 高斯模糊程度（取值 1~10，数值越大越模糊） */
  blur?: number;
  /** 输出图片格式 */
  format?: 'webp' | 'jpg' | 'png';
  /** 从原图中心裁剪指定尺寸（宽×高） */
  crop?: { width: number; height: number };
  /** 缩放适配模式（contain 留白，cover 填满） */
  fit?: 'contain' | 'cover';
}

/**
 * 辅助函数：利用 picsum.photos 动态生成高质量的占位图片链接
 */
function generatePlaceholderUrls(config: ImageUrlConfig): string[] {
  const {
    width,
    height,
    count,
    seed,
    grayscale = false,
    blur,
    format,
    crop,
    fit,
  } = config;

  if (count <= 0) throw new Error('count 必须为正整数');
  if (blur !== undefined && (blur < 1 || blur > 10)) throw new Error('blur 取值必须在 1 到 10 之间');

  const baseUrl = 'https://picsum.photos';

  return Array.from({ length: count }, (_, index) => {
    const parts: string[] = [];
    if (seed && seed !== 'random') {
      parts.push(`/seed/${encodeURIComponent(seed)}`);
    } else {
      const randomSeed = `seed_${index}_${Math.random().toString(36).slice(2, 10)}`;
      parts.push(`/seed/${randomSeed}`);
    }
    parts.push(`/${width}/${height}`);
    if (crop) parts.push(`/crop/${crop.width}/${crop.height}`);
    if (fit) parts.push(`/fit/${fit}`);
    if (grayscale) parts.push('/grayscale');
    if (blur !== undefined) parts.push(`/blur/${blur}`);
    if (format) parts.push(`/format/${format}`);
    return baseUrl + parts.join('');
  });
}

const meta = {
  title: 'Component/Swiper',
  component: CaSwiper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### CaSwiper 轮播图组件

\`CaSwiper\` 是一个基于 Vue 3 编写的高性能、轻量级轮播图组件。支持无缝循环滚动、触控滑动、自定义指示器、左右切换按钮控制、图片适配模式以及固定高度或响应式宽高比设置。

#### 🌟 主要特性
- **无缝循环**：基于前后克隆项实现平滑的无缝无限轮播。
- **手势支持**：支持移动端及触控板的左右滑动（Swipe）交互。
- **智能自动轮播**：支持首张图片加载完成后才启动定时器，避免提前轮播导致的白屏；支持**鼠标悬浮（Hover）自动暂停**，移出后恢复。
- **多种指示器**：支持不显示指示器（\`unset\`）、圆点指示器（\`dot\`）及数字指示器（\`number\`）。
- **灵活的尺寸控制**：支持通过 \`height\` 设置固定高度，或通过 \`aspectRatio\` 实现响应式比例布局。
- **事件完备**：支持图片切换 (\`change\`) 与图片点击 (\`click\`) 事件监听。
        `,
      },
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: '轮播图数据列表，支持传入图片对象数组 \`CaSwiperOption[]\` 或纯图片链接字符串数组 \`string[]\`',
    },
    mode: {
      control: 'select',
      options: Object.values(caSwiperMode),
      description: '轮播指示器模式（unset: 不显示, dot: 圆点指示器, number: 数字指示器）',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用轮播交互（禁用点击、拖拽及手动切换）',
    },
    delay: {
      control: { type: 'number', step: 100 },
      description: '自动轮播延迟时间（单位：毫秒）。若小于等于0则关闭自动轮播',
    },
    changeable: {
      control: 'boolean',
      description: '是否显示左右手动切换控件。若 delay 小于等于 0 则会强制启用',
    },
    btnSize: {
      control: { type: 'number', step: 2 },
      description: '左右切换按钮的图标大小（单位：px）',
    },
    imageFitMode: {
      control: 'select',
      options: Object.values(caSwiperImageFitMode),
      description: '图片填充模式（contain: 保持比例缩放并完整显示, cover: 保持比例缩放并填满容器）',
    },
    height: {
      control: 'text',
      description: '轮播图固定高度（例如: \`300px\` 或 \`300\`）',
    },
    aspectRatio: {
      control: 'text',
      description: '轮播图宽高比（例如: \`16/9\` 或 \`2\`），推荐使用此项以支持完美响应式',
    },
  },
  args: {
    options: [],
    mode: caSwiperMode.unset,
    delay: 3000,
    changeable: false,
    imageFitMode: caSwiperImageFitMode.contain,
  },
} satisfies Meta<typeof CaSwiper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 默认状态（自动轮播与悬浮暂停）
 *
 * 默认情况下，组件会启用自动轮播（\`delay: 3000\`）。
 * 更新后的组件会等待**首张图片加载完成**后才开始计时，并且在**鼠标悬浮（Hover）**时会自动暂停轮播，移开后自动恢复。
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '默认展示状态，每隔 3 秒自动轮播。试着将鼠标悬浮在组件上方，观察自动轮播是否暂停。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwiper },
    setup() {
      const urlList = generatePlaceholderUrls({ width: 800, height: 450, count: 5 });
      const options = urlList.map((url: string, index: number) => ({
        id: index + 1,
        url,
        alt: `默认轮播图 ${index + 1}`,
      }));
      return { args, options };
    },
    template: `
      <div style="width: 100%; max-width: 700px;">
        <CaSwiper v-bind="args" :options="options" aspectRatio="16/9" />
      </div>
    `,
  }),
};

/**
 * 手动切换模式
 *
 * 通过将 \`delay\` 设为 \`0\`（关闭自动轮播）并开启 \`changeable: true\`，用户可以通过左右两侧的悬浮按钮进行手动翻页。
 */
export const Changeable: Story = {
  args: {
    delay: 0,
    changeable: true,
  },
  parameters: {
    docs: {
      description: {
        story: '关闭自动轮播并展示左右切换按钮，适用于需要用户自主控制进度浏览的场景。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwiper },
    setup() {
      const urlList = generatePlaceholderUrls({ width: 800, height: 450, count: 5, seed: 'changeable' });
      const options = urlList.map((url: string, index: number) => ({
        id: index + 1,
        url,
        alt: `手动切换图 ${index + 1}`,
      }));
      return { args, options };
    },
    template: `
      <div style="width: 100%; max-width: 700px;">
        <CaSwiper v-bind="args" :options="options" aspectRatio="16/9" />
      </div>
    `,
  }),
};

/**
 * 圆点指示器模式 (Dot Indicator)
 *
 * 设置 \`mode: 'dot'\` 后，底部将渲染圆点指示器。用户可以直接点击圆点跳转至对应页面。
 * 点击或手动切换也会重置当前的自动轮播倒计时。
 */
export const DotIndicator: Story = {
  args: {
    mode: caSwiperMode.dot,
    delay: 0,
    changeable: true,
  },
  parameters: {
    docs: {
      description: {
        story: '启用圆点指示器（dot 模式），支持点击圆点快速定位。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwiper },
    setup() {
      const urlList = generatePlaceholderUrls({ width: 800, height: 400, count: 4, seed: 'dot' });
      const options = urlList.map((url: string, index: number) => ({
        id: index + 1,
        url,
        alt: `圆点指示器图 ${index + 1}`,
      }));
      return { args, options };
    },
    template: `
      <div style="width: 100%; max-width: 700px;">
        <CaSwiper v-bind="args" :options="options" aspectRatio="2/1" />
      </div>
    `,
  }),
};

/**
 * 数字指示器模式 (Number Indicator)
 *
 * 设置 \`mode: 'number'\` 后，底部会以数字列表样式展示当前轮播进度。
 */
export const NumberIndicator: Story = {
  args: {
    mode: caSwiperMode.number,
    delay: 0,
    changeable: true,
  },
  parameters: {
    docs: {
      description: {
        story: '启用数字指示器（number 模式），清晰展示当前索引与总数。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwiper },
    setup() {
      const urlList = generatePlaceholderUrls({ width: 800, height: 400, count: 4, seed: 'number' });
      const options = urlList.map((url: string, index: number) => ({
        id: index + 1,
        url,
        alt: `数字指示器图 ${index + 1}`,
      }));
      return { args, options };
    },
    template: `
      <div style="width: 100%; max-width: 700px;">
        <CaSwiper v-bind="args" :options="options" aspectRatio="2/1" />
      </div>
    `,
  }),
};

/**
 * 图片填充模式 (Cover 模式)
 *
 * 当图片尺寸与轮播容器比例不一致时，可以通过设置 \`imageFitMode: 'cover'\` 让图片充满整个容器（可能会发生部分裁剪），而默认的 \`contain\` 则会完整显示图片并留有空白。
 */
export const ImageCoverFit: Story = {
  args: {
    mode: caSwiperMode.dot,
    delay: 0,
    changeable: true,
    imageFitMode: caSwiperImageFitMode.cover,
  },
  parameters: {
    docs: {
      description: {
        story: '展示 \`cover\` 填充模式的效果，图片会自动缩放并填满容器，适合海报或全屏 banner。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwiper },
    setup() {
      const urlList = generatePlaceholderUrls({ width: 600, height: 800, count: 3, seed: 'cover' });
      const options = urlList.map((url: string, index: number) => ({
        id: index + 1,
        url,
        alt: `Cover 模式图 ${index + 1}`,
      }));
      return { args, options };
    },
    template: `
      <div style="width: 100%; max-width: 500px;">
        <CaSwiper v-bind="args" :options="options" aspectRatio="4/3" />
      </div>
    `,
  }),
};

/**
 * 禁用状态 (Disabled)
 *
 * 当设置 \`disabled: true\` 时，将屏蔽所有的触摸滑动、点击跳转以及手动按钮交互。
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    mode: caSwiperMode.dot,
    delay: 0,
    changeable: true,
  },
  parameters: {
    docs: {
      description: {
        story: '禁用状态下的轮播图，无法进行交互。',
      },
    },
  },
  render: (args) => ({
    components: { CaSwiper },
    setup() {
      const urlList = generatePlaceholderUrls({ width: 800, height: 400, count: 3, seed: 'disabled' });
      const options = urlList.map((url: string, index: number) => ({
        id: index + 1,
        url,
        alt: `禁用状态图 ${index + 1}`,
      }));
      return { args, options };
    },
    template: `
      <div style="width: 100%; max-width: 700px;">
        <CaSwiper v-bind="args" :options="options" aspectRatio="2/1" />
      </div>
    `,
  }),
};