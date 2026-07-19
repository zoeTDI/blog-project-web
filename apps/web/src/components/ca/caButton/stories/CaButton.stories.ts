import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CaButton } from '@/components/ca/caButton';
import { HeroIcon } from '@/components/icon';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { h } from 'vue';
import { fn } from 'storybook/test';

const iconOption = {
  无图标: null,
  箭头: () => h(HeroIcon, { icon: ArrowRightIcon, size: 24 }),
  搜索: () => h(HeroIcon, { icon: MagnifyingGlassIcon, size: 24 }),
};

const meta = {
  title: 'Component/Ca/CaButton',
  component: CaButton,
  tags: ['autodocs'],
  argTypes: {
    accentColor: {
      name: '自定义强调色',
      control: 'color',
    },
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
    icon: {
      control: 'select',
      options: Object.keys(iconOption),
      mapping: iconOption,
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    hoverEffect: {
      control: 'select',
      options: ['none', 'expand'],
    },
    nativeType: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
  },
  args: {
    accentColor: '#aa3bff',
    type: 'primary',
    size: 'M',
    loading: false,
    disabled: false,
    block: false,
    round: false,
    iconPosition: 'left',
    hoverEffect: 'none',
    nativeType: 'button',
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
      <div :style="{ '--color-accent': args.accentColor }">
        <ca-button v-bind="args">Primary</ca-button>
      </div>
    `,
  }),
};

export const Text: Story = {
  args: {
    accentColor: '#aa3bff',
    type: 'text',
    size: 'M',
    loading: false,
    disabled: false,
    block: false,
    round: false,
    iconPosition: 'left',
    hoverEffect: 'none',
    nativeType: 'button',
  },

  render: (args) => ({
    components: {
      CaButton,
    },

    setup() {
      return { args };
    },

    template: `
      <div :style="{ '--color-accent': args.accentColor }">
        <ca-button v-bind="args">Text</ca-button>
      </div>
    `,
  }),
};

export const Outline: Story = {
  args: {
    accentColor: '#aa3bff',
    type: 'outline',
    size: 'M',
    loading: false,
    disabled: false,
    block: false,
    round: false,
    iconPosition: 'left',
    hoverEffect: 'none',
    nativeType: 'button',
  },

  render: (args) => ({
    components: {
      CaButton,
    },

    setup() {
      return { args };
    },

    template: `
      <div :style="{ '--color-accent': args.accentColor }">
        <ca-button v-bind="args">Outline</ca-button>
      </div>
    `,
  }),
};

export const WithIconCaButton: Story = {
  args: {
    type: 'primary',
    size: 'M',
    icon: '箭头',
    iconPosition: 'left',
  },
  render: (args) => ({
    components: { CaButton },
    setup() {
      return { args };
    },
    template: `
      <div :style="{ '--color-accent': args.accentColor }">
        <ca-button v-bind="args">带图标</ca-button>
      </div>
    `,
  }),
};