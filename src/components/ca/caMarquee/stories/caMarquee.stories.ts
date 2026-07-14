import { CaMarquee } from '@/components/ca/caMarquee';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Component/Ca/CaMarquee',
  component: CaMarquee,
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
    content: {
      control: 'text',
    },
    closeable: {
      control: 'boolean',
    },
    duration: {
      control: 'number',
    },
    scrollable: {
      control: 'boolean',
    },
    speed: {
      control: 'number',
    },
  },
  args: {
    icon: 'info',
    content: 'Default Content',
    closeable: false,
    duration: 10000,
    scrollable: true,
    speed: 50,
  },
} satisfies Meta<typeof CaMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { CaMarquee },
    setup() {
      return { args };
    },
    template: `
      <CaMarquee v-bind="args"></CaMarquee>
    `,
  }),
};

export const CloseAble: Story = {
  args: {
    content: 'Default Content',
    closeable: true,
    duration: 10000,
    scrollable: true,
    speed: 50,
  },

  render: (args) => ({
    components: {
      CaMarquee,
    },

    setup() {
      return { args };
    },

    template: `
      <CaMarquee v-bind="args"></CaMarquee>
    `,
  }),
};

export const LongText: Story = {
  args: {
    icon: 'info',
    content:
      'Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text',
    closeable: false,
    duration: 10000,
    scrollable: true,
    speed: 50,
  },

  render: (args) => ({
    components: {
      CaMarquee,
    },

    setup() {
      return { args };
    },

    template: `
      <CaMarquee v-bind="args"></CaMarquee>
    `,
  }),
};
