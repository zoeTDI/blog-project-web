import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CaButton } from '@/components/ca/caButton';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { fn } from 'storybook/test';

const meta = {
  title: 'Component/Ca/CaButton',
  component: CaButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'text', 'outline'],
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    block: {
      control: 'boolean',
    },
    round: {
      control: 'boolean',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    hoverEffect: {
      control: 'select',
      options: ['none', 'expand'],
    },
  },
  args: {
    type: 'primary',
    size: 'M',
    loading: false,
    disabled: false,
    block: false,
    round: false,
    iconPosition: 'left',
    hoverEffect: 'none',
    onClick: fn(),
  },
} satisfies Meta<typeof CaButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: 'primary',
    size: 'M',
  },
  render: (args) => ({
    components: { CaButton },
    setup() {
      return { args };
    },
    template: `
      <div>
        <ca-button v-bind="args">Primary</ca-button>
      </div>
    `,
  }),
};

export const Text: Story = {
  args: {
    type: 'text',
    size: 'M',
    loading: false,
    disabled: false,
    block: false,
    round: false,
    iconPosition: 'left',
    hoverEffect: 'none',
  },

  render: (args) => ({
    components: {
      CaButton,
    },

    setup() {
      return { args };
    },

    template: `
      <div>
        <ca-button v-bind="args">Text</ca-button>
      </div>
    `,
  }),
};

export const Outline: Story = {
  args: {
    type: 'outline',
    size: 'M',
    loading: false,
    disabled: false,
    block: false,
    round: false,
    iconPosition: 'left',
    hoverEffect: 'none',
  },

  render: (args) => ({
    components: {
      CaButton,
    },

    setup() {
      return { args };
    },

    template: `
      <div>
        <ca-button v-bind="args">Outline</ca-button>
      </div>
    `,
  }),
};

export const WithIconCaButton: Story = {
  args: {
    type: 'primary',
    size: 'M',
    icon: ArrowRightIcon,
    iconPosition: 'left',
  },
  render: (args) => ({
    components: { CaButton },
    setup() {
      return { args };
    },
    template: `
      <div>
        <ca-button v-bind="args">带图标</ca-button>
      </div>
    `,
  }),
};