import { CaRadio, CaRadioGroup, type CaRadioProps } from '../index.ts';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta = {
  title: 'Component/Radio',
  component: CaRadioGroup,
  subcomponents: { CaRadio },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
    },
    layout: {
      control: 'select',
      options: ['list', 'flow'],
    },
  },
  args: {
    size: 'M',
    layout: 'list',
  },
} satisfies Meta<typeof CaRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // args: {},
  render: (args) => ({
    components: { CaRadio, CaRadioGroup },
    setup() {
      const value = ref<string>('');
      const radioOptions: CaRadioProps[] = [
        { label: 'Radio 1', value: 'Value 1' },
        { label: 'Radio 2', value: 'Value 2' },
        { label: 'Radio 3', value: 'Value 3' },
      ];
      return { args, value, radioOptions };
    },
    template: `
      <ca-radio-group :model-value="value" v-bind="args">
        <ca-radio v-for="opt in radioOptions" :key="opt.value" :value="opt.value" :label="opt.label"
                  :icon="opt?.icon" />
      </ca-radio-group>
    `,
  }),
};

export const Size: Story = {
  // args: {},
  render: (args) => ({
    components: { CaRadio, CaRadioGroup },
    setup() {
      const value = ref<string>('');
      const radioOptions: CaRadioProps[] = [
        { label: 'Radio 1', value: 'Value 1' },
        { label: 'Radio 2', value: 'Value 2' },
        { label: 'Radio 3', value: 'Value 3' },
      ];
      return { args, value, radioOptions };
    },
    template: `
      <ca-radio-group :model-value="value" size="S" :layout="args.layout">
        <ca-radio v-for="opt in radioOptions" :key="opt.value" :value="opt.value" :label="opt.label"
                  :icon="opt?.icon" />
      </ca-radio-group>
      <ca-radio-group :model-value="value" size="M" :layout="args.layout">
        <ca-radio v-for="opt in radioOptions" :key="opt.value" :value="opt.value" :label="opt.label"
                  :icon="opt?.icon" />
      </ca-radio-group>
      <ca-radio-group :model-value="value" size="L" :layout="args.layout">
        <ca-radio v-for="opt in radioOptions" :key="opt.value" :value="opt.value" :label="opt.label"
                  :icon="opt?.icon" />
      </ca-radio-group>
    `,
  }),
};
