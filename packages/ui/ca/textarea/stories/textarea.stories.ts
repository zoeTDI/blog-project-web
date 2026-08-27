import { CaTextarea } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Textarea',
  component: CaTextarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: ``,
      },
    },
  },
  argTypes: {
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
    rows: {
      control: { type: 'number', step: 1 },
    },
    disabled: {
      control: { type: 'boolean', default: false },
    },
    readonly: {
      control: { type: 'boolean', default: false },
    },
  },
  args: {
    radius: false,
    border: true,
    size: 'M',
    resize: false,
    horizontal: false,
    vertical: false,
    disabled: false,
    readonly: false,
  },
} satisfies Meta<typeof CaTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: (args) => ({
    components: { CaTextarea },
    setup() {
      return { args };
    },
    template: `
      <CaTextarea v-bind="args" />
    `,
  }),
};

export const Pinned: Story = {
  parameters: {
    docs: {
      description: {
        story: '',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    width: 600,
    height: 300,
  },
  render: (args) => ({
    components: { CaTextarea },
    setup() {
      return { args };
    },
    template: `
      <div style="outline: 1px dashed red; height: 600px; width: 400px">
        <CaTextarea v-bind="args" />
      </div>
    `,
  }),
};

export const Config: Story = {
  parameters: {
    docs: {
      description: {
        story: '',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    resize: true,
  },
  render: (args) => ({
    components: { CaTextarea },
    setup() {
      return { args };
    },
    template: `
      <div style="outline: 1px dashed red; height: 600px; width: 400px">
        <CaTextarea v-bind="args" />
      </div>
    `,
  }),
};

export const Emits: Story = {
  parameters: {
    docs: {
      description: {
        story: '',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {},
  render: (args) => ({
    components: { CaTextarea },
    setup() {
      const handleInput = (val: string) => {
        console.log('🚀 ~ handleInput ~ val: ', val);
      };
      const handleChange = (val: string) => {
        console.log('🚀 ~ handleChange ~ val: ', val);
      };
      return { args, handleInput, handleChange };
    },
    template: `
      <CaTextarea v-bind="args" @input="handleInput" @change="handleChange" />
    `,
  }),
};
