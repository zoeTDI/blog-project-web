import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { CaMarquee, caMarqueeIconMap } from '../index';

const meta = {
  title: 'Component/Marquee',
  component: CaMarquee,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**CaMarquee (跑马灯组件)**

用于展示系统公告、通知提醒或告警信息的通知横幅组件。支持多种消息类型图标、文本溢出自动循环滚动以及手动/自动延时关闭。

### 核心功能
* **多状态图标**：内置 \`info\`、\`success\`、\`warning\`、\`error\` 四种状态类型样式与图标。
* **智能循环滚动**：当文本内容长度超过容器显示宽度时，自动开启无缝循环滚动效果。
* **多样化关闭控制**：支持通过 \`closeable\` 设置手动关闭按钮，或通过 \`duration\` 配置自动延时关闭时间。
* **灵活容器挂载**：支持通过 \`appendTo\` 灵活指定挂载的目标 DOM 节点。默认为body
        `,
      },
    },
  },
  argTypes: {
    icon: {
      description: '图标与消息状态类型',
      control: 'select',
      options: Object.keys(caMarqueeIconMap),
      table: {
        defaultValue: { summary: '\'info\'' },
      },
    },
    content: {
      description: '跑马灯显示内容',
      control: 'text',
      table: {
        defaultValue: {
          summary: '\'\'\'',
        },
      },
    },
    closeable: {
      description: '是否支持手动关闭。若为 false，则会在延时时间（duration）到达后自动关闭',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    duration: {
      description: '自动关闭的延时时间（单位：毫秒）',
      control: 'number',
      table: {
        defaultValue: { summary: '10000' },
      },
    },
    scrollable: {
      description: '当内容超出容器宽度时，是否开启文字循环滚动',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    speed: {
      description: '滚动速度（单位：px/s）',
      control: 'number',
      table: {
        defaultValue: { summary: '50' },
      },
    },
    appendTo: {
      description: '指定挂载的 HTML 节点',
      control: 'text',
      table: {
        defaultValue: { summary: '\'body\'' },
      },
    },
  },
  args: {
    icon: 'info',
    content: '这是一条通知消息，欢迎使用系统！',
    closeable: true,
    duration: 10000,
    scrollable: true,
    speed: 50,
    appendTo: false, // 在 Storybook 中禁用 Teleport 以便在 Story 视图区域内展示
  },
} satisfies Meta<typeof CaMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础用法
 */
export const Default
  :
  Story = {
  parameters: {
    docs: {
      description: {
        story: '最基础的跑马灯用法。设置普通消息内容，并开启手动关闭按钮。',
      },
    },
  },
  render: (args) => ({
    components: { CaMarquee },
    setup() {
      return { args };
    },
    template: `
      <div style="position: relative; width: 100%; min-height: 50px;">
        <CaMarquee v-bind="args" />
      </div>
    `,
  }),
};

/**
 * 各种状态类型 (Icons)
 */
export const IconTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: '演示 `info`、`success`、`warning`、`error` 四种不同主题类型的展示效果。',
      },
    },
  },
  render: () => ({
    components: { CaMarquee },
    setup() {
      return {};
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
        <CaMarquee icon="info" content="信息提示：系统将于今晚 24:00 进行例行维护升级。" :appendTo="false" />
        <CaMarquee icon="success" content="成功提示：您的变更操作已成功提交更新！" :appendTo="false" />
        <CaMarquee icon="warning" content="警告提示：当前系统资源使用率较高，请注意保存数据。" :appendTo="false" />
        <CaMarquee icon="error" content="错误提示：网络连接异常，无法获取最新的行情数据，请重试！" :appendTo="false" />
      </div>
    `,
  }),
};

/**
 * 超长文本无缝滚动
 */
export const LongTextScrolling: Story = {
  parameters: {
    docs: {
      description: {
        story: '当文本内容长度超过容器可呈现宽度时，组件将自动开启循环横向跑马灯动画。可以通过 `speed` 控制滚动速度。',
      },
    },
  },
  render: () => ({
    components: { CaMarquee },
    setup() {
      const longContent =
        '【重磅公告】尊敬的用户，由于受极端天气影响，部分地区的物流派送可能会出现延迟。我们正在加急协调处理，对此给您带来的不便我们深表歉意，敬请谅解！如有任何问题，请随时联系在线人工客服。';
      return { longContent };
    },
    template: `
      <div style="width: 500px; border: 1px dashed #ccc; padding: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">固定容器宽度: 500px</p>
        <CaMarquee icon="warning" :content="longContent" :speed="60" :closeable="true" :appendTo="false" />
      </div>
    `,
  }),
};

/**
 * 命令式手动控制与回调响应
 */
export const ControlledClose: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过 `ref` 获取组件实例后可主动调用 `close()` 方法关闭跑马灯；同时可以通过监听 `@close` 事件响应关闭后的业务逻辑。',
      },
    },
  },
  render: () => ({
    components: { CaMarquee },
    setup() {
      const marqueeRef = ref<InstanceType<typeof CaMarquee> | null>(null);
      const isVisible = ref(true);

      const handleManualClose = () => {
        marqueeRef.value?.close();
      };

      const handleCloseEvent = () => {
        isVisible.value = false;
        console.log('Marquee 组件已被关闭');
      };

      const handleReset = () => {
        isVisible.value = true;
      };

      return { marqueeRef, isVisible, handleManualClose, handleCloseEvent, handleReset };
    },
    template: `
      <div>
        <div style="margin-bottom: 16px; display: flex; gap: 8px;">
          <button
            @click="handleManualClose"
            style="padding: 6px 12px; cursor: pointer; background: #ff4d4f; color: #fff; border: none; border-radius: 4px;"
          >
            外部按钮调用 close() 关闭
          </button>
          <button
            v-if="!isVisible"
            @click="handleReset"
            style="padding: 6px 12px; cursor: pointer; background: #52c41a; color: #fff; border: none; border-radius: 4px;"
          >
            重置恢复显示
          </button>
        </div>

        <div style="width: 100%;">
          <CaMarquee
            v-if="isVisible"
            ref="marqueeRef"
            icon="info"
            content="这是一条受控的通知公告，支持外部命令式关闭，并抛出 close 事件回调。"
            :closeable="true"
            :appendTo="false"
            @close="handleCloseEvent"
          />
        </div>
      </div>
    `,
  }),
};

// 在文件末尾添加
/**
 * 自定义挂载位置 (appendTo)
 */
export const AppendToContainer: Story = {
  parameters: {
    docs: {
      description: {
        story: '通过 `appendTo` 属性可将跑马灯挂载到任意 DOM 节点。父容器需设置 `position: relative` 并具有宽度，否则定位或宽度可能异常。此示例将跑马灯挂载到虚线框内，而非 body。',
      },
    },
  },
  args: {
    icon: 'info',
    content: '【局部挂载】此跑马灯被 Teleport 到了下方的虚线容器内，宽度适配父容器。',
    closeable: true,
  },
  render: (args) => ({
    components: { CaMarquee },
    setup() {
      const containerRef = ref<HTMLElement | null>(null);
      console.log("🚀 ~ setup ~ args: ", args);
      return {args, containerRef };
    },
    template: `
      <div>
        <p style="margin-bottom: 12px; font-size: 14px; color: #666;">
          点击下方容器内的跑马灯（如有）查看效果。
        </p>
        <div
          ref="containerRef"
          style="
            position: relative;
            width: 600px;
            height: 60px;
            border: 2px dashed #1677ff;
            border-radius: 8px;
            overflow: hidden;
            background: #f9f9f9;
            margin: 12px 0;
          "
        >
          <!-- 此 div 仅用于演示容器定位，跑马灯将 Teleport 到这里 -->
        </div>
        <!-- 跑马灯组件本身可放在任何位置，通过 appendTo 挂载到 containerRef -->
        <CaMarquee
          v-bind="args"
          :appendTo="containerRef"
          @close="() => console.log('局部跑马灯已关闭')"
        />
      </div>
    `,
  }),
};