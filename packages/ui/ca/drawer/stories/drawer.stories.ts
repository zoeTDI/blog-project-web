import { CaDrawer } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta = {
  title: 'Component/Drawer',
  component: CaDrawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**CaDrawer (抽屉组件)**

滑动抽屉面板，用于在不离开当前页面的情况下，侧拉或上下弹出展示额外内容、表达交互或表单填写。

### 核心功能
* **多方向展出**：支持 \`right\`、\`left\`、\`top\`、\`bottom\` 四个方向展开。
* **尺寸配置**：支持内容自适应 (\`auto\`) 和 全屏模式 (\`full\`)。
* **方法暴露**：通过 \`defineExpose\` 暴露 \`open\` 和 \`close\` 方法，便于使用模板引用（ref）控制。
* **遮罩层交互**：可配置点击背景遮罩层是否自动关闭抽屉。
        `,
      },
    },
  },
  argTypes: {
    placement: {
      description: '抽屉展开方向',
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      table: {
        defaultValue: { summary: 'right' },
      },
    },
    size: {
      description: '展开大小：内容大小 (auto) 或 全屏 (full)',
      control: 'radio',
      options: ['auto', 'full'],
      table: {
        defaultValue: { summary: 'auto' },
      },
    },
    customSize: {
      description: '自定义尺寸：> 1 时表示 px 像素值；0 < val <= 1 时表示视口尺寸比例（如 0.5 即 50%）；<= 0 时忽略',
      control: { type: 'number', step: 0.1 },
      table: {
        type: { summary: 'number' },
      },
    },
    appendTo: {
      description: '自定义挂载位置，默认body',
      control: 'text',
    },
    closeOnClickOverlay: {
      description: '点击遮罩层是否允许关闭',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    onOpen: {
      description: '抽屉打开时触发的回调事件',
      action: 'open',
    },
    onClose: {
      description: '抽屉关闭时触发的回调事件',
      action: 'close',
    },
    'onUpdate:visible': {
      description: '抽屉显隐状态更新时触发的回调事件',
      action: 'update:visible',
    },
  },
  args: {
    placement: 'right',
    size: 'auto',
    closeOnClickOverlay: true,
    appendTo: 'body',
  },
} satisfies Meta<typeof CaDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础用法（模板引用 Ref 控制）
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '最基础的抽屉用法。推荐通过模板引用（ref）获取组件实例，调用 `open()` 和 `close()` 方法控制显隐。',
      },
    },
  },
  render: (args) => ({
    components: { CaDrawer },
    setup() {
      const drawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

      const handleOpen = () => {
        drawerRef.value?.open();
      };

      return { args, drawerRef, handleOpen };
    },
    template: `
      <div>
        <button
          @click="handleOpen"
          style="padding: 8px 16px; cursor: pointer; background: #1677ff; color: #fff; border: none; border-radius: 4px;"
        >
          打开抽屉 (Open Drawer)
        </button>

        <CaDrawer ref="drawerRef" v-bind="args">
          <template #header>
            <h3 style="margin: 0;">抽屉标题</h3>
          </template>
          <div style="padding: 16px 0;">
            <p>这里是抽屉的主体内容区域。</p>
            <p>你可以放入表单、列表或任意 Vue 组件。</p>
          </div>
        </CaDrawer>
      </div>
    `,
  }),
};

/**
 * 四个弹出方向
 */
export const Placements: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过设置 `placement` 属性为 `left`、`right`、`top` 或 `bottom`，可以改变抽屉的滑出方向。',
      },
    },
  },
  render: (args) => ({
    components: { CaDrawer },
    setup() {
      const drawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);
      const currentPlacement = ref<'left' | 'right' | 'top' | 'bottom'>('right');

      const openDrawer = (placement: 'left' | 'right' | 'top' | 'bottom') => {
        currentPlacement.value = placement;
        drawerRef.value?.open();
      };

      return { args, drawerRef, currentPlacement, openDrawer };
    },
    template: `
      <div style="display: flex; gap: 12px;">
        <button @click="openDrawer('left')" style="padding: 8px 16px; cursor: pointer;">左侧滑出 (Left)</button>
        <button @click="openDrawer('right')" style="padding: 8px 16px; cursor: pointer;">右侧滑出 (Right)</button>
        <button @click="openDrawer('top')" style="padding: 8px 16px; cursor: pointer;">顶部滑出 (Top)</button>
        <button @click="openDrawer('bottom')" style="padding: 8px 16px; cursor: pointer;">底部滑出 (Bottom)</button>

        <CaDrawer ref="drawerRef" v-bind="args" :placement="currentPlacement">
          <template #header>
            <h3 style="margin: 0;">当前方向: {{ currentPlacement }}</h3>
          </template>
          <div style="padding: 16px 0;">
            <p>抽屉从 <strong>{{ currentPlacement }}</strong> 方向滑动展开。</p>
          </div>
        </CaDrawer>
      </div>
    `,
  }),
};

/**
 * 全屏模式 (size="full")
 */
export const FullSize: Story = {
  parameters: {
    docs: {
      description: {
        story: '设置 `size="full"` 可将抽屉扩展至全屏展示，适用于复杂表单或大图/详情预览。',
      },
    },
  },
  args: {
    size: 'full',
  },
  render: (args) => ({
    components: { CaDrawer },
    setup() {
      const drawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

      const handleOpen = () => {
        drawerRef.value?.open();
      };

      return { args, drawerRef, handleOpen };
    },
    template: `
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; cursor: pointer;">
          打开全屏抽屉 (Full Size Drawer)
        </button>

        <CaDrawer ref="drawerRef" v-bind="args">
          <template #header>
            <h3 style="margin: 0;">全屏抽屉面板</h3>
          </template>
          <div style="padding: 24px 0;">
            <p>当前处于全屏 (full) 尺寸模式。</p>
          </div>
        </CaDrawer>
      </div>
    `,
  }),
};

/**
 * 自定义像素尺寸 (customSize = 500)
 */
export const CustomPixelSize: Story = {
  parameters: {
    docs: {
      description: {
        story: '传入大于 1 的数字（例如 `500`），尺寸将被解析为像素单位（`500px`）。在左右滑出时控制宽度，在上下滑出时控制高度。',
      },
    },
  },
  args: {
    customSize: 500,
  },
  render: (args) => ({
    components: { CaDrawer },
    setup() {
      const drawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

      const handleOpen = () => {
        drawerRef.value?.open();
      };

      return { args, drawerRef, handleOpen };
    },
    template: `
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; cursor: pointer;">
          打开自定义尺寸抽屉 (500px)
        </button>

        <CaDrawer ref="drawerRef" v-bind="args">
          <template #header>
            <h3 style="margin: 0;">固定 500px 尺寸抽屉</h3>
          </template>
          <div style="padding: 16px 0;">
            <p>当前抽屉受 <code>customSize = 500</code> 控制，尺寸固定为 <strong>500px</strong>。</p>
          </div>
        </CaDrawer>
      </div>
    `,
  }),
};

/**
 * 自定义百分比尺寸 (customSize = 0.4)
 */
export const CustomPercentageSize: Story = {
  parameters: {
    docs: {
      description: {
        story: '传入介于 0 到 1 之间的数值（例如 `0.4`），尺寸将被解析为视口比例（`40svw` 或 `40svh`，即 40%）。',
      },
    },
  },
  args: {
    customSize: 0.4,
  },
  render: (args) => ({
    components: { CaDrawer },
    setup() {
      const drawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

      const handleOpen = () => {
        drawerRef.value?.open();
      };

      return { args, drawerRef, handleOpen };
    },
    template: `
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; cursor: pointer;">
          打开 40% 比例抽屉 (customSize = 0.4)
        </button>

        <CaDrawer ref="drawerRef" v-bind="args">
          <template #header>
            <h3 style="margin: 0;">40% 视口比例抽屉</h3>
          </template>
          <div style="padding: 16px 0;">
            <p>当前抽屉受 <code>customSize = 0.4</code> 控制，尺寸始终保持为当前视口的 <strong>40%</strong>。</p>
          </div>
        </CaDrawer>
      </div>
    `,
  }),
};

/**
 * 禁用点击遮罩关闭
 */
export const DisableOverlayClick: Story = {
  parameters: {
    docs: {
      description: {
        story: '设置 `closeOnClickOverlay = false` 后，点击背景遮罩层不会自动触发关闭，只能通过点击右上角关闭图标或调用 `close()` 方法关闭。',
      },
    },
  },
  args: {
    closeOnClickOverlay: false,
  },
  render: (args) => ({
    components: { CaDrawer },
    setup() {
      const drawerRef = ref<InstanceType<typeof CaDrawer> | null>(null);

      const handleOpen = () => {
        drawerRef.value?.open();
      };

      const handleClose = () => {
        drawerRef.value?.close();
      };

      return { args, drawerRef, handleOpen, handleClose };
    },
    template: `
      <div>
        <button @click="handleOpen" style="padding: 8px 16px; cursor: pointer;">
          打开抽屉 (禁用遮罩点击关闭)
        </button>

        <CaDrawer ref="drawerRef" v-bind="args">
          <template #header>
            <h3 style="margin: 0;">受限关闭测试</h3>
          </template>
          <div style="padding: 16px 0;">
            <p>试着点击外部灰色遮罩层，抽屉将<b>不会</b>关闭。</p>
            <button @click="handleClose" style="padding: 6px 12px; margin-top: 12px; cursor: pointer;">
              点击按钮手动关闭
            </button>
          </div>
        </CaDrawer>
      </div>
    `,
  }),
};

/**
 * 挂载到局部元素
 */
export const AppendToDiv: Story = {
  parameters: {
    docs: {
      description: {
        story: '',
      },
    },
  },
  args: {},
  render: (args) => ({
    components: { CaDrawer },
    setup() {
      const box1 = ref<HTMLElement | null>(null);
      const box2 = ref<HTMLElement | null>(null);
      const box3 = ref<HTMLElement | null>(null);
      const box4 = ref<HTMLElement | null>(null);
      const box5 = ref<HTMLElement | null>(null);
      const drawerRef1 = ref<InstanceType<typeof CaDrawer> | null>(null);
      const drawerRef2 = ref<InstanceType<typeof CaDrawer> | null>(null);
      const drawerRef3 = ref<InstanceType<typeof CaDrawer> | null>(null);
      const drawerRef4 = ref<InstanceType<typeof CaDrawer> | null>(null);
      const drawerRef5 = ref<InstanceType<typeof CaDrawer> | null>(null);

      const handleOpen = (i: number) => {
        switch (i) {
          case 1: {
            drawerRef1.value?.open();
            break;
          }
          case 2: {
            drawerRef2.value?.open();
            break;
          }
          case 3: {
            drawerRef3.value?.open();
            break;
          }
          case 4: {
            drawerRef4.value?.open();
            break;
          }
          case 5: {
            drawerRef5.value?.open();
            break;
          }
        }
      };

      const handleClose = (i: number) => {
        switch (i) {
          case 1: {
            drawerRef1.value?.close();
            break;
          }
          case 2: {
            drawerRef2.value?.close();
            break;
          }
          case 3: {
            drawerRef3.value?.close();
            break;
          }
          case 4: {
            drawerRef4.value?.close();
            break;
          }
          case 5: {
            drawerRef5.value?.close();
            break;
          }
        }
      };
      return { args, box1, box2, box3, box4, box5, drawerRef1, drawerRef2, drawerRef3, drawerRef4, drawerRef5, handleOpen, handleClose };
    },
    template: `
      <div style="display: flex; gap: 20px; width: 700px; justify-content: space-between">
        <button v-for="i in 5" :key="i" @click="handleOpen(i)"
                style="padding: 8px 10px; width: 140px; background-color: green; color: white">Open Drawer {{ i }}
        </button>
      </div>
      <div
        style="display: flex; gap: 20px; width: 700px; justify-content: space-between; margin-top: 20px; margin-bottom: 20px;">
        <button v-for="i in 5" :key="i" @click="handleClose(i)"
                style="padding: 8px 10px; width: 140px; background-color: red; color: white">Close Drawer {{ i }}
        </button>
      </div>
      <div
        style="display: flex; gap: 20px; width: 700px; justify-content: space-between; margin-top: 20px; margin-bottom: 20px;">
        <div v-for="i in ['top', 'right', 'bottom', 'right', 'full']" :key="i"
             style="padding: 8px 10px; width: 140px; background-color: #aaa; color: white; text-align: center">
          Pos: {{ i }}
        </div>
      </div>
      <div style="display: flex; gap: 20px; flex-wrap: wrap; flex: 0 0 auto">
        <div ref="box1"
             style="width: 300px;height: 300px; outline: 1px dashed red; position: relative; overflow: hidden">
          <CaDrawer ref="drawerRef1" :appendTo="box1" placement="top">
            抽屉1
          </CaDrawer>
        </div>
        <div ref="box2"
             style="width: 300px;height: 300px; outline: 1px dashed blue; position: relative; overflow: hidden;">
          <CaDrawer ref="drawerRef2" :appendTo="box2" placement="right">
            抽屉2
          </CaDrawer>
        </div>
        <div ref="box3"
             style="width: 300px;height: 300px; outline: 1px dashed green; position: relative; overflow: hidden;">
          <CaDrawer ref="drawerRef3" :appendTo="box3" placement="bottom">
            抽屉3
          </CaDrawer>
        </div>
        <div ref="box4"
             style="width: 300px;height: 300px; outline: 1px dashed purple; position: relative; overflow: hidden;">
          <CaDrawer ref="drawerRef4" :appendTo="box4" placement="left">
            抽屉3
          </CaDrawer>
        </div>
        <div ref="box5"
             style="width: 300px;height: 300px; outline: 1px dashed green; position: relative; overflow: hidden;">
          <CaDrawer ref="drawerRef5" :appendTo="box5" placement="left" size="full">
            抽屉3
          </CaDrawer>
        </div>
      </div>
    `,
  }),
};