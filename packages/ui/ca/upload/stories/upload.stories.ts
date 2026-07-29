import { CaUpload, type CustomRequestOptions, type UploadFile } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta: Meta<typeof CaUpload> = {
  title: 'Component/Upload',
  component: CaUpload,
  tags: ['autodocs'],
  argTypes: {
    // 基础绑定与外观控制
    modelValue: {
      control: 'object',
      description: '绑定文件数据列表，支持 `UploadFile[]` 对象数组或纯 `string[]` URL 数组',
      table: {
        type: { summary: 'UploadFile[] | string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    listType: {
      control: 'select',
      options: ['text', 'picture', 'picture-card'],
      description: '展现模式：`text` (文本列表)、`picture` (图文结合)、`picture-card` (照片墙卡片)',
      table: {
        type: { summary: '\'text\' | \'picture\' | \'picture-card\'' },
        defaultValue: { summary: '\'text\'' },
      },
    },
    accept: {
      control: 'text',
      description: '接受上传的文件 MIME 类型或扩展名，例如 `image/*` 或 `.pdf,.doc`',
      table: {
        type: { summary: 'string' },
      },
    },
    multiple: {
      control: 'boolean',
      description: '是否支持多选文件',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    drag: {
      control: 'boolean',
      description: '是否开启拖拽上传区域（仅在 `listType` 非 `picture-card` 时生效）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showFileList: {
      control: 'boolean',
      description: '是否显示已上传的文件列表',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用组件操作与交互',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: 'boolean',
      description: '是否为只读模式（仅展示/预览，隐藏触发按钮与删除/重试操作）',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // 校验与配置参数
    maxCount: {
      control: { type: 'number', min: 1 },
      description: '允许最大上传的文件数量',
      table: {
        type: { summary: 'number' },
      },
    },
    maxSize: {
      control: { type: 'number', min: 1 },
      description: '限制单个文件允许的最大尺寸（单位：MB）',
      table: {
        type: { summary: 'number' },
      },
    },

    // 请求与异步参数
    autoUpload: {
      control: 'boolean',
      description: '选择文件后是否自动触发网络上传逻辑',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    action: {
      control: 'text',
      description: '上传接口的服务端 URL 地址',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      control: 'text',
      description: '发往服务端的表单文件字段名称',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '\'file\'' },
      },
    },
    headers: {
      control: 'object',
      description: '上传请求自定义请求头对象',
      table: {
        type: { summary: 'Record<string, string>' },
      },
    },
    data: {
      control: 'object',
      description: '上传时额外附带的 FormData 参数对象',
      table: {
        type: { summary: 'Record<string, any>' },
      },
    },

    // 钩子函数与方法重写
    customRequest: {
      description: '自定义上传请求逻辑的重写函数',
      table: {
        type: { summary: '(options: CustomRequestOptions) => Promise<any> | void' },
      },
    },
    beforeUpload: {
      description: '文件上传前的钩子函数，返回 `false` 或 `rejected Promise` 则停止上传',
      table: {
        type: { summary: '(file: File) => boolean | Promise<boolean | File>' },
      },
    },
    beforeRemove: {
      description: '文件移除前的钩子函数，返回 `false` 或 `rejected Promise` 则阻断移除',
      table: {
        type: { summary: '(file: UploadFile, fileList: UploadFile[]) => boolean | Promise<boolean>' },
      },
    },

    // 组件 Emits 事件监听（Storybook Actions）
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onChange: { action: 'change' },
    onSuccess: { action: 'success' },
    onError: { action: 'error' },
    onProgress: { action: 'progress' },
    onPreview: { action: 'preview' },
    onRemove: { action: 'remove' },
    onExceed: { action: 'exceed' },
  },
  // 设置控制台初始默认 Props 状态
  args: {
    modelValue: [],
    listType: 'text',
    autoUpload: true,
    disabled: false,
    multiple: false,
    drag: false,
    showFileList: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 1. 基础用法 (Basic / Default)
 * 展示最基本的文件选择与文本列表展现形式。
 */
export const Basic: Story = {
  name: '基础用法',
  args: {
    listType: 'text',
    modelValue: [],
  },
  render: (args) => ({
    components: { CaUpload },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width: 400px;">
        <CaUpload v-bind="args" v-model="args.modelValue">
          <template #tip>
            支持任意格式文件，单个文件不限制大小
          </template>
        </CaUpload>
      </div>
    `,
  }),
};

/**
 * 2. 展示模式 (List Types)
 * 演示 picture-card（照片墙）与 picture（图文模式）两种展现排版。
 */
export const ListTypes: Story = {
  name: '展示模式',
  render: () => ({
    components: { CaUpload },
    setup() {
      // 准备用于展示的不同格式初始文件列表
      const imageFiles: UploadFile[] = [
        {
          id: '1',
          name: 'nature-1.jpg',
          mimeType: 'image/jpeg',
          url: 'https://picsum.photos/id/1018/200/200',
          status: 'success',
        },
        {
          id: '2',
          name: 'nature-2.jpg',
          mimeType: 'image/jpeg',
          url: 'https://picsum.photos/id/1015/200/200',
          status: 'success',
        },
      ];

      const mixedFiles: UploadFile[] = [
        {
          id: '101',
          name: 'project-design.png',
          mimeType: 'image/png',
          url: 'https://picsum.photos/id/1062/200/200',
          status: 'success',
        },
        {
          id: '102',
          name: 'annual-report.pdf',
          mimeType: 'application/pdf',
          status: 'success',
        },
      ];

      return { imageFiles, mixedFiles };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 600px;">
        <!-- 照片墙卡片模式 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #374151; font-weight: 600;">照片墙模式 (picture-card)</h4>
          <CaUpload
            v-model="imageFiles"
            list-type="picture-card"
            accept="image/*"
            :max-count="4"
          />
        </div>

        <!-- 图文结合模式 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #374151; font-weight: 600;">图文列表模式 (picture)</h4>
          <CaUpload
            v-model="mixedFiles"
            list-type="picture"
          />
        </div>
      </div>
    `,
  }),
};

/**
 * 3. 拖拽上传 (Drag and Drop)
 * 展示拖拽区域交互，用户可以将文件拖入虚线框内进行快速上传。
 */
export const DragAndDrop: Story = {
  name: '拖拽上传',
  args: {
    drag: true,
    multiple: true,
    listType: 'text',
  },
  render: (args) => ({
    components: { CaUpload },
    setup() {
      return { args };
    },
    template: `
      <div style="max-width: 500px;">
        <CaUpload v-bind="args" v-model="args.modelValue">
          <template #tip>
            支持拖拽多个文件，或者点击区域选择文件
          </template>
        </CaUpload>
      </div>
    `,
  }),
};

/**
 * 4. 禁用与只读状态 (Disabled & Readonly)
 * 演示在禁用（Disabled）和只读（Readonly）控制状态下的交互屏蔽与展现表现。
 */
export const DisabledAndReadonly: Story = {
  name: '禁用与只读状态',
  render: () => ({
    components: { CaUpload },
    setup() {
      const defaultFiles: UploadFile[] = [
        {
          id: '1',
          name: 'project-requirement.pdf',
          mimeType: 'application/pdf',
          status: 'success',
        },
        {
          id: '2',
          name: 'dashboard-preview.png',
          mimeType: 'image/png',
          url: 'https://picsum.photos/id/1025/200/200',
          status: 'success',
        },
      ];

      return { defaultFiles };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 500px;">
        <!-- 禁用状态 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #374151; font-weight: 600;">禁用状态 (disabled)</h4>
          <CaUpload
            :model-value="defaultFiles"
            disabled
          />
        </div>

        <!-- 照片墙禁用状态 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #374151; font-weight: 600;">照片墙禁用状态</h4>
          <CaUpload
            :model-value="defaultFiles"
            list-type="picture-card"
            disabled
          />
        </div>

        <!-- 只读模式 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #374151; font-weight: 600;">只读模式 (readonly -
            隐藏上传触发器与删除按钮)</h4>
          <CaUpload
            :model-value="defaultFiles"
            readonly
          />
        </div>
      </div>
    `,
  }),
};

/**
 * 5. 初始文件列表与受控绑定 (Initial File List)
 * 演示通过 UploadFile[] 对象数组或纯 string[] URL 数组进行数据初始化的表现。
 */
export const InitialFileList: Story = {
  name: '初始文件列表与受控绑定',
  render: () => ({
    components: { CaUpload },
    setup() {
      // 1. UploadFile[] 复杂对象绑定（包含不同状态的文件）
      const complexFiles = ref<UploadFile[]>([
        {
          id: '1',
          name: 'success-avatar.png',
          mimeType: 'image/png',
          url: 'https://picsum.photos/id/1027/200/200',
          status: 'success',
        },
        {
          id: '2',
          name: 'uploading-file.zip',
          mimeType: 'application/zip',
          status: 'uploading',
          percent: 65,
        },
        {
          id: '3',
          name: 'failed-document.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          status: 'error',
          error: '网络中断',
        },
      ]);

      // 2. string[] 简易 URL 数组绑定
      const urlFiles = ref<string[]>([
        'https://picsum.photos/id/1039/200/200',
        'https://picsum.photos/id/1043/200/200',
      ]);

      return { complexFiles, urlFiles };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 600px;">
        <!-- 复杂对象 UploadFile[] -->
        <div>
          <h4 style="margin-bottom: 8px; color: #374151; font-weight: 600;">绑定 UploadFile[] (包含各种状态)</h4>
          <CaUpload v-model="complexFiles" />
          <pre
            style="margin-top: 8px; padding: 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px; max-height: 120px; overflow: auto;">{{ JSON.stringify(complexFiles, null, 2) }}</pre>
        </div>

        <!-- 纯字符串 URL 数组 -->
        <div>
          <h4 style="margin-bottom: 8px; color: #374151; font-weight: 600;">绑定 string[] (简单图片 URL 列表)</h4>
          <CaUpload
            v-model="urlFiles"
            list-type="picture-card"
            accept="image/*"
          />
          <pre
            style="margin-top: 8px; padding: 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px;">{{ JSON.stringify(urlFiles, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
};

/**
 * 6. 文件数量与大小限制 (Limits & Validation)
 * 演示 maxCount 数量上限控制、maxSize 大小拦截以及超出限制时的 exceed 事件。
 */
export const LimitsAndValidation: Story = {
  name: '文件数量与大小限制',
  render: () => ({
    components: { CaUpload },
    setup() {
      const fileList = ref<UploadFile[]>([
        {
          id: '1',
          name: 'existing-image.png',
          mimeType: 'image/png',
          url: 'https://picsum.photos/id/1069/200/200',
          status: 'success',
        },
      ]);

      const handleExceed = (files: File[]) => {
        alert(`触发超出数量限制！本次尝试添加了 ${files.length} 个文件，当前最多允许上传 2 个文件。`);
      };

      return { fileList, handleExceed };
    },
    template: `
      <div style="max-width: 500px;">
        <h4 style="margin-bottom: 8px; color: #374151; font-weight: 600;">数量限制 (最多2个) & 大小限制 (最大2MB)</h4>
        <CaUpload
          v-model="fileList"
          :max-count="2"
          :max-size="2"
          multiple
          accept="image/*"
          @exceed="handleExceed"
        >
          <template #tip>
            <div style="color: #ef4444; font-size: 12px; margin-top: 4px;">
              * 最多可选择 2 个文件，单文件大小不可超过 2MB
            </div>
          </template>
        </CaUpload>
      </div>
    `,
  }),
};

/**
 * 7. 自定义上传逻辑 (Custom Request & Mocking)
 * 演示通过 `customRequest` 覆盖默认上传行为，模拟异步网络请求与进度条变化。
 */
export const CustomRequest: Story = {
  name: '自定义上传逻辑',
  render: () => ({
    components: { CaUpload },
    setup() {
      const fileList = ref<UploadFile[]>([]);

      // 自定义模拟上传逻辑
      const handleCustomRequest = (options: CustomRequestOptions) => {
        let percent = 0;

        // 模拟每 200ms 增加进度
        const timer = setInterval(() => {
          percent += 20;
          options.onProgress(percent);

          if (percent >= 100) {
            clearInterval(timer);
            // 随机模拟成功与失败（80% 概率成功）
            if (Math.random() > 0.2) {
              options.onSuccess({ url: 'https://picsum.photos/id/1084/200/200', message: 'Upload success' });
            } else {
              options.onError(new Error('模拟网络连接超时 failure'));
            }
          }
        }, 200);
      };

      return { fileList, handleCustomRequest };
    },
    template: `
      <div style="max-width: 500px;">
        <h4 style="margin-bottom: 8px; color: #374151; font-weight: 600;">模拟带进度的自定义上传 (20% 随机失败率)</h4>
        <CaUpload
          v-model="fileList"
          :custom-request="handleCustomRequest"
          multiple
        />
      </div>
    `,
  }),
};

/**
 * 8. 自定义触发器与提示插槽 (Custom Slots)
 * 演示使用 `default` 插槽自定义上传区域外观，以及使用 `tip` 插槽呈现丰富的提示内容。
 */
export const CustomSlots: Story = {
  name: '自定义触发器与提示插槽',
  render: () => ({
    components: { CaUpload },
    setup() {
      const fileList = ref<UploadFile[]>([]);
      return { fileList };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 550px;">
        <!-- 自定义上传按钮外观 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #374151; font-weight: 600;">自定义按钮样式插槽</h4>
          <CaUpload v-model="fileList" accept="image/*">
            <button
              type="button"
              style="
                padding: 10px 20px;
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
                display: flex;
                align-items: center;
                gap: 8px;
              "
            >
              <span>🚀 点击导入图片文件</span>
            </button>
            <template #tip>
              <div style="margin-top: 8px; color: #6b7280; font-size: 13px;">
                💡 提示：使用自定义按钮样式渲染
              </div>
            </template>
          </CaUpload>
        </div>

        <!-- 自定义拖拽框与复合提示插槽 -->
        <div>
          <h4 style="margin-bottom: 12px; color: #374151; font-weight: 600;">自定义拖拽框与 rich-tip</h4>
          <CaUpload v-model="fileList" drag multiple>
            <div style="padding: 20px; text-align: center; color: #4f46e5;">
              <div style="font-size: 32px; margin-bottom: 8px;">📂</div>
              <div style="font-weight: 600; font-size: 15px;">将文档拖放到此处，或点击浏览</div>
              <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">支持 PDF, DOCX, XLSX 格式</div>
            </div>
            <template #tip>
              <div
                style="margin-top: 10px; padding: 10px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; color: #166534; font-size: 12px;">
                🔒 所有上传的文件均通过 256 位加密处理，保障数据安全。
              </div>
            </template>
          </CaUpload>
        </div>
      </div>
    `,
  }),
};

/**
 * 9. 非图片 / 任意类型文件上传 (Any File Types)
 * 演示代码、压缩包、文档、音视频等各种非图片类型文件的匹配、展示与交互。
 */
export const AnyFileTypes: Story = {
  name: '非图片 / 任意类型文件上传',
  render: () => ({
    components: { CaUpload },
    setup() {
      // 各种常见的非图片文件列表
      const nonImageFiles = ref<UploadFile[]>([
        {
          id: 'file-doc-1',
          name: '2026年季度财务报告.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 1024 * 1024 * 2.5, // 2.5 MB
          status: 'success',
        },
        {
          id: 'file-code-2',
          name: 'useUploader.ts',
          mimeType: 'video/mp2t', // .ts 常用/识别 mimeType 类型之一
          size: 1024 * 12, // 12 KB
          status: 'success',
        },
        {
          id: 'file-archive-3',
          name: 'release-v1.0.0.zip',
          mimeType: 'application/zip',
          size: 1024 * 1024 * 15.8, // 15.8 MB
          status: 'success',
        },
        {
          id: 'file-audio-4',
          name: 'meeting-record.mp3',
          mimeType: 'audio/mpeg',
          size: 1024 * 1024 * 5.1,
          status: 'uploading',
          percent: 45,
        },
        {
          id: 'file-video-5',
          name: 'product-demo.mp4',
          mimeType: 'video/mp4',
          size: 1024 * 1024 * 120,
          status: 'error',
          error: '文件过大，上传超时',
        },
      ]);

      return { nonImageFiles };
    },
    template: `
      <div style="max-width: 550px;">
        <h4 style="margin-bottom: 8px; color: #374151; font-weight: 600;">各种非图片文件匹配
          (文档、代码、压缩包、音视频)</h4>
        <CaUpload
          v-model="nonImageFiles"
          accept=".doc,.docx,.pdf,.zip,.rar,.ts,.js,.mp3,.mp4"
          multiple
        >
          <template #tip>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
              支持上传文档、代码文件、压缩包以及音视频等多媒体文件
            </div>
          </template>
        </CaUpload>
      </div>
    `,
  }),
};