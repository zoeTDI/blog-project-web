import {
  CaSelect,
  CaSelectOption,
  CaSelectGroup,
} from '@/components/ca/caSelect';
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

const meta = {
  title: 'Component/Ca/CaSelect',
  component: CaSelect,
  subcomponents: { CaSelectOption, CaSelectGroup },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    placeholder: 'Select',
    size: 'M',
    disabled: false,
  },
} satisfies Meta<typeof CaSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      return { args };
    },
    template: `
      <CaSelect v-bind="args">
        <CaSelectOption v-for="i in 10" :key="i" :value="i" :label="'value ' + i" />
      </CaSelect>
    `,
  }),
};

export const DefaultValue: Story = {
  args: {},
  render: (args) => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      const selectedValue = ref(2);
      return { args, selectedValue };
    },
    template: `
      <CaSelect v-bind="args" v-model="selectedValue">
        <CaSelectOption v-for="i in 10" :key="i" :value="i" :label="'value ' + i" />
      </CaSelect>
    `,
  }),
};

export const Size: Story = {
  args: {},
  render: (args) => ({
    components: { CaSelect, CaSelectOption },
    setup() {
      return { args, size: ['S', 'M', 'L'] };
    },
    template: `
      <div style="display: flex; gap: 20px;">
        <CaSelect v-for="item in size" :key="item" :size="item">
          <CaSelectOption v-for="i in 10" :key="i" :value="i" :label="'value ' + i" />
        </CaSelect>
      </div>
    `,
  }),
};

export const Group: Story = {
  args: {},
  render: (args) => ({
    components: { CaSelect, CaSelectGroup, CaSelectOption },
    setup() {
      const data = [
        {
          label: 'Group 1',
          options: [
            { label: 'Value 1', value: 'Value 1' },
            { label: 'Value 2', value: 'Value 2' },
            { label: 'Value 3', value: 'Value 3' },
          ],
        },
        {
          label: 'Group 2',
          options: [
            { label: 'Value 1', value: 'Value 1' },
            { label: 'Value 2', value: 'Value 2' },
            { label: 'Value 3', value: 'Value 3' },
          ],
        },
      ];
      return { args, data };
    },
    template: `
      <CaSelect>
        <CaSelectGroup v-for="group in data" :key="group.label" :label="group.label">
          <CaSelectOption v-for="option in group.options" :key="option.value" :value="option.value"
                          :label="option.label" />
        </CaSelectGroup>
      </CaSelect>
    `,
  }),
};

export const LongLabel: Story = {
  args: {},
  render: (args) => ({
    components: { CaSelect, CaSelectGroup, CaSelectOption },
    setup() {
      const data = [
        {
          label:
            'Group 1 Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text',
          options: [
            {
              label:
                'Value 1 Long Text Long Text Long Text Long Text Long Text Long Text Long Text Long Text',
              value: 'Value 1',
            },
            { label: 'Value 2', value: 'Value 2' },
            { label: 'Value 3', value: 'Value 3' },
          ],
        },
        {
          label: 'Group 2',
          options: [
            { label: 'Value 4', value: 'Value 4' },
            { label: 'Value 5', value: 'Value 5' },
            { label: 'Value 6', value: 'Value 6' },
          ],
        },
      ];
      return { args, data };
    },
    template: `
      <CaSelect>
        <CaSelectGroup v-for="group in data" :key="group.label" :label="group.label">
          <CaSelectOption v-for="option in group.options" :key="option.value" :value="option.value"
                          :label="option.label" />
        </CaSelectGroup>
      </CaSelect>
    `,
  }),
};